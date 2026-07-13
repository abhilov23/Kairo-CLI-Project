import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/api-auth";

// ── GET /api/config/sync ───────────────────────────────────
// CLI pulls stored API keys on login so the user doesn't have
// to re-enter them after each `kairo login`
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      provider: true,
      label: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    apiKeys,
    // Return the providers the user has configured keys for
    // so the CLI can pre-select them
    configuredProviders: [...new Set(apiKeys.map((k) => k.provider))],
  });
}
