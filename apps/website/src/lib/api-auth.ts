import { NextRequest } from "next/server";
import { auth } from "./auth";
import { decode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma"


/**
 * Extract the authenticated user ID from either:
 * 1. A Bearer JWT token (CLI users — checked first for speed)
 * 2. A browser session cookie (dashboard users)
 *
 * Also verifies the user still exists in the database.
 * Returns `null` if the request is not authenticated or the user was deleted.
 */
export async function getUserIdFromRequest(
  req: NextRequest,
): Promise<string | null> {
  // Try Bearer token first (CLI using JWT from kairo login)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const rawToken = authHeader.slice(7); // Remove "Bearer "
      const decoded = await decode({
        token: rawToken,
        secret: process.env.NEXTAUTH_SECRET!,
        salt: "kairo-cli-token",
      });
      if (decoded?.sub) {
        if (decoded.jti) {
          const blocked = await prisma.cliTokenBlocklist.findUnique({
            where: { jti: decoded.jti as string },
          })
          if (blocked) return null
        }

        // Verify the user still exists
        const user = await prisma.user.findUnique({
          where: { id: decoded.sub },
          select: { id: true },
        });
        if (!user) return null;

        return decoded.sub
      }
    } catch {
      return null;
    }
  }

  // Fall back to session cookie (dashboard users via browser)
  // NextAuth already validates the JWT — no extra DB check needed
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }

  return null;
}
