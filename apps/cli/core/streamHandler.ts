import { registry } from "../tools/registry.js";
import { ToolCallDelta, ToolCallResult } from "./types.js";

function buildToolCallsFromDelta(deltaToolCalls: ToolCallDelta[]): ToolCallResult[] {
  const acc: Record<number, ToolCallResult> = {};

  for (const tc of deltaToolCalls) {
    if (!acc[tc.index]) {
      acc[tc.index] = { id: "", type: "function", function: { name: "", arguments: "" } };
    }
    if (tc.id) acc[tc.index].id = tc.id;
    if (tc.function?.name) acc[tc.index].function.name += tc.function.name;
    if (tc.function?.arguments) acc[tc.index].function.arguments += tc.function.arguments;
  }

  return Object.values(acc).filter((tc) => tc.id && tc.function.name);
}

export interface StreamResult {
  fullContent: string;
  toolCalls: ToolCallResult[];
}

export async function streamResponse(
  client: any,
  model: string,
  messages: any[],
): Promise<StreamResult> {
  const stream = await client.chat.completions.create({
    model,
    messages,
    tools: registry.describe(),
    tool_choice: "auto",
    stream: true,
  });

  let fullContent = "";
  const rawDeltaToolCalls: ToolCallDelta[] = [];

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;

    if (delta?.content) {
      fullContent += delta.content;
    }

    if (delta?.tool_calls) {
      for (const tc of delta.tool_calls) {
        rawDeltaToolCalls.push(tc);
      }
    }
  }

  const toolCalls = buildToolCallsFromDelta(rawDeltaToolCalls);

  return { fullContent, toolCalls };
}
