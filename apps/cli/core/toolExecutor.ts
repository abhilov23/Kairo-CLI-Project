import { registry } from "../tools/registry.js";
import { ToolCallResult } from "./types.js";
import {
  isDangerousCommand,
  askConfirmation,
  isProtectedFile,
} from "./safety.js";
import chalk from "chalk";
import { showWorking, hideThinking } from "../ui/ui.js";

export interface ToolExecutionResult {
  cancelled: boolean;
}

async function checkSafety(tc: ToolCallResult): Promise<boolean> {
  if (tc.function.name === "execute_command") {
    const args = JSON.parse(tc.function.arguments);
    const command = String(args.command ?? "");
    if (isDangerousCommand(command)) {
      return await askConfirmation(
        `Dangerous command detected:\n${command}\nContinue?`
      );
    }
  }

  if (tc.function.name === "write_file" || tc.function.name === "replace_in_file") {
    const args = JSON.parse(tc.function.arguments);
    const filePath = String(args.filePath ?? args.path ?? "");
    if (isProtectedFile(filePath)) {
      return await askConfirmation(
        `Protected file detected:\n${filePath}\nContinue?`
      );
    }
  }

  return true;
}

async function executeToolCallInternal(
  tc: ToolCallResult,
  messages: any[],
): Promise<void> {
  try {
    const args = JSON.parse(tc.function.arguments);
    const result = await registry.execute(tc.function.name, args);
    messages.push({
      role: "tool",
      tool_call_id: tc.id,
      content: JSON.stringify(result),
    });
  } catch (err) {
    console.log(chalk.red(`  ✗ ${tc.function.name} failed`));
    messages.push({
      role: "tool",
      tool_call_id: tc.id,
      content: JSON.stringify({ error: String(err) }),
    });
  }
}

export async function executeToolCall(
  tc: ToolCallResult,
  messages: any[],
  safetyCheck?: (tc: ToolCallResult) => Promise<boolean>,
): Promise<ToolExecutionResult> {
  const checkFn = safetyCheck ?? checkSafety;
  const proceed = await checkFn(tc);
  if (!proceed) {
    console.log(chalk.red(`  ✗ ${tc.function.name} cancelled`));
    messages.push({
      role: "tool",
      tool_call_id: tc.id,
      content: JSON.stringify({ error: "Command cancelled by user" }),
    });
    return { cancelled: true };
  }

  showWorking();
  try {
    await executeToolCallInternal(tc, messages);
    return { cancelled: false };
  } finally {
    hideThinking();
  }
}

export async function executeToolCalls(
  toolCalls: ToolCallResult[],
  messages: any[],
  safetyCheck?: (tc: ToolCallResult) => Promise<boolean>,
): Promise<void> {
  if (toolCalls.length === 0) return;

  const checkFn = safetyCheck ?? checkSafety;

  const active: ToolCallResult[] = [];

  for (const tc of toolCalls) {
    const proceed = await checkFn(tc);
    if (!proceed) {
      console.log(chalk.red(`  ✗ ${tc.function.name} cancelled`));
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify({ error: "Command cancelled by user" }),
      });
    } else {
      active.push(tc);
    }
  }

  if (active.length === 0) return;

  const hasSpawnAgent = active.some(tc => tc.function.name === "spawn_agent");

  if (!hasSpawnAgent) {
    showWorking();
  }

  await Promise.all(active.map(tc => executeToolCallInternal(tc, messages)));

  if (!hasSpawnAgent) {
    hideThinking();
  }
}
