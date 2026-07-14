import chalk from "chalk";
import { marked } from "marked";
// @ts-expect-error - marked-terminal has no types
import TerminalRenderer from "marked-terminal";

marked.setOptions({
  renderer: new TerminalRenderer(),
} as any);

// ─── Page break ───────────────────────────────────────────────────

export function pageBreak() {
  console.log(chalk.dim(" ── "));
}

// ─── Message header ───────────────────────────────────────────────

export function header(label: string, color = chalk.cyan) {
  console.log();
  console.log(color.bold(` ${label}`));
  console.log(chalk.dim(" ─────────────────────────────────────────────"));
  console.log();
}

// ─── Body text with wrapping ──────────────────────────────────────

export function body(text: string) {
  console.log(` ${text}`);
}

// ─── Code block ───────────────────────────────────────────────────

export function codeBlock(code: string, lang?: string) {
  const lines = code.split("\n");
  console.log();
  console.log(chalk.dim("  ┌─") + (lang ? chalk.dim(` [${lang}]`) : ""));
  for (const line of lines) {
    console.log(chalk.dim("  │") + ` ${chalk.green(line)}`);
  }
  console.log(chalk.dim("  └─"));
  console.log();
}

// ─── Thinking block ────────────────────────────────────────────────

export function thinkingBlock(text: string) {
  console.log(chalk.dim(`  ┆ ${text}`));
}

// ─── Tool call ────────────────────────────────────────────────────

export function toolCall(name: string, status: "running" | "done" | "error" = "running") {
  const icon = status === "done" ? chalk.green("✓") : status === "error" ? chalk.red("✗") : chalk.yellow("⟳");
  console.log(`  ${icon} ${chalk.dim(name)}`);
}

// ─── Status bar ───────────────────────────────────────────────────

export function statusBar(mode: string, model: string, mascot?: string) {
  const cols = (process.stdout as any).columns ?? 60;
  const line = chalk.dim("─".repeat(cols));
  const modeStr = mode === "BUILD" ? chalk.cyan("◉ Build") : chalk.magenta("◉ Plan");
  const info = `${modeStr} ${chalk.dim("›")} ${chalk.dim(model)}`;
  const right = mascot ? ` ${mascot}` : "";
  console.log(`\n${line}`);
  console.log(` ${info}${right}`);
}

// ─── Render full message ──────────────────────────────────────────

export function renderMarkdown(text: string): string {
  return marked(text) as string;
}

export function printMessage(text: string) {
  const rendered = renderMarkdown(text);
  console.log(rendered);
}

// ─── Prompt (enhanced) ────────────────────────────────────────────

export function buildPrompt(cwd: string, mode?: string): string {
  const modeTag = mode ? chalk.cyan(` ${mode === "BUILD" ? "◉" : "◉"}`) : "";
  return chalk.green(`\n You${modeTag} ${chalk.dim(cwd)} ${chalk.dim("›")} `);
}
