import { NextRequest, NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const rawToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null

  if (!rawToken) {
    return NextResponse.json({ message: "Logged out" }, { status: 200 })
  }

  try {
    const decoded = await decode({
      token: rawToken,
      secret: process.env.NEXTAUTH_SECRET!,
      salt: "kairo-cli-token",
    })

    if (decoded?.jti && decoded?.sub) {
      await prisma.cliTokenBlocklist.upsert({
        where: { jti: decoded.jti as string },
        update: {},
        create: {
          jti: decoded.jti as string,
          userId: decoded.sub,
          expiresAt: new Date((decoded.exp as number) * 1000),
        },
      })
    }
  } catch {
    // Invalid token — still return 200, logout is idempotent
  }

  return NextResponse.json({ message: "Logged out" }, { status: 200 })
}