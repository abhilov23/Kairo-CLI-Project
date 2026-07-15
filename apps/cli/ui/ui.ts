import chalk from "chalk";
import boxen from "boxen";
import readline from "readline";
import { execSync } from "child_process";
import { renderMarkdown } from "./book.js";
import { startSpinner, stopSpinner } from "./mascot.js";

chalk.level = 3;

const LINE = chalk.dim("\u2500".repeat(48));

function gitBranch(): string {
  try {
    return execSync("git branch --show-current 2>nul", { encoding: "utf8", timeout: 2000 }).trim();
  } catch { return ""; }
}

export async function printBanner(provider?: string, model?: string) {
  const tag = provider && model ? ` ${chalk.dim(`${provider}/${model}`)}` : "";
  const content = `${chalk.bold("KairoCLI")}${tag}`;
  const banner = boxen(content, {
    padding: { top: 0, bottom: 0, left: 2, right: 2 },
    borderColor: "cyan",
    borderStyle: "round",
  });
  console.log(banner);
}

export function printUser(text: string) {
  console.log();
  console.log(` ${chalk.green.bold("\u2503 You")}`);
  console.log(` ${chalk.green(LINE)}`);
  for (const line of text.split("\n")) {
    console.log(` ${chalk.green(line)}`);
  }
}

export function printAssistant(text: string) {
  console.log();
  console.log(` ${chalk.blue.bold("\u2503 Kairo")}`);
  console.log(` ${chalk.blue(LINE)}`);
  const rendered = renderMarkdown(text);
  for (const line of rendered.split("\n")) {
    console.log(` ${line}`);
  }
}

export function printTool(toolName: string, status: "running" | "done" | "error" = "running") {
  const icon = status === "done" ? chalk.green("\u2713") : status === "error" ? chalk.red("\u2717") : chalk.yellow("\u27f3");
  const color = status === "done" ? chalk.dim : status === "error" ? chalk.red : chalk.yellow;
  console.log(`   ${icon} ${color(toolName)}`);
}

export function printError(error: string) {
  console.log(chalk.red(`\n \u2717 ${error}`));
}

export function printSuccess(text: string) {
  console.log(` ${chalk.dim("\u2501")} ${text}`);
}

export function showThinking(label = "Thinking") { startSpinner(label); }
export function hideThinking() { stopSpinner(); }
export function showWorking(label = "Working") { startSpinner(label); }

export function getUserInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => { rl.close(); resolve(answer); });
  });
}

export function getPrompt(cwd: string): string {
  const dir = cwd.split("\\").pop() || cwd;
  const branch = gitBranch();
  const parts = [`\u276f`];
  if (branch) parts.push(chalk.dim(branch));
  parts.push(chalk.dim(dir));
  return chalk.cyan(`\n ${parts.join(" ")} `);
}
