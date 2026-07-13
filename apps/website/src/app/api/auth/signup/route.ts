import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; name?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { email, password, name } = body;

  // Validate
  const errors: string[] = [];
  if (!email || typeof email !== "string" || !email.includes("@")) {
    errors.push("A valid email address is required");
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (password && password.length > 128) {
    errors.push("Password must be 128 characters or fewer");
  }
  if (name && (typeof name !== "string" || name.length > 80)) {
    errors.push("Name must be 80 characters or fewer");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 },
    );
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: email!.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password!, 10);

  const user = await prisma.user.create({
    data: {
      email: email!.toLowerCase(),
      name: name ?? email!.split("@")[0],
      hashedPassword,
    },
  });

  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    { status: 201 },
  );
}
