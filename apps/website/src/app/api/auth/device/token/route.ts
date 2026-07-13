import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";
import crypto from "crypto";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { device_code } = body as { device_code?: string };

    if (!device_code) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "device_code is required" },
        { status: 400 },
      );
    }

    const deviceCode = await prisma.deviceCode.findUnique({
      where: { deviceCode: device_code },
    });

    if (!deviceCode) {
      return NextResponse.json(
        { error: "invalid_grant", error_description: "Invalid device code" },
        { status: 400 },
      );
    }

    if (deviceCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "expired_token", error_description: "Device code has expired" },
        { status: 400 },
      );
    }

    if (deviceCode.status === "pending") {
      return NextResponse.json(
        { error: "authorization_pending", error_description: "Authorization pending" },
        { status: 400 },
      );
    }

    if (deviceCode.status === "authorized" && deviceCode.userId) {
      // Verify the user still exists before issuing a token
      const user = await prisma.user.findUnique({
        where: { id: deviceCode.userId },
        select: { id: true, name: true, email: true, image: true },
      });

      if (!user) {
        return NextResponse.json(
          {
            error: "user_not_found",
            error_description: "The user account associated with this device code no longer exists.",
          },
          { status: 401 },
        );
      }

      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
      const jwtToken = await encode({
        token: {
          sub: deviceCode.userId,
          type: "cli" as const,
          jti: crypto.randomUUID(),
          exp,
        },
        secret: NEXTAUTH_SECRET,
        salt: "kairo-cli-token",
      });

      return NextResponse.json({
        access_token: jwtToken,
        jwt_token: jwtToken,
        user_profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.image,
        },
      });
    }

    return NextResponse.json(
      { error: "invalid_grant", error_description: "Device code is not valid" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Device token polling error:", error);
    return NextResponse.json(
      { error: "server_error", error_description: "Internal server error" },
      { status: 500 },
    );
  }
}
