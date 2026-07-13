import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/api-auth";

// ── POST /api/sessions ─────────────────────────────────────
// CLI pushes a session after it ends
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    provider?: string;
    model?: string;
    tokenCount?: number;
    title?: string;
    workspace?: string;
    createdAt?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Validate required fields
  const errors: string[] = [];
  if (!body.provider || typeof body.provider !== "string") {
    errors.push("provider is required and must be a string");
  }
  if (!body.model || typeof body.model !== "string") {
    errors.push("model is required and must be a string");
  }
  if (
    body.tokenCount === undefined ||
    typeof body.tokenCount !== "number" ||
    body.tokenCount < 0
  ) {
    errors.push("tokenCount is required and must be a non-negative number");
  }
  if (!body.title || typeof body.title !== "string") {
    errors.push("title is required and must be a string");
  }
  if (body.title && body.title.length > 80) {
    errors.push("title must be 80 characters or fewer");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 },
    );
  }

  // Parse optional createdAt timestamp
  let parsedCreatedAt: Date | undefined;
  if (body.createdAt) {
    parsedCreatedAt = new Date(body.createdAt);
    if (isNaN(parsedCreatedAt.getTime())) {
      return NextResponse.json(
        { error: "createdAt is not a valid ISO 8601 timestamp" },
        { status: 400 },
      );
    }
  }

  const session = await prisma.kairoSession.create({
    data: {
      userId,
      title: body.title!,
      provider: body.provider!,
      model: body.model!,
      tokenCount: body.tokenCount!,
      workspace: body.workspace ?? null,
      createdAt: parsedCreatedAt ?? new Date(),
    },
  });

  return NextResponse.json(session, { status: 201 });
}

// ── GET /api/sessions ──────────────────────────────────────
// Dashboard fetches session history (also used by CLI `kairo sync`)
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse pagination params
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "50", 10), 1),
    100,
  );
  const cursor = searchParams.get("cursor");

  const sessions = await prisma.kairoSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  const hasMore = sessions.length > limit;
  const data = hasMore ? sessions.slice(0, limit) : sessions;
  const nextCursor = hasMore ? data[data.length - 1]?.id : null;

  return NextResponse.json({
    sessions: data,
    nextCursor,
  });
}

// ── DELETE /api/sessions ────────────────────────────────────
// CLI calls this on /logout to remove the login session from the DB
export async function DELETE(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    await prisma.kairoSession.deleteMany({
      where: { id, userId },
    });
  } else {
    // Fallback: delete all cli-login sessions for this user
    await prisma.kairoSession.deleteMany({
      where: { userId, provider: "cli-login" },
    });
  }

  return NextResponse.json({ message: "Session cleared" });
}
