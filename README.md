# Kairo

**Your AI teammate in the terminal.**

Kairo is a monorepo housing an AI-powered terminal coding assistant and its companion web dashboard. It brings code review, debugging, architecture analysis, and multi-file refactoring directly to your command line — no context switching, no browser tabs.

- **CLI** — A terminal-native AI coding assistant with multi-provider support, orchestrator/worker agent architecture, and 15+ integrated tools
- **Website** — A Next.js marketing site and dashboard with session history, API key management, usage analytics, and device-code CLI authentication

## Repository Structure

```
kairo/
├── apps/
│   ├── cli/                          # @abhilov/kairo — CLI tool (npm-published)
│   │   ├── core/                     # Agent loop, command routing, streaming, safety
│   │   ├── config/                   # Provider/model config, auth persistence, setup flow
│   │   ├── prompt/                   # System prompts (orchestrator + worker agents)
│   │   ├── providers/                # OpenAI, Anthropic, Groq, NVIDIA, Ollama, Custom
│   │   ├── runtime/                  # Session persistence, execution/task/workspace state
│   │   ├── tools/                    # 15 tool implementations (filesystem, shell, git, etc.)
│   │   ├── ui/                       # Terminal UI: markdown rendering, spinners, agent panels
│   │   ├── types/                    # Shared TypeScript types
│   │   ├── tests/                    # 120+ Vitest tests
│   │   └── scripts/                  # E2E test harness
│   └── website/                      # @abhilov/kairo-website — Next.js dashboard
│       ├── src/
│       │   ├── app/                  # Next.js App Router pages and API routes
│       │   │   ├── api/              # REST endpoints: auth, sessions, config, uploadthing
│       │   │   ├── dashboard/        # Keys, profile, sessions, usage pages
│       │   │   ├── docs/             # Commands, config, providers documentation
│       │   │   ├── auth/             # Login/signup flows + CLI device auth
│       │   │   └── ...               # Landing, about, features, contact pages
│       │   ├── components/
│       │   │   ├── ui/               # Aceternity UI primitives (beams, vortex, spotlight)
│       │   │   ├── dashboard/        # Session cards, sidebar, animated counters
│       │   │   └── ...               # Navbar, hero, footer, terminal demos
│       │   ├── hooks/                # React custom hooks
│       │   └── lib/                  # Utility functions
│       ├── prisma/
│       │   └── schema.prisma         # PostgreSQL schema (9 models)
│       └── public/                   # Static assets
└── packages/                         # Shared packages (future)
```

## KairoCLI — Terminal AI Assistant

### Features

- **Interactive terminal assistant** — conversational AI that operates on your codebase
- **Multi-provider support** — OpenAI, Anthropic, Groq, NVIDIA, Ollama, or any OpenAI-compatible API
- **Orchestrator + worker architecture** — primary agent spawns parallel sub-agents for complex tasks
- **Parallel subagent execution** — multiple `spawn_agent` calls run simultaneously via `Promise.all`
- **Live agent status panel** — in-place terminal UI showing all running agents, tasks, and elapsed time
- **15 tool-calling capabilities** — filesystem, shell, git, search, and script operations
- **Streaming responses** — real-time markdown rendering via `marked-terminal`
- **Safety system** — dangerous commands (`rm -rf`, `git reset --hard`, etc.) and protected files (`.env`, `package.json`) require interactive confirmation
- **Session persistence** — conversation history and state saved across sessions (up to 200 messages with trimming)
- **Non-interactive mode** — `--task` flag for single-shot automation in CI/CD
- **Config health checks** — `kairo doctor` validates provider setup, API keys, and endpoints
- **Web dashboard auth** — device-code authentication flow via the Kairo website
- **Session syncing** — pushes CLI sessions to the website dashboard for tracking
- **Docker support** — containerized runtime for portable execution

### Supported Providers

| Provider  | Auth method                   | Default model                          |
|-----------|-------------------------------|----------------------------------------|
| OpenAI    | `OPENAI_API_KEY` env var      | `gpt-4o`                               |
| Anthropic | `ANTHROPIC_API_KEY` env var   | `claude-sonnet-4-20250514`             |
| Groq      | `GROQ_API_KEY` env var        | `llama-3.3-70b-versatile`              |
| NVIDIA    | `NVIDIA_API_KEY` env var      | `meta/llama-3.3-70b-instruct`          |
| Ollama    | No API key required (local)   | `llama3.2`                             |
| Custom    | Set base URL, API key, model  | User-specified                         |

### CLI Commands

| Command              | Description                                |
|----------------------|--------------------------------------------|
| `kairo`              | Start interactive assistant                |
| `kairo setup`        | Configure provider and model               |
| `kairo doctor`       | Run configuration health checks            |
| `kairo help`         | Show CLI help                              |
| `kairo version`      | Show CLI version                           |
| `kairo --task <txt>` | Execute a single task non-interactively    |

### Internal Commands

| Command   | Description                      |
|-----------|----------------------------------|
| `/help`   | Show interactive help and tools  |
| `/tools`  | List available tools             |
| `/clear`  | Clear conversation memory        |
| `/login`  | Authenticate via Kairo website   |
| `/whoami` | Show current auth session        |
| `/logout` | Clear auth session               |

### Tools

| Tool               | Description                                              |
|--------------------|----------------------------------------------------------|
| `get_time`         | Get current system date and time                         |
| `execute_command`  | Run a terminal command (PowerShell)                      |
| `current_directory`| Get current working directory                            |
| `list_directory`   | List files and folders (JSON output)                     |
| `read_file`        | Read file contents                                       |
| `search_text`      | Recursive text search with context                       |
| `change_directory` | Change working directory                                 |
| `write_file`       | Write text to a file (auto-creates dirs)                 |
| `replace_in_file`  | Targeted text replacement in a file                      |
| `run_script`       | Run package manager scripts                              |
| `git_status`       | Show git repository status                               |
| `git_diff`         | Show diff for modified files                             |
| `diff_preview`     | Show unified diff preview for changes                    |
| `spawn_agent`      | Spawn parallel worker agents for multi-file investigation|

## Website — Dashboard & Auth Portal

A Next.js 16 application that serves as the marketing site and user dashboard for Kairo.

### Pages

| Route                | Description                                |
|----------------------|--------------------------------------------|
| `/`                  | Landing page with hero, demo, features     |
| `/about`             | About Kairo                                |
| `/features`          | Detailed feature showcase                  |
| `/docs`              | Documentation (commands, config, providers)|
| `/docs/commands`     | CLI commands reference                     |
| `/docs/config`       | Configuration guide                        |
| `/docs/providers`    | Provider setup guide                       |
| `/contact`           | Contact form                               |
| `/login`             | User login (email + GitHub OAuth)          |
| `/signup`            | User registration                          |
| `/auth/cli`          | CLI device-code authentication flow        |
| `/cli/verify`        | CLI pairing code verification              |
| `/dashboard`         | Main dashboard overview                    |
| `/dashboard/keys`    | API key management                         |
| `/dashboard/profile` | User profile settings                      |
| `/dashboard/sessions`| CLI session history and analytics          |
| `/dashboard/usage`   | Token usage tracking                       |

### API Routes

| Route                        | Method | Description                         |
|------------------------------|--------|-------------------------------------|
| `/api/auth/[...nextauth]`    | *      | NextAuth v5 OAuth + credentials     |
| `/api/auth/signup`           | POST   | Email registration                  |
| `/api/auth/device`           | POST   | Initiate CLI device-code auth       |
| `/api/auth/device/token`     | POST   | Poll for device authorization       |
| `/api/auth/device/confirm`   | POST   | Confirm device code (web)           |
| `/api/auth/cli-session`      | POST   | Create CLI session record           |
| `/api/sessions`              | GET    | List user's CLI sessions            |
| `/api/config/sync`           | POST   | Sync CLI config to cloud            |
| `/api/user/profile`          | GET    | Get user profile                    |
| `/api/user/profile/image`    | POST   | Upload profile image                |
| `/api/uploadthing`           | *      | File upload handler                 |

### Database Models

The PostgreSQL schema (via Prisma) includes 9 models:

| Model              | Purpose                                    |
|--------------------|--------------------------------------------|
| `User`             | Core user profile with NextAuth fields     |
| `CliTokenBlocklist`| JWT blacklist for CLI token revocation     |
| `Account`          | NextAuth OAuth accounts (GitHub, etc.)     |
| `Session`          | NextAuth web sessions                      |
| `VerificationToken`| Email verification tokens                  |
| `DeviceCode`       | Device-flow CLI pairing codes              |
| `KairoSession`     | CLI conversation metadata                  |
| `ApiKey`           | Hashed provider API keys                   |
| `UsageLog`         | Per-request token usage records            |

### Environment Variables

| Variable           | Purpose                                    |
|--------------------|--------------------------------------------|
| `DATABASE_URL`     | PostgreSQL connection string               |
| `NEXTAUTH_SECRET`  | Encryption secret for NextAuth JWT/cookies |
| `NEXTAUTH_URL`     | Canonical site URL                         |
| `GITHUB_ID`        | GitHub OAuth App client ID                 |
| `GITHUB_SECRET`    | GitHub OAuth App client secret             |

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 11 (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/abhilov23/Kairo-CLI-Project.git
cd Kairo-CLI-Project
pnpm install
pnpm build
```

### Development

```bash
# Run both apps in dev mode
pnpm dev

# Run only the CLI
cd apps/cli && pnpm dev

# Run only the website
cd apps/website && pnpm dev
```

### CLI Setup

```bash
# Configure provider and model
kairo setup

# Verify configuration
kairo doctor

# Start interactive session
kairo
```

### Website Setup

```bash
cd apps/website
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET
pnpm db:push    # Push Prisma schema to database
pnpm dev        # Start at http://localhost:3000
```

## Scripts

| Command            | Description                              |
|--------------------|------------------------------------------|
| `pnpm build`       | Build all apps and packages              |
| `pnpm dev`         | Run all apps in development mode         |
| `pnpm start`       | Start production builds                  |
| `pnpm test`        | Run all tests across monorepo            |
| `pnpm lint`        | Lint all apps and packages               |
| `pnpm format`      | Format code with Prettier                |
| `pnpm typecheck`   | TypeScript type checking                 |
| `pnpm clean`       | Clean all build outputs                  |

## Tech Stack

| Layer       | Technology                                              |
|-------------|---------------------------------------------------------|
| **Monorepo**| pnpm workspaces, Turborepo                              |
| **CLI**     | TypeScript, OpenAI SDK, @openai/agents, Zod, Chalk, Vitest |
| **Website** | Next.js 16, React 19, Prisma, PostgreSQL, Tailwind CSS 4, shadcn/ui, Aceternity UI |
| **Auth**    | NextAuth v5, GitHub OAuth, device-code flow             |
| **CI**      | GitHub Actions (build, typecheck, test)                 |

## Safety System

KairoCLI includes multi-layered safety to prevent accidental damage:

**Dangerous command patterns** trigger confirmation prompts:
- Destructive deletes: `rm -rf`, `rmdir`, `del /s`, `Remove-Item -Recurse`
- System operations: `format`, `shutdown`, `sudo`, `chown /`
- Git destructive: `git reset --hard`, `git clean -f`, `git checkout --`
- Windows system: `bcdedit`, `takeown`, `icacls /grant`

**Protected files** require confirmation before writing:
- `.env`, `package.json`, `pnpm-lock.yaml`

## Docker

```bash
docker build -t kairocli apps/cli
docker run -it kairocli
```

## Links

- **GitHub:** https://github.com/abhilov23/Kairo-CLI-Project
- **npm:** https://www.npmjs.com/package/@abhilov/kairo
