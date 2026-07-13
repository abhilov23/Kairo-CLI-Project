import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
  deviceCode: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

const mockEncode = vi.fn();
vi.mock("next-auth/jwt", () => ({
  encode: mockEncode,
}));

const mockRandomUUID = vi.fn();
vi.mock("crypto", () => ({
  default: { randomUUID: mockRandomUUID },
  randomUUID: mockRandomUUID,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/auth/device/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function parseResponse(res: Response) {
  return {
    status: res.status,
    body: await res.json(),
  };
}

// ─── Confirm Route Tests ─────────────────────────────────────────────────────

describe("POST /api/auth/device/confirm", () => {
  let POST: typeof import("./confirm/route").POST;

  beforeEach(async () => {
    vi.clearAllMocks();
    POST = (await import("./confirm/route")).POST;
  });

  describe("user-not-found scenario", () => {
    it("should return 401 when the user ID exists in session but not in the database", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "deleted-user-id" } });
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await POST(createRequest({ user_code: "ABC123" }));
      const parsed = await parseResponse(res);

      expect(res.status).toBe(401);
      expect(parsed.body).toMatchObject({
        error: "user_not_found",
        error_description: expect.stringContaining("no longer exists"),
      });
      expect(mockPrisma.deviceCode.update).not.toHaveBeenCalled();
    });

    it("should check user existence before any device code logic", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "ghost-user" } });
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await POST(createRequest({ user_code: "ANY" }));

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "ghost-user" },
        select: { id: true },
      });
      expect(mockPrisma.deviceCode.findFirst).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });
  });

  describe("happy path (user exists)", () => {
    it("should authorize the device code when user exists", async () => {
      const userId = "valid-user-id";
      mockAuth.mockResolvedValueOnce({ user: { id: userId } });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: userId });
      mockPrisma.deviceCode.findFirst.mockResolvedValueOnce({
        id: "dc-id",
        userCode: "ABC123",
        status: "pending",
        expiresAt: new Date(Date.now() + 60_000),
      });
      mockPrisma.deviceCode.update.mockResolvedValueOnce({});

      const res = await POST(createRequest({ user_code: "ABC123" }));
      const parsed = await parseResponse(res);

      expect(res.status).toBe(200);
      expect(parsed.body).toEqual({ success: true });
      expect(mockPrisma.deviceCode.update).toHaveBeenCalledWith({
        where: { id: "dc-id" },
        data: {
          status: "authorized",
          userId,
          authorizedAt: expect.any(Date),
        },
      });
    });
  });
});

// ─── Token Route Tests ───────────────────────────────────────────────────────

describe("POST /api/auth/device/token", () => {
  let POST: typeof import("./token/route").POST;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockRandomUUID.mockReturnValue("mock-jti");
    mockEncode.mockResolvedValue("mock-jwt-token");
    POST = (await import("./token/route")).POST;
  });

  describe("user-not-found scenario", () => {
    it("should return 401 when the device code is authorized but the user was deleted", async () => {
      mockPrisma.deviceCode.findUnique.mockResolvedValueOnce({
        id: "dc-id",
        deviceCode: "dev-123",
        status: "authorized",
        userId: "deleted-user-id",
        expiresAt: new Date(Date.now() + 60_000),
      });
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await POST(
        new Request("http://localhost:3000/api/auth/device/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_code: "dev-123" }),
        }),
      );
      const parsed = await parseResponse(res);

      expect(res.status).toBe(401);
      expect(parsed.body).toMatchObject({
        error: "user_not_found",
        error_description: expect.stringContaining("no longer exists"),
      });
      expect(mockEncode).not.toHaveBeenCalled();
    });

    it("should check user existence before encoding a JWT", async () => {
      mockPrisma.deviceCode.findUnique.mockResolvedValueOnce({
        id: "dc-id",
        deviceCode: "dev-456",
        status: "authorized",
        userId: "ghost-user",
        expiresAt: new Date(Date.now() + 60_000),
      });
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await POST(
        new Request("http://localhost:3000/api/auth/device/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_code: "dev-456" }),
        }),
      );

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "ghost-user" },
        select: { id: true, name: true, email: true, image: true },
      });
      expect(mockEncode).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });
  });

  describe("happy path (user exists)", () => {
    it("should return a JWT token when device code is authorized and user exists", async () => {
      const userId = "valid-user-id";
      mockPrisma.deviceCode.findUnique.mockResolvedValueOnce({
        id: "dc-id",
        deviceCode: "dev-789",
        status: "authorized",
        userId,
        expiresAt: new Date(Date.now() + 60_000),
      });
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: userId,
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      });

      const res = await POST(
        new Request("http://localhost:3000/api/auth/device/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_code: "dev-789" }),
        }),
      );
      const parsed = await parseResponse(res);

      expect(res.status).toBe(200);
      expect(parsed.body).toMatchObject({
        access_token: "mock-jwt-token",
        jwt_token: "mock-jwt-token",
        user_profile: {
          id: userId,
          name: "Test User",
          email: "test@example.com",
          picture: "https://example.com/avatar.png",
        },
      });
      expect(mockEncode).toHaveBeenCalledOnce();
    });
  });
});
