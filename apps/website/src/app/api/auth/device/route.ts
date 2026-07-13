import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateUserCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[crypto.randomInt(chars.length)];
    if (i === 3) code += "-";
  }
  return code;
}

function generateDeviceCode(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST() {
  try {
    const deviceCode = generateDeviceCode();
    const userCode = generateUserCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.deviceCode.create({
      data: {
        deviceCode,
        userCode,
        status: "pending",
        expiresAt,
      },
    });

    return NextResponse.json({
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: `http://localhost:3000/cli/verify`,
      interval: 5,
    });
  } catch (error) {
    console.error("Device auth init error:", error);
    return NextResponse.json(
      { error: "internal_error", error_description: "Failed to initiate device authentication" },
      { status: 500 },
    );
  }
}
