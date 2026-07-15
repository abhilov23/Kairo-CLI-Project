import chalk from "chalk";
import { hideThinking } from "./ui.js";

interface SubagentRecord {
  id: number;
  task: string;
  status: "running" | "done" | "error";
  startTime: number;
  output?: string;
}

class SubagentPanel {
  private agents: SubagentRecord[] = [];
  private nextId = 1;
  private timer: ReturnType<typeof setInterval> | null = null;
  private lineCount = 0;

  register(task: string): number {
    hideThinking();

    const id = this.nextId++;
    this.agents.push({ id, task, status: "running", startTime: Date.now() });
    this.render();

    if (!this.timer) {
      this.timer = setInterval(() => this.render(), 1000);
    }

    return id;
  }

  complete(id: number, output?: string) {
    const agent = this.agents.find(a => a.id === id);
    if (agent) {
      agent.status = "done";
      agent.output = output;
    }
    this.render();
    setTimeout(() => { this.remove(id); }, 2000);
  }

  error(id: number, err?: string) {
    const agent = this.agents.find(a => a.id === id);
    if (agent) {
      agent.status = "error";
      agent.output = err;
    }
    this.render();
    setTimeout(() => { this.remove(id); }, 3000);
  }

  get activeCount(): number {
    return this.agents.length;
  }

  hasRunning(): boolean {
    return this.agents.some(a => a.status === "running");
  }

  private remove(id: number) {
    this.agents = this.agents.filter(a => a.id !== id);
    if (this.agents.length === 0) {
      this.clear();
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    } else {
      this.render();
    }
  }

  private clear() {
    if (this.lineCount > 0) {
      process.stdout.write(`\x1B[${this.lineCount}A\x1B[0J`);
      this.lineCount = 0;
    }
  }

  private render() {
    if (this.agents.length === 0) return;
    this.clear();

    const lines: string[] = [];
    const now = Date.now();
    const headerColor = chalk.hex("#a78bfa");

    lines.push(headerColor("◇ Agents"));

    for (const a of this.agents) {
      const elapsed = ((now - a.startTime) / 1000).toFixed(1);
      const icon = a.status === "running" ? chalk.yellow("⟳")
        : a.status === "done" ? chalk.green("✓")
        : chalk.red("✗");
      const taskStr = a.task.length > 55 ? a.task.slice(0, 52) + "…" : a.task;
      const elapsColor = a.status === "running" ? chalk.dim : chalk.dim;

      lines.push(`  ${icon} ${chalk.bold(`#${a.id}`)} ${chalk.dim(taskStr)} ${elapsColor(elapsed + "s")}`);

      if (a.output && a.status !== "running") {
        const preview = a.output.length > 65 ? a.output.slice(0, 62) + "…" : a.output;
        lines.push(`    ${chalk.green(preview)}`);
      }
    }

    const out = lines.join("\n") + "\n";
    process.stdout.write(out);
    this.lineCount = lines.length;
  }
}

export const subagentPanel = new SubagentPanel();
