import { tool } from "@openai/agents";
import { z } from "zod";
import { readFile as readFileTool } from "./readFile.js";
import { searchText as searchTextTool } from "./searchText.js";
import { listDirectory as listDirectoryTool } from "./listDirectory.js";
import { currentDirectory as currentDirectoryTool } from "./currentDirectory.js";
import { getTime as getTimeTool } from "./getTime.js";
import { gitStatus as gitStatusTool } from "./gitStatus.js";
import { gitDiff as gitDiffTool } from "./gitDiff.js";
import { executeCommand as execCmdTool } from "./execCommand.js";
import { writeFile as writeFileTool } from "./writeFile.js";
import { replaceInFile as replaceInFileTool } from "./replaceInFile.js";
import { runScript as runScriptTool } from "./runScript.js";
import { changeDirectory as changeDirTool } from "./changeDirectory.js";
import { diffPreview as diffPreviewTool } from "./diffPreview.js";

export const workerTools = [
  tool({
    name: "get_time",
    description: "Get current system time",
    parameters: z.object({}),
    execute: async () => getTimeTool.execute({}),
  }),
  tool({
    name: "current_directory",
    description: "Get the current working directory.",
    parameters: z.object({}),
    execute: async () => currentDirectoryTool.execute(),
  }),
  tool({
    name: "list_directory",
    description: "List files and folders in a directory.",
    parameters: z.object({
      directory: z.string().optional(),
    }),
    execute: async ({ directory }: { directory?: string }) =>
      listDirectoryTool.execute({ directory }),
  }),
  tool({
    name: "read_file",
    description: "Read the contents of a file.",
    parameters: z.object({
      path: z.string().describe("Absolute path to the file"),
    }),
    execute: async ({ path }: { path: string }) =>
      readFileTool.execute({ path }),
  }),
  tool({
    name: "search_text",
    description: "Search recursively for text inside files.",
    parameters: z.object({
      text: z.string().describe("Text to search for"),
      directory: z.string().optional().describe("Directory to search in"),
    }),
    execute: async ({ text, directory }: { text: string; directory?: string }) =>
      searchTextTool.execute({ text, directory }),
  }),
  tool({
    name: "git_status",
    description: "Get current git repository status.",
    parameters: z.object({}),
    execute: async () => gitStatusTool.execute(),
  }),
  tool({
    name: "git_diff",
    description: "Get git diff for modified files.",
    parameters: z.object({
      file: z.string().optional().describe("Optional file path to inspect diff for"),
    }),
    execute: async ({ file }: { file?: string }) =>
      gitDiffTool.execute({ file }),
  }),
  tool({
    name: "execute_command",
    description: "Execute Windows PowerShell terminal commands and return the output as plain text.",
    parameters: z.object({
      command: z.string().describe("The PowerShell command to execute"),
    }),
    execute: async ({ command }: { command: string }) =>
      execCmdTool.execute({ command }),
  }),
  tool({
    name: "write_file",
    description: "Create or overwrite files with content.",
    parameters: z.object({
      filePath: z.string().describe("Path of the file to write"),
      content: z.string().describe("Content to write into the file"),
    }),
    execute: async ({ filePath, content }: { filePath: string; content: string }) =>
      writeFileTool.execute({ filePath, content }),
  }),
  tool({
    name: "replace_in_file",
    description: "Replace specific text inside a file.",
    parameters: z.object({
      filePath: z.string().describe("Path of the file to edit"),
      search: z.string().describe("Exact text to search for"),
      replace: z.string().describe("Replacement text"),
    }),
    execute: async ({ filePath, search, replace }: { filePath: string; search: string; replace: string }) =>
      replaceInFileTool.execute({ filePath, search, replace }),
  }),
  tool({
    name: "run_script",
    description: "Run package manager scripts (build, dev, test, lint, etc).",
    parameters: z.object({
      script: z.string().describe("Script to run"),
    }),
    execute: async ({ script }: { script: string }) =>
      runScriptTool.execute({ script }),
  }),
  tool({
    name: "change_directory",
    description: "Change the current working directory.",
    parameters: z.object({
      path: z.string().describe("Directory path to change into"),
    }),
    execute: async ({ path: targetPath }: { path: string }) =>
      changeDirTool.execute({ path: targetPath }),
  }),
  tool({
    name: "diff_preview",
    description: "Generate a unified diff preview between existing file content and proposed new content.",
    parameters: z.object({
      filePath: z.string().describe("Target file path"),
      newContent: z.string().describe("Proposed full file content for preview"),
    }),
    execute: async ({ filePath, newContent }: { filePath: string; newContent: string }) =>
      diffPreviewTool.execute({ filePath, newContent }),
  }),
];
