import { BASE_WORKER_PROMPT } from '../prompt/prompt.js';
import { Agent, Runner } from "@openai/agents";
import { OpenAIProvider } from "@openai/agents";
import { z } from "zod";
import { loadConfig } from "../config/configManager.js";

export const spawnAgent = {
  name: "spawn_agent",
  description: "Spawn a focused worker agent to complete a subtask.",
  parameters: z.object({
    task: z.string().describe("The task for the worker."),
    instructions: z
      .string()
      .optional()
      .describe("Additional instructions for the worker."),
  }),

  execute: async ({
    task,
    instructions,
  }: {
    task: string;
    instructions?: string;
  }) => {
    let workerInstructions = BASE_WORKER_PROMPT;
    if (instructions) {
      workerInstructions += `\n\n# Specialization\n${instructions}`;
    }

    const config = loadConfig();
    const provider = new OpenAIProvider({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });

    const runner = new Runner({
      modelProvider: provider,
      model: config.model,
      tracingDisabled: true,
    });

    const worker = new Agent({
      name: "Worker",
      instructions: workerInstructions,
    });

    const result = await runner.run(worker, task);

    return result.finalOutput ?? "(no output)";
  },
};