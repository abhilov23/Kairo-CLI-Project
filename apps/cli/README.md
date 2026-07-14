# KairoCLI

A terminal-native AI coding assistant built with TypeScript and the OpenAI SDK.

KairoCLI runs as an interactive CLI agent with tool-calling capabilities — reading/writing files, executing commands, searching code, and managing git workflows — all from your terminal.

---

## Demo

https://github.com/user-attachments/assets/e95504c1-01e1-4f7d-9eea-ad753c23acb2

---

## Features

- **Interactive terminal assistant** — conversational AI that can act on your codebase
- **Multi-provider support** — OpenAI, Anthropic, Groq, NVIDIA, Ollama, or any OpenAI-compatible API (Custom)
- **Streaming responses** — real-time buffered responses with markdown rendering via `marked-terminal`
- **Tool-calling agent** — 13 tools for filesystem, shell, git, and search operations
- **Safety system** — dangerous commands (`rm -rf`, `format`, `git reset --hard`, etc.) and protected files (`.env`, `package.json`, `pnpm-lock.yaml`) require interactive confirmation
- **Runtime session persistence** — conversation history, execution state, task state, and workspace state saved across sessions (up to 200 messages with history trimming)
- **Workspace-aware execution** — tracks current working directory and execution state
- **Git-aware tooling** — status, diff, and diff preview tools
- **Non-interactive mode** — `--task` flag for single-shot automation
- **Configuration health checks** — `kairo doctor` validates provider setup, API keys, endpoints, and config format
- **Old config migration** — detects and reports outdated v1.x config format
- **Web dashboard auth** — `/login`, `/whoami`, `/logout` commands for website-integrated authentication
- **Session syncing** — syncs CLI sessions to the Kairo website dashboard
- **Docker support** — containerized runtime for portable execution
- **CI/CD** — GitHub Actions pipeline with build, typecheck, and test

---

## Architecture

```
kairo/
├── index.ts               # CLI entry point — routes commands (setup, doctor, --task, interactive)
├── config/                # Configuration loading, saving, setup flow
│   ├── configManager.ts   # Config read/write to ~/.terminal-agent/config.json
│   ├── authManager.ts     # Auth session persistence (access/jwt tokens, user profile)
│   └── setup.ts           # Interactive provider/model setup with pre-fill support
├── core/                  # Agent loop, command routing, streaming, tool execution, safety
│   ├── agentLoop.ts       # Interactive and non-interactive agent loops
│   ├── cliCommands.ts     # Help, version, doctor commands
│   ├── commandRouter.ts   # Routes /-prefixed internal commands (/help, /tools, /clear, /login, /whoami, /logout)
│   ├── login.ts           # Device-code authentication flow via Kairo website
│   ├── safety.ts          # Dangerous command patterns & protected file detection
│   ├── streamHandler.ts   # Streaming response with tool call assembly from delta chunks
│   ├── syncSessions.ts    # Pushes CLI sessions to the website dashboard API
│   ├── toolExecutor.ts    # Tool execution with safety checks, spinner, and error handling
│   └── types.ts           # TypeScript types for streaming deltas and tool calls
├── prompt/                # System prompt defining agent behavior
│   └── prompt.ts          # "Shell Copilot" system prompt with platform-aware instructions
├── providers/             # Provider definitions and client initialization
│   ├── getClient.ts       # OpenAI client creation from config
│   └── providerMap.ts     # Provider definitions (base URLs, env vars, default models)
├── runtime/               # Session persistence, execution/task/workspace state
│   ├── executionState.ts
│   ├── sessionManager.ts  # Persistent session with message serialization & trimming
│   ├── taskState.ts
│   └── workspaceState.ts
├── tests/                 # Vitest test suite
│   ├── agentLoop.test.ts
│   ├── auth.test.ts       # Auth manager read/write/clear tests
│   ├── config.test.ts     # Config write/read/validation
│   ├── login.test.ts      # Login flow tests
│   ├── registry.test.ts   # Tool registry schema generation
│   ├── setup.test.ts      # Interactive setup with mocked inputs
│   └── tools.test.ts      # Tool execution (read, list, time)
├── tools/                 # Tool registry and individual tool implementations
│   ├── registry.ts        # Zod-based tool registry with OpenAI schema generation
│   ├── index.ts           # Registers all 13 tools
│   ├── changeDirectory.ts
│   ├── currentDirectory.ts
│   ├── diffPreview.ts     # Unified diff generation via `diff` library
│   ├── execCommand.ts     # PowerShell-based command execution (Windows-aware)
│   ├── getTime.ts
│   ├── gitDiff.ts
│   ├── gitStatus.ts
│   ├── listDirectory.ts   # Returns JSON with file names and types
│   ├── readFile.ts
│   ├── replaceInFile.ts   # Targeted text replacement with search validation
│   ├── runScript.ts       # Runs package manager scripts (dev, build, test, lint)
│   ├── searchText.ts      # Recursive text search with line-level context
│   └── writeFile.ts       # File creation with directory auto-creation
├── ui/                    # Terminal UI
│   ├── book.ts            # Book-style layout: headers, code blocks, status bar, markdown renderer
│   ├── mascot.ts          # 6-line ASCII mascot with moods + spinner + walk animation
│   ├── render.ts          # Markdown rendering with marked-terminal
│   └── ui.ts              # Banner, headers, input prompt, and colored output helpers
├── scripts/               # Utilities
│   └── e2e-test.mjs       # E2E test harness for the login flow
├── demo/                  # Demo assets
│   ├── diagram.png
│   └── video.mp4
├── tsconfig.json          # TypeScript config (ES2022, NodeNext module resolution)
└── package.json           # pnpm-managed dependencies, bin entry point
```

---

## Install

### From npm

```bash
npm install -g @abhilov/kairo
```

### From source

```bash
pnpm install
pnpm build
```

---

## Setup

```bash
kairo setup
```

You'll be prompted to select a provider and configure the model.

### Supported Providers

| # | Provider  | Auth method                   | Default model                          |
|---|-----------|-------------------------------|----------------------------------------|
| 1 | OpenAI    | `OPENAI_API_KEY` env var      | `gpt-4o`                               |
| 2 | Anthropic | `ANTHROPIC_API_KEY` env var   | `claude-sonnet-4-20250514`             |
| 3 | Groq      | `GROQ_API_KEY` env var        | `llama-3.3-70b-versatile`              |
| 4 | NVIDIA    | `NVIDIA_API_KEY` env var      | `meta/llama-3.3-70b-instruct`          |
| 5 | Ollama    | No API key required (local)   | `llama3.2`                             |
| 6 | Custom    | Set base URL, API key, model  | User-specified                         |

### Configuration

Setup saves your configuration to:

```
~/.terminal-agent/config.json
```

Example config:
```json
{
  "provider": "openai",
  "model": "gpt-4o"
}
```

For custom providers with optional base URL override:
```json
{
  "provider": "custom",
  "baseURL": "https://api.example.com/v1",
  "apiKey": "sk-custom-key",
  "model": "gpt-4o"
}
```

### Config Health Check

```bash
kairo doctor
```

Validates:
- Config file exists and is readable
- Provider is recognized
- API keys are set (env var or config value)
- Base URL is valid (for custom providers)
- Ollama endpoint is reachable (for Ollama provider)
- Detects old v1.x config format and suggests re-configuration

---

## Run

```bash
# Interactive session
kairo

# Non-interactive task
kairo --task "show me the git log"

# Development mode (hot reload)
pnpm dev

# Production build
pnpm build
pnpm start

# Direct invocation from build output
node dist/index.js
```

---

## CLI Commands

| Command              | Description                                |
|----------------------|--------------------------------------------|
| `kairo`              | Start interactive assistant                |
| `kairo setup`        | Configure provider and model               |
| `kairo doctor`       | Run configuration health checks            |
| `kairo help`         | Show CLI help                              |
| `kairo version`      | Show CLI version                           |
| `kairo --task <txt>` | Execute a single task non-interactively    |

---

## Internal Commands

| Command      | Description                      |
|--------------|----------------------------------|
| `/help`      | Show interactive help and tools  |
| `/tools`     | List available tools             |
| `/clear`     | Clear conversation memory        |
| `/login`     | Authenticate via Kairo website   |
| `/whoami`    | Show current auth session        |
| `/logout`    | Clear auth session               |
| `clear`/`cls`| Clear terminal screen            |
| `exit`       | Exit KairoCLI                    |

---

## Available Tools

| Tool               | Description                              |
|--------------------|------------------------------------------|
| `get_time`         | Get current system date and time         |
| `execute_command`  | Run a terminal command (PowerShell)      |
| `current_directory`| Get current working directory            |
| `list_directory`   | List files and folders (JSON output)     |
| `read_file`        | Read file contents                       |
| `search_text`      | Recursive text search with context       |
| `change_directory` | Change working directory                 |
| `write_file`       | Write text to a file (auto-creates dirs) |
| `replace_in_file`  | Targeted text replacement in a file      |
| `run_script`       | Run package manager scripts (`pnpm dev`) |
| `git_status`       | Show git repository status               |
| `git_diff`         | Show diff for modified files             |
| `diff_preview`     | Show unified diff preview for changes    |

---

## Safety System

KairoCLI includes a multi-layered safety system to prevent accidental damage:

### Dangerous Command Detection

Commands matching these patterns trigger an interactive confirmation prompt:

| Category | Examples |
|----------|----------|
| **Destructive deletes** | `rm -rf`, `rmdir`, `del /s`, `remove-item -recurse`, `shred`, `dd` |
| **System operations** | `format`, `shutdown`, `reboot`, `sudo`, `chown /`, `chmod /` |
| **Git destructive** | `git reset --hard`, `git clean -f`, `git checkout --`, `git restore` |
| **Windows system** | `bcdedit`, `cipher /w`, `takeown`, `icacls /grant`, `sp delete` |
| **Linux/macOS system** | `killall`, `pkill`, `launchctl unload`, `systemctl stop` |

### Protected Files

Writing to these files requires confirmation:
- `.env`
- `package.json`
- `pnpm-lock.yaml`

### Confirmation Flow

When a dangerous command or protected file is detected, KairoCLI displays the action and asks for confirmation (`y/n`). If declined, the tool returns a cancellation message and the agent continues.

---

## Agent Behavior

The agent runs as **Shell Copilot** with platform-aware instructions:

- **Windows-aware** — prefers PowerShell-compatible commands, avoids bash-only syntax
- **Tool-calling native** — uses native API tool-calling (no pseudo-code output); gathers context with read-only tools before writing files
- **Response style** — concise, bullet-pointed instructions, code blocks for commands, natural conversational responses
- **Prefer `run_script`** — uses `run_script` tool over `execute_command` for package manager workflows

---

## Runtime State

KairoCLI persists sessions to disk so you can resume where you left off:

```
~/.terminal-agent/session.json
```

The runtime tracks:

- **Conversation messages** — up to 200 recent messages with history trimming and system prompt preservation
- **Execution state** — turn count, last tool used, last error, last updated timestamp
- **Task state** — current task, status (`idle` / `in_progress` / `blocked` / `done`)
- **Workspace state** — current working directory

---

## Auth System

KairoCLI supports device-code authentication via the Kairo website:

```
/login   — Opens browser for device-code pairing
/whoami  — Shows current authenticated session details
/logout  — Clears auth session locally and remotely
```

Auth sessions are stored in `~/.terminal-agent/auth.json`. Session data can be synced to the website dashboard for tracking.

---

## Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `pnpm build`     | Compile TypeScript to `dist/`        |
| `pnpm dev`       | Run with hot reload via `tsx`        |
| `pnpm start`     | Run compiled output from `dist/`     |
| `pnpm test`      | Run Vitest test suite                |
| `pnpm setup`     | Run the interactive setup flow       |
| `pnpm format`    | Format code with Prettier            |

---

## Tech Stack

- **TypeScript** (v6) — strict mode, ES2022 target, NodeNext module resolution
- **OpenAI SDK** (v6) — streaming chat completions with tool calling
- **Zod** (v4) — runtime parameter validation + JSON Schema generation via `zod-to-json-schema`
- **Chalk** / **Boxen** — terminal styling and banners
- **Marked** / **marked-terminal** — markdown rendering in the terminal
- **Diff** — unified diff generation for diff previews
- **Ora** — spinner UI during tool execution
- **Dotenv** — environment variable loading from `.env`
- **Vitest** (v4) — test runner
- **Prettier** — code formatting
- **pnpm** — package manager

---

## Tests

```bash
pnpm test
```

The test suite covers:
- **Stream handler** — text-only responses, single/multiple tool call assembly from delta chunks, combined content + tool calls, empty streams
- **Tool executor** — execution flow, cancellation via safety checks, error handling, multi-tool processing with partial failures
- **Agent loop integration** — end-to-end text and tool call cycles
- **Tool registry** — OpenAI schema generation, parameter validation, type coercion
- **Config** — write/read with optional fields, custom providers, missing file handling
- **Auth manager** — auth session save/load/clear
- **Login flow** — device-code authentication flow tests
- **Setup flow** — all providers, custom provider, invalid input, pre-fill from existing config, field overwrites, provider switching

---

## Docker

```bash
docker build -t kairocli .
docker run -it kairocli
```

---

## CI/CD

GitHub Actions runs on every push and PR to `main`:

- `pnpm install` (with caching)
- `pnpm build`
- `pnpm test`

---

## Repository

- **GitHub:** https://github.com/abhilov23/KairoCLI
- **npm:** https://www.npmjs.com/package/@abhilov/kairo
