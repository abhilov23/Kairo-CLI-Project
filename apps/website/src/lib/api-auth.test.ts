import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
  cliTokenBlocklist: {
    findUnique: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

const mockDecode = vi.fn();
vi.mock("next-auth/jwt", () => ({
  decode: mockDecode,
}));

// Process.env helper
const ORIGINAL_SECRET = process.env.NEXTAUTH_SECRET;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createBearerRequest(token: string): Request {
  return new Request("http://localhost:3000/api/sessions", {
    headers: { authorization: `Bearer ${token}` },
  });
}

function createSessionRequest(): Request {
  return new Request("http://localhost:3000/api/sessions");
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getUserIdFromRequest", () => {
  let getUserIdFromRequest: typeof import("./api-auth").getUserIdFromRequest;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.NEXTAUTH_SECRET = "test-secret";
    getUserIdFromRequest = (await import("./api-auth")).getUserIdFromRequest;
  });

  afterAll(() => {
    process.env.NEXTAUTH_SECRET = ORIGINAL_SECRET;
  });

  // ── Bearer token path ─────────────────────────────────────────────────────

  describe("Bearer token authentication", () => {
    it("should return userId when token is valid and user exists", async () => {
      mockDecode.mockResolvedValueOnce({ sub: "valid-user-id", jti: "some-jti" });
      mockPrisma.cliTokenBlocklist.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: "valid-user-id" });

      const result = await getUserIdFromRequest(
        createBearerRequest("valid-token") as any,
      );

      expect(result).toBe("valid-user-id");
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "valid-user-id" },
        select: { id: true },
      });
    });

    it("should return null when token is valid but user was deleted", async () => {
      mockDecode.mockResolvedValueOnce({ sub: "deleted-user-id", jti: "some-jti" });
      mockPrisma.cliTokenBlocklist.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const result = await getUserIdFromRequest(
        createBearerRequest("deleted-user-token") as any,
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "deleted-user-id" },
        select: { id: true },
      });
    });

    it("should return null when token is blocked", async () => {
      mockDecode.mockResolvedValueOnce({ sub: "blocked-user-id", jti: "blocked-jti" });
      mockPrisma.cliTokenBlocklist.findUnique.mockResolvedValueOnce({
        jti: "blocked-jti",
      });

      const result = await getUserIdFromRequest(
        createBearerRequest("blocked-token") as any,
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return null when token decode fails", async () => {
      mockDecode.mockRejectedValueOnce(new Error("bad token"));

      const result = await getUserIdFromRequest(
        createBearerRequest("invalid-token") as any,
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return null when decoded token has no sub", async () => {
      mockDecode.mockResolvedValueOnce({});

      const result = await getUserIdFromRequest(
        createBearerRequest("no-sub-token") as any,
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
  });

  // ── Session cookie path (fallback) ─────────────────────────────────────────

  describe("session cookie authentication", () => {
    it("should return userId when session is valid", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "session-user-id" } });

      const result = await getUserIdFromRequest(
        createSessionRequest() as any,
      );

      expect(result).toBe("session-user-id");
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return null when there is no session", async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await getUserIdFromRequest(
        createSessionRequest() as any,
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return null when session has no user id", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      const result = await getUserIdFromRequest(
        createSessionRequest() as any,
      );

      expect(result).toBeNull();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
  });
});
