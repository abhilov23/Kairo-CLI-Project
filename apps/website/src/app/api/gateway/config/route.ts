import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";

export async function GET(request: Request) {
  const userId = await getUserIdFromRequest(request as any);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GATEWAY_API_KEY;
  const baseURL = process.env.GATEWAY_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.GATEWAY_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ error: "Gateway not configured" }, { status: 503 });
  }

  return NextResponse.json({ apiKey, baseURL, model });
}
