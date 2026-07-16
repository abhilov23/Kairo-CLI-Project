import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    messages?: { role: string; content: string }[];
    mode?: "free" | "own";
    apiKey?: string;
    baseURL?: string;
    model?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages is required and must be a non-empty array" }, { status: 400 });
  }

  let openai: OpenAI;
  let model: string;
  let provider: string;

  if (body.mode === "own") {
    if (!body.apiKey) {
      return NextResponse.json({ error: "API key is required in 'own' mode" }, { status: 400 });
    }
    openai = new OpenAI({
      apiKey: body.apiKey,
      baseURL: body.baseURL || "https://api.openai.com/v1",
    });
    model = body.model || "gpt-4o-mini";
    provider = "custom";
  } else {
    const apiKey = process.env.GATEWAY_API_KEY;
    const baseURL = process.env.GATEWAY_BASE_URL || "https://api.openai.com/v1";
    if (!apiKey) {
      return NextResponse.json({ error: "Gateway not configured (GATEWAY_API_KEY missing)" }, { status: 503 });
    }
    openai = new OpenAI({ apiKey, baseURL });
    model = process.env.GATEWAY_MODEL || "gpt-4o-mini";
    provider = "free-chat";
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = "";
      let promptTokens = 0;
      let completionTokens = 0;

      try {
        const completion = await openai.chat.completions.create({
          model,
          messages: body.messages as any,
          stream: true,
          stream_options: { include_usage: true },
        });

        for await (const chunk of completion) {
          if (chunk.usage) {
            promptTokens = chunk.usage.prompt_tokens || 0;
            completionTokens = chunk.usage.completion_tokens || 0;
          }

          const delta = chunk.choices?.[0]?.delta?.content || "";
          if (delta) {
            fullContent += delta;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`),
            );
          }
        }

        const total = promptTokens + completionTokens;
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              usage: { prompt_tokens: promptTokens, completion_tokens: completionTokens, total_tokens: total },
            })}\n\n`,
          ),
        );

        if (total > 0) {
          await prisma.usageLog.create({
            data: {
              userId,
              tokens: total,
              provider,
              model,
            },
          }).catch(() => {});
        }
      } catch (err: any) {
        const message = err?.message || "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
