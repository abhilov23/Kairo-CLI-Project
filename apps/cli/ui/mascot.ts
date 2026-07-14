import chalk from "chalk";

chalk.level = 3;

type Mood = "idle" | "think" | "work" | "happy" | "sad" | "wake";

const FACES: Record<Mood, { eyes: string; mouth: string }> = {
  idle:  { eyes: "◕◕", mouth: "⌣" },
  think: { eyes: "◔◔", mouth: "·" },
  work:  { eyes: "◉◉", mouth: "─" },
  happy: { eyes: "◕◕", mouth: "⌣" },
  sad:   { eyes: "××", mouth: "─" },
  wake:  { eyes: "○○", mouth: "⌒" },
};

function mascotLines(mood: Mood): string[] {
  const f = FACES[mood];
  return [
    `  ${chalk.cyan("╭─────╮")}`,
    `  ${chalk.cyan("│")} ${chalk.white(f.eyes)} ${chalk.cyan("│")}`,
    `  ${chalk.cyan("│")}  ${chalk.white(f.mouth)}  ${chalk.cyan("│")}`,
    `  ${chalk.cyan("╰──┬──╯")}`,
    `    ${chalk.cyan("╱│╲")}`,
    `   ${chalk.cyan("╱ ╲")}`,
  ];
}

export function render(mood: Mood = "idle"): string {
  return mascotLines(mood).join("\n");
}

export function renderInline(mood: Mood = "idle"): string {
  const f = FACES[mood];
  return chalk.cyan(`╭──╮ │${f.eyes}│ │${f.mouth}│ ╰──╯`);
}

// ─── Banner ─────────────────────────────────────────────────────────

export async function renderBanner(): Promise<string> {
  const lines = mascotLines("idle");
  const out: string[] = [];
  out.push(chalk.cyan.bold(" KairoCLI"));
  out.push("");
  for (const line of lines) {
    out.push(" " + line);
  }
  return out.join("\n");
}

// ─── Spinner  ────────────────────────────

let spinnerTimer: ReturnType<typeof setInterval> | null = null;
let spinnerLabel = "";

const SPINNER_CHARS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function startSpinner(mood: Mood = "think", label = "Thinking") {
  stopSpinner();
  spinnerLabel = label;

  let i = 0;
  process.stdout.write(` ${chalk.cyan(SPINNER_CHARS[0])} ${chalk.dim(label)}`);
  spinnerTimer = setInterval(() => {
    i++;
    process.stdout.write(`\r ${chalk.cyan(SPINNER_CHARS[i % SPINNER_CHARS.length])} ${chalk.dim(label)}`);
  }, 120);
}

export function stopSpinner() {
  if (spinnerTimer) {
    clearInterval(spinnerTimer);
    spinnerTimer = null;
    process.stdout.write("\r\x1B[K");
  }
}

// ─── Walk animation ──────────────────────────────────────────────────

export async function walk(steps = 2): Promise<void> {
  const lines = mascotLines("idle");
  const totalFrames = steps * 4;
  for (let i = 0; i < totalFrames; i++) {
    const offset = Math.floor((i / totalFrames) * 30);
    const pad = " ".repeat(Math.min(offset, 60));
    for (const line of lines) {
      process.stdout.write(pad + line + "\n");
    }
    if (i < totalFrames - 1) {
      process.stdout.write(`\x1B[${lines.length}A`);
    }
    await sleep(60);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
