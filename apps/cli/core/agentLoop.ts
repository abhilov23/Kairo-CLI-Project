import chalk from "chalk";
import { getClient } from "../providers/getClient.js";
import { streamResponse } from "./streamHandler.js";
import { executeToolCalls } from "./toolExecutor.js";
import { ToolCallResult } from "./types.js";
import { handleInternalCommand } from "./commandRouter.js";
import { systemPrompt } from "../prompt/prompt.js";
import { loadAuthSession } from "../config/authManager.js";
import { syncSession, updateSessionToken } from "./syncSessions.js";
import { updateAuthSession } from "../config/authManager.js";
import {
  getUserInput,
  printBanner,
  printUser,
  printAssistant,
  printTool,
  printSuccess,
  showThinking,
  hideThinking,
  getPrompt,
} from "../ui/ui.js";
import {
  loadSessionMessages,
  loadSessionState,
  saveSessionMessages,
} from "../runtime/sessionManager.js";

function serializeMessages(messages: any[]): unknown[] {
  return messages.map((m) => {
    const base: Record<string, unknown> = { role: m.role, content: m.content ?? "" };
    if (m.tool_calls) base.tool_calls = m.tool_calls;
    if (m.tool_call_id) base.tool_call_id = m.tool_call_id;
    if (m.name) base.name = m.name;
    return base;
  });
}

async function enrichPromptWithAuth(basePrompt: string): Promise<string> {
  const authSession = await loadAuthSession();
  if (!authSession?.userProfile) return basePrompt;

  const profile = authSession.userProfile as Record<string, unknown>;
  const name = profile.name || profile.displayName || profile.username || "";
  const email = profile.email || "";

  if (!name && !email) return basePrompt;

  return (
    basePrompt +
    `\n\nAuthentication Context:\n` +
    `- User: ${name || "Unknown"}${email ? ` (${email})` : ""}\n` +
    `- Authenticated since: ${new Date(authSession.createdAt).toLocaleString()}\n`
  );
}

async function agentLoop(
  client: any,
  model: string,
  messages: any[],
  safetyCheck?: (tc: ToolCallResult) => Promise<boolean>,
  baselinePromptTokens = 0,
): Promise<{ tokens: number; lastPromptTokens: number }> {
  let turnTokens = 0;
  let lastPromptTokens = 0;

  while (true) {
    showThinking();

    const { fullContent, toolCalls, tokenUsage } = await streamResponse(client, model, messages);
    if (tokenUsage?.total_tokens) {
      const prompt = tokenUsage.prompt_tokens ?? 0;
      lastPromptTokens = prompt;
      if (baselinePromptTokens > 0) {
        turnTokens += Math.max(0, tokenUsage.total_tokens - baselinePromptTokens);
        baselinePromptTokens = 0;
      } else {
        turnTokens += tokenUsage.total_tokens;
      }
    }

    hideThinking();

    messages.push({
      role: "assistant",
      content: fullContent || null,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
    });

    if (fullContent) {
      printAssistant(fullContent);
    }

    if (toolCalls.length === 0) {
      return { tokens: turnTokens, lastPromptTokens };
    }

    for (const tc of toolCalls) {
      if (tc.function.name !== "spawn_agent") {
        printTool(tc.function.name, "running");
      }
    }

    await executeToolCalls(toolCalls, messages, safetyCheck);

    for (const tc of toolCalls) {
      if (tc.function.name !== "spawn_agent") {
        printTool(tc.function.name, "done");
      }
    }
  }
}

export async function startAgent() {
  const { client, model, provider } = getClient();

  const enrichedPrompt = await enrichPromptWithAuth(systemPrompt);
  const messages: any[] = [{ role: "system", content: enrichedPrompt }];

  const session = await loadSessionState();
  const restoredMessages = await loadSessionMessages();

  if (restoredMessages.length) {
    messages.push(...restoredMessages);
  }

  let turnCount = session.execution.turnCount ?? 0;
  let lastToolName: string | null = session.execution.lastToolName ?? null;
  let totalTokens = 0;
  let sessionId: string | null = null;

  printBanner(provider, model);
  printSuccess("Type /help for commands. Type exit to quit.");

  while (true) {
    const promptLabel = getPrompt(process.cwd());
    const userInput = await getUserInput(promptLabel);

    if (!userInput.trim()) continue;

    if (userInput.trim() === "exit") {
      try {
        await saveSessionMessages(messages, {
          execution: { turnCount, lastToolName, lastError: null, lastUpdatedAt: new Date().toISOString(), totalTokens, lastPromptTokens: session.execution.lastPromptTokens },
          workspace: { cwd: process.cwd(), lastUpdatedAt: new Date().toISOString() },
        });
      } catch { /* silent */ }

      try {
        const config = getClient();
        const firstUserMsg = messages.find((m: any) => m.role === "user");
        const title = firstUserMsg?.content?.substring(0, 80) || "Kairo Session";
        if (sessionId) {
          await updateSessionToken(sessionId, totalTokens, 5_000, serializeMessages(messages));
        } else {
          await syncSession({
            provider: config.provider,
            model: config.model,
            tokenCount: totalTokens,
            title,
            workspace: process.cwd(),
            messages: serializeMessages(messages),
          }, 5_000);
        }
      } catch { /* silent */ }

      console.log(chalk.cyan("\n Goodbye!"));
      process.exit(0);
    }

    if (userInput.startsWith("/") || userInput === "clear" || userInput === "cls") {
      await handleInternalCommand(userInput.trim(), messages);
      if (userInput === "/clear") messages.length = 1;
      // If auth was cleared (e.g., /logout), reset session tracking
      // so the next message creates a fresh session instead of
      // trying to update the deleted old one
      const authStillValid = await loadAuthSession();
      if (!authStillValid) {
        messages.length = 1;
        sessionId = null;
        totalTokens = 0;
      }
      continue;
    }

    messages.push({ role: "user", content: userInput });
    turnCount += 1;

    printUser(userInput);
    const agentResult = await agentLoop(client, model, messages, undefined, session.execution.lastPromptTokens);
    totalTokens += agentResult.tokens;
    session.execution.lastPromptTokens = agentResult.lastPromptTokens;

    if (!sessionId) {
      try {
        const config = getClient();
        const firstUserMsg = messages.find((m: any) => m.role === "user");
        const title = firstUserMsg?.content?.substring(0, 80) || "Kairo Session";
        sessionId = await syncSession({
          provider: config.provider,
          model: config.model,
          tokenCount: totalTokens,
          title,
          workspace: process.cwd(),
          messages: serializeMessages(messages),
        }, 5_000);
        if (sessionId) {
          await updateAuthSession({ currentSessionId: sessionId }).catch(() => {});
        }
      } catch { /* silent */ }
    } else if (sessionId) {
      try {
        await updateSessionToken(sessionId, totalTokens, 5_000, serializeMessages(messages));
        await updateAuthSession({ currentSessionId: sessionId }).catch(() => {});
      } catch { /* silent */ }
    }

    await saveSessionMessages(messages, {
      execution: { turnCount, lastToolName, lastError: null, lastUpdatedAt: new Date().toISOString(), totalTokens, lastPromptTokens: session.execution.lastPromptTokens },
      workspace: { cwd: process.cwd(), lastUpdatedAt: new Date().toISOString() },
    });
  }
}

export async function runTask(task: string) {
  const { client, model, provider } = getClient();
  const enrichedPrompt = await enrichPromptWithAuth(systemPrompt);
  const messages: any[] = [
    { role: "system", content: enrichedPrompt },
    { role: "user", content: task },
  ];

  showThinking();
  const taskResult = await agentLoop(client, model, messages);
  hideThinking();

  try {
    await syncSession({
      provider,
      model,
      tokenCount: taskResult.tokens,
      title: task.substring(0, 80) || "Kairo Task",
      workspace: process.cwd(),
      messages: serializeMessages(messages),
    }, 5_000);
  } catch { /* silent */ }
}
