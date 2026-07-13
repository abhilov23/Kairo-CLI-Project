import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the user actually exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!existingUser) {
    return NextResponse.json(
      {
        error: "user_not_found",
        error_description: "Your account no longer exists. Please sign out and sign in again.",
      },
      { status: 401 },
    );
  }

  let body: { name?: string; bio?: string; image?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, bio, image } = body;

  // Validate
  const updates: Record<string, string | null> = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.length > 80) {
      return NextResponse.json(
        { error: "Name must be 80 characters or fewer" },
        { status: 400 },
      );
    }
    updates.name = name.trim() || null;
  }

  if (bio !== undefined) {
    if (typeof bio !== "string" || bio.length > 500) {
      return NextResponse.json(
        { error: "Bio must be 500 characters or fewer" },
        { status: 400 },
      );
    }
    updates.bio = bio.trim() || null;
  }

  if (image !== undefined) {
    if (typeof image !== "string") {
      return NextResponse.json(
        { error: "Invalid image value" },
        { status: 400 },
      );
    }
    updates.image = image || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: updates,
    select: { id: true, name: true, email: true, image: true, bio: true },
  });

  return NextResponse.json({ user });
}
