# CLAUDE.md — KairoCLI Website

## Project Overview
KairoCLI marketing website + product backend.
Terminal-native AI coding assistant.
Design bar: Linear.app, Vercel, Stripe, Arc.

## Current Priority (build in this order)
1. Database schema (Neon + Prisma)
2. Auth (NextAuth v5 — GitHub OAuth primary)
3. Three core API routes
4. CLI `kairo login` command + token flow
5. Session sync (CLI → backend → dashboard)
6. Dashboard pages
7. MCP integration (Phase 2, not now)

---

## Stack

### Website + API
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Aceternity UI (ui.aceternity.com)
- shadcn/ui
- next-themes
- NextAuth v5 (auth)

### Database
- PostgreSQL via Neon (free tier)
- Prisma ORM

### CLI (KairoCLI package)
- Node.js + TypeScript
- LangChain
- `@modelcontextprotocol/sdk` (Phase 2)

### Deploy
- Vercel (website + API routes)
- Neon (Postgres)

## Commands
```bash
pnpm dev        # development
pnpm build      # production build
pnpm lint       # lint
```

---

## Database Schema (Prisma)

Full schema at `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ── NextAuth required models ──────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      AuthSession[]
  apiKeys       ApiKey[]
  kairoSessions KairoSession[]
  usageLogs     UsageLog[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model AuthSession {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

// ── KairoCLI custom models ────────────────────────────────

model KairoSession {
  id         String     @id @default(cuid())
  userId     String
  user       User       @relation(fields: [userId], references: [id])
  title      String     // first user message, max 80 chars
  provider   String     // openai / anthropic / groq / nvidia / ollama
  model      String
  tokenCount Int        @default(0)
  workspace  String?    // process.cwd() from CLI
  createdAt  DateTime   @default(now())
  usageLogs  UsageLog[]
}

model ApiKey {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  provider  String   // openai / anthropic / groq / nvidia / ollama
  keyHash   String   // bcrypt hash — never store plaintext
  label     String?  // optional user label
  createdAt DateTime @default(now())
}

model UsageLog {
  id             String       @id @default(cuid())
  userId         String
  kairoSessionId String
  user           User         @relation(fields: [userId], references: [id])
  kairoSession   KairoSession @relation(fields: [kairoSessionId], references: [id])
  tokens         Int
  provider       String
  model          String
  createdAt      DateTime     @default(now())
}
```

---

## API Routes (build only these first)

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/[...nextauth]` | ALL | — | NextAuth handler |
| `/api/sessions` | POST | Bearer JWT | CLI pushes session after it ends |
| `/api/sessions` | GET | Bearer JWT | Dashboard fetches session history |
| `/api/config/sync` | GET | Bearer JWT | CLI pulls stored API keys on login |

### POST /api/sessions — payload
```ts
{
  provider: string       // "openai" | "anthropic" | "groq" | "nvidia" | "ollama"
  model: string          // e.g. "gpt-4o"
  tokenCount: number
  title: string          // first user message, max 80 chars
  workspace?: string     // process.cwd() from CLI
  createdAt: string      // ISO 8601 timestamp
}
```

### Auth on API routes
```ts
// Verify JWT from CLI Bearer token
const token = req.headers.get("authorization")?.replace("Bearer ", "")
const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
```

---

## NextAuth Setup

### Install
```bash
pnpm add next-auth@beta @auth/prisma-adapter
```

### lib/auth.ts
```ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
```

### lib/prisma.ts
```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### app/api/auth/[...nextauth]/route.ts
```ts
import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
```

---

## CLI Auth Flow (`kairo login`)

OAuth PKCE pattern — same as `vercel login`:

1. User runs `kairo login`
2. CLI generates random `state` string (crypto.randomUUID)
3. CLI starts local HTTP server on port 4242
4. CLI opens browser: `https://kairo.dev/auth/cli?state=<state>`
5. User signs in via GitHub on the website
6. Website generates short-lived JWT, redirects to:
   `http://localhost:4242/callback?token=<jwt>&state=<state>`
7. CLI validates `state` matches, saves JWT to `~/.terminal-agent/token`
8. CLI closes local server, prints "Logged in as user@email.com ✓"
9. Every subsequent API call: `Authorization: Bearer <jwt>`

### Token file
```
~/.terminal-agent/token         ← JWT from kairo login
~/.terminal-agent/config.json   ← provider/model config (existing)
```

### CLI commands to add
| Command | Description |
|---|---|
| `kairo login` | Opens browser OAuth flow |
| `kairo logout` | Deletes `~/.terminal-agent/token` |
| `kairo whoami` | Shows logged-in email |
| `kairo sync` | Manually push last session to backend |

### app/auth/cli/page.tsx behaviour
- Entry point when `kairo login` opens the browser
- Reads `?state=` from query params
- If user not signed in → calls `signIn("github")` automatically
- After sign in → generates JWT with user id + email
- Redirects to `http://localhost:4242/callback?token=<jwt>&state=<state>`
- Shows "Authenticating KairoCLI..." UI while this happens

---

## Dashboard Pages

```
/dashboard              ← session history feed (default)
/dashboard/sessions     ← all sessions, search + filter
/dashboard/keys         ← API key manager per provider
/dashboard/usage        ← token usage charts
/dashboard/profile      ← account + logout
```

### Session card data
- Title (first message, truncated)
- Provider + model badge
- Token count
- Workspace path
- Relative timestamp ("2 hours ago")

---

## File Structure (actual + to be created)

```
src/
  app/
    page.tsx                        ← marketing homepage
    layout.tsx
    globals.css
    favicon.ico
    opengraph-image.tsx

    about/                          ← existing
    contact/                        ← existing
    docs/                           ← existing
    features/                       ← existing

    login/
      page.tsx                      ← calls signIn("github"), keep existing UI
    signup/
      page.tsx                      ← calls signIn("github"), keep existing UI

    auth/
      cli/
        page.tsx                    ← CREATE: kairo login entry point
      [...nextauth]/                ← RENAME from /auth if needed

    api/
      auth/
        [...nextauth]/
          route.ts                  ← CREATE: NextAuth handler
      sessions/
        route.ts                    ← CREATE: POST + GET
      config/
        sync/
          route.ts                  ← CREATE: GET api keys for CLI

    dashboard/
      layout.tsx                    ← CREATE: dashboard shell + sidebar
      page.tsx                      ← CREATE: session history
      sessions/
        page.tsx                    ← CREATE
      keys/
        page.tsx                    ← CREATE
      usage/
        page.tsx                    ← CREATE
      profile/
        page.tsx                    ← CREATE

  components/
    ui/                             ← Aceternity + shadcn (existing)
    navbar.tsx                      ← existing
    hero.tsx                        ← existing
    bento-features.tsx              ← existing
    interactive-terminal.tsx        ← existing
    terminal-window.tsx             ← existing
    workflow-demo.tsx               ← existing
    future-vision.tsx               ← existing
    cta-section.tsx                 ← existing
    open-source-section.tsx         ← existing
    footer.tsx                      ← existing
    install-command.tsx             ← existing
    page-header.tsx                 ← existing
    architecture-diagram.tsx        ← existing
    auth-brand-panel.tsx            ← existing
    auth-icons.tsx                  ← existing
    docs-sidebar.tsx                ← existing
    theme-provider.tsx              ← existing
    theme-toggle.tsx                ← existing

    dashboard/                      ← CREATE folder
      session-card.tsx
      usage-chart.tsx
      key-manager.tsx
      dashboard-sidebar.tsx

  lib/
    auth.ts                         ← CREATE: NextAuth config
    prisma.ts                       ← CREATE: Prisma singleton
    session.ts                      ← CREATE: session push/fetch helpers

  prisma/
    schema.prisma                   ← CREATE: full schema (see above)
```

---

## Environment Variables

```bash
# .env.local
DATABASE_URL=                        # Neon connection string
NEXTAUTH_SECRET=                     # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000   # production: https://kairo.dev
GITHUB_ID=                           # GitHub OAuth App client ID
GITHUB_SECRET=                       # GitHub OAuth App client secret
```

---

## Design System

### Colors
- Primary: black, white, neutral grays
- Accent: violet (`#7C3AED` range), blue (sparingly)
- Accent usage: CTAs, focus states, highlights ONLY
- NO colorful gradients, NO rainbow effects

### Both modes are first-class
- Dark mode: default
- Light mode: fully designed, not an afterthought
- Use next-themes with system default

### Typography
- Headlines: font-black, large, tight tracking
- Body: neutral-400 (dark) / neutral-600 (light)
- Monospace: terminal content only

### Spacing
- Large vertical section padding: py-32 minimum
- Content max-width: max-w-6xl centered
- Breathing room > density always

### Section backgrounds
- Every section: `overflow-hidden` + explicit `bg-[#080808]` or `bg-white`
- Never rely on inherited background
- Subtle violet radial gradient: `rgba(124,58,237,0.06)` max opacity
- Sections separated by `<div className="h-px bg-neutral-800/50" />`

---

## Component Conventions

### Aceternity Components Used
- `FloatingNavbar` — navbar
- `Spotlight` + `BackgroundBeams` — hero background
- `TypewriterEffect` — terminal animations
- `BentoGrid` + `GlowingEffect` — features section
- `CanvasRevealEffect` — live demo section background
- `TracingBeam` — scroll indicator
- `StickyScrollReveal` — workflow comparison
- `LampEffect` — future vision section header
- `VortexBackground` — CTA section
- `MovingBorder` — CTA button

### Terminal Component Rules
- Always animated, never static screenshots
- Typewriter timing: 50-80ms per char, 300ms pause between commands
- Output color: `#4ADE80` (green)
- Input color: white
- Path color: dimmed neutral
- Mac traffic lights on every terminal window
- Always dark background even in light mode

### Motion Rules
- Use: fade, blur, scale, reveal (Framer Motion)
- Never: bounce, float, excessive parallax
- Scroll-triggered via `useInView`
- Stagger delay: 0.1s max

---

## Real Product Data (never use placeholders)

### Install
```bash
npm install -g @abhilov/kairo
```

### CLI Commands
| Command | Description |
|---|---|
| `kairo` | Start interactive assistant |
| `kairo setup` | Configure provider and model |
| `kairo doctor` | Health checks |
| `kairo review` | Code review |
| `kairo chat` | Architecture chat |
| `kairo login` | Authenticate with kairo.dev |
| `kairo logout` | Remove local token |
| `kairo whoami` | Show logged-in user |
| `kairo sync` | Push last session to dashboard |

### Providers
NVIDIA, OpenAI, Anthropic, Groq, Ollama

### Links
- GitHub: https://github.com/abhilov23/KairoCLI
- npm: https://www.npmjs.com/package/@abhilov/kairo
- Website: https://kairo.dev

---

## What NOT to build yet
- Billing / plans / paywalls
- Usage limits / rate limiting
- Multi-agent workflows
- Autonomous tasks
- Team / org features
- MCP integrations (Phase 2)
- Google OAuth (GitHub only for now)

---

## Quality Test (run before shipping any section)
1. Would Vercel ship this?
2. Would Linear ship this?
3. Does every section have a memorable visual element?
4. Is every terminal animated (not static)?
5. Does every section have explicit `bg-` + `overflow-hidden`?

If any answer is NO → fix before moving on.

## Design Anti-patterns (never do these)
- Generic icon + title + description cards
- Flat sections with no depth
- Static terminal screenshots
- Placeholder commands
- Colorful gradients or rainbow effects
- Template-looking layouts
- Light mode as afterthought
- Misaligned headlines (all center or all left, never mixed)
- Solid colored bug-cards (flat purple/blue rectangles)
- White gradient bleed between dark sections