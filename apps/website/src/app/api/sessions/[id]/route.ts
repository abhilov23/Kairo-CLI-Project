import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserIdFromRequest(_request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const session = await prisma.kairoSession.findUnique({
    where: { id },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(session);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { tokenCount?: number; messages?: unknown[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (
    body.tokenCount === undefined ||
    typeof body.tokenCount !== "number" ||
    body.tokenCount < 0
  ) {
    return NextResponse.json(
      { error: "tokenCount is required and must be a non-negative number" },
      { status: 400 },
    );
  }

  const existing = await prisma.kairoSession.findUnique({
    where: { id },
    select: { userId: true, tokenCount: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (existing.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await prisma.kairoSession.update({
    where: { id },
    data: {
      tokenCount: body.tokenCount,
      messages: (body.messages as any) ?? undefined,
    },
  });

  // Update the corresponding UsageLog entry if it exists
  if (body.tokenCount > 0) {
    const lastUsage = await prisma.usageLog.findFirst({
      where: { kairoSessionId: id },
      orderBy: { createdAt: "desc" },
    });

    if (lastUsage) {
      await prisma.usageLog.update({
        where: { id: lastUsage.id },
        data: { tokens: body.tokenCount },
      });
    }
  }

  return NextResponse.json(session);
}
