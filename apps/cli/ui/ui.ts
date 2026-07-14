import chalk from "chalk";
import boxen from "boxen";
import readline from "readline";
import { renderMarkdown, statusBar } from "./book.js";
import { renderBanner, startSpinner, stopSpinner, walk, renderInline } from "./mascot.js";

chalk.level = 3;

const LINE = chalk.dim("─".repeat(60));

// ─── Banner ───────────────────────────────────────────────────────

export async function printBanner() {
  const bannerContent = await renderBanner();
  const banner = boxen(bannerContent, {
    padding: 1,
    borderColor: "cyan",
    borderStyle: "round",
  });
  console.log(banner);
}

// ─── Message helpers ──────────────────────────────────────────────

export function printUser(text: string) {
  console.log();
  console.log(` ${chalk.green.bold("┃ You")}`);
  console.log(` ${LINE}`);
  const lines = text.split("\n");
  for (const line of lines) {
    console.log(` ${chalk.green(line)}`);
  }
}

export function printAssistantHeader() {
  console.log(` ${chalk.blue.bold("┃ Kairo")}`);
  console.log(` ${LINE}`);
}

export function printAssistant(text: string) {
  printAssistantHeader();
  const rendered = renderMarkdown(text);
  const lines = rendered.split("\n");
  for (const line of lines) {
    console.log(` ${line}`);
  }
}

export function printTool(toolName: string, status: "running" | "done" | "error" = "running") {
  const icon = status === "done" ? chalk.green("✓") : status === "error" ? chalk.red("✗") : chalk.yellow("⟳");
  const color = status === "done" ? chalk.dim : status === "error" ? chalk.red : chalk.yellow;
  console.log(`  ${icon} ${color(toolName)}`);
}

export function printError(error: string) {
  console.log(chalk.red.bold(`\n ┃ Error`));
  console.log(` ${LINE}`);
  console.log(` ${chalk.red(error)}`);
}

export function printSuccess(text: string) {
  console.log(chalk.greenBright(`\n ${text}`));
}

// ─── Thinking / Spinner ───────────────────────────────────────────

export function showThinking(label = "Thinking") {
  startSpinner("think", label);
}

export function hideThinking() {
  stopSpinner();
}

export function showWorking(label = "Working") {
  startSpinner("work", label);
}

export async function showWalk() {
  await walk(2);
}

// ─── Status ───────────────────────────────────────────────────────

export function printStatus(mode: string, model: string) {
  statusBar(mode, model, renderInline());
}

// ─── Input ────────────────────────────────────────────────────────

export function getUserInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export function getPrompt(cwd: string): string {
  const dir = cwd.split("\\").pop() || cwd;
  return chalk.cyan(`\n ❯ ${chalk.dim(dir)} `);
}
