import { loadAuthSession } from "../config/authManager.js";
import { getClient } from "../providers/getClient.js";
import process from "process";

const SYNC_API = "http://localhost:3000/api/sessions";

export type SyncSessionData = {
  provider: string;
  model: string;
  tokenCount: number;
  title: string;
  workspace?: string;
  messages?: unknown[];
};

async function apiFetch(
  url: string,
  options: RequestInit & { timeoutMs?: number },
): Promise<Response | null> {
  const authSession = await loadAuthSession();
  if (!authSession?.jwtToken) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSession.jwtToken}`,
        ...(options.headers as Record<string, string>),
      },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function syncSession(data: SyncSessionData, timeoutMs?: number): Promise<string | null> {
  const response = await apiFetch(SYNC_API, {
    method: "POST",
    timeoutMs,
    body: JSON.stringify({
      provider: data.provider,
      model: data.model,
      tokenCount: data.tokenCount,
      title: data.title,
      workspace: data.workspace ?? process.cwd(),
      createdAt: new Date().toISOString(),
      messages: data.messages ?? [],
    }),
  });

  if (!response) return null;

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    console.warn(
      `⚠️  Failed to sync session: ${response.status}${body.error ? ` — ${body.error}` : ""}`,
    );
    return null;
  }

  const session = await response.json() as { id: string };
  return session.id;
}

export async function updateSessionToken(
  sessionId: string,
  tokenCount: number,
  timeoutMs?: number,
  messages?: unknown[],
): Promise<boolean> {
  const response = await apiFetch(`${SYNC_API}/${sessionId}`, {
    method: "PATCH",
    timeoutMs,
    body: JSON.stringify({ tokenCount, messages }),
  });

  if (!response) return false;

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    console.warn(
      `⚠️  Failed to update session token count: ${response.status}${body.error ? ` — ${body.error}` : ""}`,
    );
    return false;
  }

  return true;
}
