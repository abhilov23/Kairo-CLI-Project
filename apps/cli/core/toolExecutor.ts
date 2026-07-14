import { registry } from "../tools/registry.js";
import { ToolCallResult } from "./types.js";
import {
  isDangerousCommand,
  askConfirmation,
  isProtectedFile,
} from "./safety.js";
import chalk from "chalk";
import { showWorking, hideThinking, showWalk } from "../ui/ui.js";

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

export async function executeToolCall(
  tc: ToolCallResult,
  messages: any[],
  safetyCheck?: (tc: ToolCallResult) => Promise<boolean>,
): Promise<ToolExecutionResult> {
  try {
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

    const args = JSON.parse(tc.function.arguments);
    showWorking();
    const result = await registry.execute(tc.function.name, args);
    hideThinking();
    messages.push({
      role: "tool",
      tool_call_id: tc.id,
      content: JSON.stringify(result),
    });
    return { cancelled: false };
  } catch (err) {
    hideThinking();
    console.log(chalk.red(`  ✗ ${tc.function.name} failed`));
    messages.push({
      role: "tool",
      tool_call_id: tc.id,
      content: JSON.stringify({ error: String(err) }),
    });
    return { cancelled: false };
  }
}

export async function executeToolCalls(
  toolCalls: ToolCallResult[],
  messages: any[],
  safetyCheck?: (tc: ToolCallResult) => Promise<boolean>,
): Promise<void> {
  for (const tc of toolCalls) {
    await executeToolCall(tc, messages, safetyCheck);
  }
}
