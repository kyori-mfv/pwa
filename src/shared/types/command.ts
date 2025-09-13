export interface CommandResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Command {
  id: string;
  description: string;
  execute(): Promise<CommandResult>;
  undo?(): Promise<void>;
}
