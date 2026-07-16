export type ExecutionState = {
  turnCount: number;
  lastToolName: string | null;
  lastError: string | null;
  lastUpdatedAt: string;
  totalTokens: number;
  lastPromptTokens: number;
};

export function createInitialExecutionState(): ExecutionState {
  return {
    turnCount: 0,
    lastToolName: null,
    lastError: null,
    lastUpdatedAt: new Date().toISOString(),
    totalTokens: 0,
    lastPromptTokens: 0,
  };
}
