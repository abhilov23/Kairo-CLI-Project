import chalk from "chalk";

chalk.level = 3;

let spinnerTimer: ReturnType<typeof setInterval> | null = null;

const SPINNER_CHARS = ["\u280b", "\u2819", "\u2839", "\u2838", "\u283c", "\u2834", "\u2826", "\u2827", "\u2807", "\u280f"];

export function startSpinner(label = "Thinking") {
  stopSpinner();
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
