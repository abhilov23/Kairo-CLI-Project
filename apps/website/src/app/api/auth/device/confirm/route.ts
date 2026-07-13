import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", error_description: "You must be logged in to authorize a device" },
        { status: 401 },
      );
    }

    // Verify the user actually exists in the database (valid session with deleted user)
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

    const body = await request.json().catch(() => ({}));
    const { user_code } = body as { user_code?: string };

    if (!user_code) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "user_code is required" },
        { status: 400 },
      );
    }

    const deviceCode = await prisma.deviceCode.findFirst({ orderBy: { createdAt: "desc" },
      where: { userCode: user_code },
    });

    if (!deviceCode) {
      return NextResponse.json(
        { error: "invalid_grant", error_description: "Invalid user code" },
        { status: 400 },
      );
    }

    if (deviceCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "expired_token", error_description: "This code has expired" },
        { status: 400 },
      );
    }

    if (deviceCode.status !== "pending") {
      return NextResponse.json(
        { error: "already_used", error_description: "This code has already been used" },
        { status: 400 },
      );
    }

    await prisma.deviceCode.update({
      where: { id: deviceCode.id },
      data: {
        status: "authorized",
        userId: session.user.id,
        authorizedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Device confirm error:", error);
    return NextResponse.json(
      { error: "server_error", error_description: "Internal server error" },
      { status: 500 },
    );
  }
}
