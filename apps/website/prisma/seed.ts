import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const TEST_USER_ID = "clx-test-user-001";
const TEST_USER_2_ID = "clx-test-user-002";

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ──────────────────────────────
  await prisma.usageLog.deleteMany();
  await prisma.kairoSession.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleaned existing data");

  // ── Create test users ────────────────────────────────
  const testPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      id: TEST_USER_ID,
      name: "Alex Developer",
      email: "alex@example.com",
      emailVerified: new Date("2026-01-15"),
      image: "https://avatars.githubusercontent.com/u/12345678?v=4",
      hashedPassword: testPassword,
    },
  });

  await prisma.user.create({
    data: {
      id: TEST_USER_2_ID,
      name: "Sam Engineer",
      email: "sam@example.com",
      emailVerified: new Date("2026-03-01"),
      image: "https://avatars.githubusercontent.com/u/87654321?v=4",
      hashedPassword: testPassword,
    },
  });
  console.log("  ✓ Created test users");

  // ── Create OAuth accounts (for NextAuth adapter) ────
  await prisma.account.create({
    data: {
      userId: TEST_USER_ID,
      type: "oauth",
      provider: "github",
      providerAccountId: "12345678",
      access_token: "gho_test_access_token",
      token_type: "bearer",
      scope: "read:user,user:email",
    },
  });

  await prisma.account.create({
    data: {
      userId: TEST_USER_2_ID,
      type: "oauth",
      provider: "github",
      providerAccountId: "87654321",
      access_token: "gho_test_access_token_2",
      token_type: "bearer",
      scope: "read:user,user:email",
    },
  });
  console.log("  ✓ Created OAuth accounts");

  // ── Create API keys ─────────────────────────────────
  await prisma.apiKey.createMany({
    data: [
      {
        userId: TEST_USER_ID,
        provider: "openai",
        keyHash: "$2b$10$test_hash_openai_abcdef123456",
        label: "OpenAI Pro",
      },
      {
        userId: TEST_USER_ID,
        provider: "anthropic",
        keyHash: "$2b$10$test_hash_anthropic_abcdef123456",
        label: "Anthropic Work",
      },
      {
        userId: TEST_USER_ID,
        provider: "groq",
        keyHash: "$2b$10$test_hash_groq_abcdef123456",
        label: "Groq Dev",
      },
      {
        userId: TEST_USER_ID,
        provider: "nvidia",
        keyHash: "$2b$10$test_hash_nvidia_abcdef123456",
        label: null,
      },
      {
        userId: TEST_USER_2_ID,
        provider: "openai",
        keyHash: "$2b$10$test_hash_openai_user2_abcdef",
        label: null,
      },
      {
        userId: TEST_USER_2_ID,
        provider: "anthropic",
        keyHash: "$2b$10$test_hash_anthropic_user2_abcdef",
        label: "Claude Key",
      },
    ],
  });
  console.log("  ✓ Created API keys");

  // ── Create Kairo sessions ───────────────────────────
  const now = new Date();

  const sessions = [
    // User 1 sessions
    {
      userId: TEST_USER_ID,
      title: "Refactor authentication middleware",
      provider: "openai",
      model: "gpt-4o",
      tokenCount: 2847,
      workspace: "/Users/alex/projects/kairocli",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      userId: TEST_USER_ID,
      title: "Debug database connection pool issue",
      provider: "anthropic",
      model: "claude-sonnet-4",
      tokenCount: 4531,
      workspace: "/Users/alex/projects/kairocli",
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      userId: TEST_USER_ID,
      title: "Design API rate limiting strategy",
      provider: "openai",
      model: "gpt-4o",
      tokenCount: 1892,
      workspace: "/Users/alex/projects/api-gateway",
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      userId: TEST_USER_ID,
      title: "Optimize React rendering performance",
      provider: "anthropic",
      model: "claude-sonnet-4",
      tokenCount: 3210,
      workspace: "/Users/alex/projects/dashboard",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      userId: TEST_USER_ID,
      title: "Write integration tests for CLI login flow",
      provider: "groq",
      model: "mixtral-8x7b-32768",
      tokenCount: 1567,
      workspace: "/Users/alex/projects/kairocli",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      userId: TEST_USER_ID,
      title: "Review pull request #142 — Session management",
      provider: "nvidia",
      model: "llama-3.1-nemotron-70b-instruct",
      tokenCount: 2103,
      workspace: "/Users/alex/projects/kairocli",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      userId: TEST_USER_ID,
      title: "Set up CI/CD pipeline with GitHub Actions",
      provider: "openai",
      model: "gpt-4o-mini",
      tokenCount: 987,
      workspace: "/Users/alex/projects/infra",
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
      userId: TEST_USER_ID,
      title: "Migrate database schema to support multi-tenant",
      provider: "anthropic",
      model: "claude-sonnet-4",
      tokenCount: 5678,
      workspace: "/Users/alex/projects/saas-backend",
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    // User 2 sessions
    {
      userId: TEST_USER_2_ID,
      title: "Implement websocket reconnection logic",
      provider: "openai",
      model: "gpt-4o",
      tokenCount: 1934,
      workspace: "/Users/sam/projects/realtime-app",
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      userId: TEST_USER_2_ID,
      title: "Code review — File upload service",
      provider: "anthropic",
      model: "claude-sonnet-4",
      tokenCount: 3456,
      workspace: "/Users/sam/projects/storage-service",
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      userId: TEST_USER_2_ID,
      title: "Debug memory leak in event processing",
      provider: "groq",
      model: "mixtral-8x7b-32768",
      tokenCount: 2109,
      workspace: "/Users/sam/projects/event-processor",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  for (const session of sessions) {
    await prisma.kairoSession.create({ data: session });
  }
  console.log(`  ✓ Created ${sessions.length} Kairo sessions`);

  // ── Get created session IDs for usage logs ──────────
  const user1Sessions = await prisma.kairoSession.findMany({
    where: { userId: TEST_USER_ID },
    orderBy: { createdAt: "asc" },
  });
  const user2Sessions = await prisma.kairoSession.findMany({
    where: { userId: TEST_USER_2_ID },
    orderBy: { createdAt: "asc" },
  });

  // ── Create usage logs ──────────────────────────────
  const usageLogs = [
    // User 1 usage
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[0]?.id,
      tokens: user1Sessions[0]?.tokenCount ?? 0,
      provider: user1Sessions[0]?.provider ?? "openai",
      model: user1Sessions[0]?.model ?? "gpt-4o",
      createdAt: user1Sessions[0]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[1]?.id,
      tokens: user1Sessions[1]?.tokenCount ?? 0,
      provider: user1Sessions[1]?.provider ?? "anthropic",
      model: user1Sessions[1]?.model ?? "claude-sonnet-4",
      createdAt: user1Sessions[1]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[2]?.id,
      tokens: user1Sessions[2]?.tokenCount ?? 0,
      provider: user1Sessions[2]?.provider ?? "openai",
      model: user1Sessions[2]?.model ?? "gpt-4o",
      createdAt: user1Sessions[2]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[3]?.id,
      tokens: user1Sessions[3]?.tokenCount ?? 0,
      provider: user1Sessions[3]?.provider ?? "anthropic",
      model: user1Sessions[3]?.model ?? "claude-sonnet-4",
      createdAt: user1Sessions[3]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[4]?.id,
      tokens: user1Sessions[4]?.tokenCount ?? 0,
      provider: user1Sessions[4]?.provider ?? "groq",
      model: user1Sessions[4]?.model ?? "mixtral-8x7b-32768",
      createdAt: user1Sessions[4]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[5]?.id,
      tokens: user1Sessions[5]?.tokenCount ?? 0,
      provider: user1Sessions[5]?.provider ?? "nvidia",
      model: user1Sessions[5]?.model ?? "llama-3.1-nemotron-70b-instruct",
      createdAt: user1Sessions[5]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[6]?.id,
      tokens: user1Sessions[6]?.tokenCount ?? 0,
      provider: user1Sessions[6]?.provider ?? "openai",
      model: user1Sessions[6]?.model ?? "gpt-4o-mini",
      createdAt: user1Sessions[6]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_ID,
      kairoSessionId: user1Sessions[7]?.id,
      tokens: user1Sessions[7]?.tokenCount ?? 0,
      provider: user1Sessions[7]?.provider ?? "anthropic",
      model: user1Sessions[7]?.model ?? "claude-sonnet-4",
      createdAt: user1Sessions[7]?.createdAt ?? new Date(),
    },
    // User 2 usage
    {
      userId: TEST_USER_2_ID,
      kairoSessionId: user2Sessions[0]?.id,
      tokens: user2Sessions[0]?.tokenCount ?? 0,
      provider: user2Sessions[0]?.provider ?? "openai",
      model: user2Sessions[0]?.model ?? "gpt-4o",
      createdAt: user2Sessions[0]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_2_ID,
      kairoSessionId: user2Sessions[1]?.id,
      tokens: user2Sessions[1]?.tokenCount ?? 0,
      provider: user2Sessions[1]?.provider ?? "anthropic",
      model: user2Sessions[1]?.model ?? "claude-sonnet-4",
      createdAt: user2Sessions[1]?.createdAt ?? new Date(),
    },
    {
      userId: TEST_USER_2_ID,
      kairoSessionId: user2Sessions[2]?.id,
      tokens: user2Sessions[2]?.tokenCount ?? 0,
      provider: user2Sessions[2]?.provider ?? "groq",
      model: user2Sessions[2]?.model ?? "mixtral-8x7b-32768",
      createdAt: user2Sessions[2]?.createdAt ?? new Date(),
    },
  ];

  for (const log of usageLogs) {
    await prisma.usageLog.create({ data: log });
  }
  console.log(`  ✓ Created ${usageLogs.length} usage logs`);

  console.log("");
  console.log("✅ Seed complete!");
  console.log(`   Users:       2`);
  console.log(`   API keys:    6`);
  console.log(`   Sessions:    ${sessions.length}`);
  console.log(`   Usage logs:  ${usageLogs.length}`);
  console.log("");
  console.log("   Test user 1 — Alex Developer (alex@example.com)");
  console.log("   Test user 2 — Sam Engineer   (sam@example.com)");
  console.log("");
  console.log("   Sessions span: openai, anthropic, groq, nvidia providers");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
