import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CliAuthClient } from "./client";

export default async function CliAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const session = await auth();
  const { state } = await searchParams;

  // Not authenticated — delegate OAuth redirect to a client component
  if (!session?.user?.id) {
    const callbackUrl = `/auth/cli${state ? `?state=${encodeURIComponent(state)}` : ""}`;
    return <CliAuthClient callbackUrl={callbackUrl} />;
  }

  // Authenticated — generate a short-lived token for the CLI
  const { encode } = await import("next-auth/jwt");
  // eslint-disable-next-line react-hooks/purity
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const token = await encode({
    token: {
      sub: session.user.id,
      type: "cli" as const,
      jti: crypto.randomUUID(),
      exp,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    salt: "kairo-cli-token",
  });

  const redirectUrl = new URL("http://localhost:4242/callback");
  redirectUrl.searchParams.set("token", token);
  if (state) {
    redirectUrl.searchParams.set("state", state);
  }

  redirect(redirectUrl.toString());
}
