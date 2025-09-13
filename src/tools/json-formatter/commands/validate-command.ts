import type { Command, CommandResult } from "@/shared/types/command";

export interface ValidateCommandOptions {
  input: string;
  onResult: (result: { valid: boolean; error?: string; lineNumber?: number }) => void;
}

export class ValidateCommand implements Command {
  id = "json-validate";
  description = "Validate JSON syntax";

  private options: ValidateCommandOptions;

  constructor(options: ValidateCommandOptions) {
    this.options = options;
  }

  async execute(): Promise<CommandResult> {
    try {
      JSON.parse(this.options.input);
      const result = { valid: true };
      this.options.onResult(result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      let lineNumber: number | undefined;
      let message = "Invalid JSON syntax";

      if (error instanceof SyntaxError) {
        message = error.message;
        // Try to extract line number from error message
        const match = message.match(/at line (\d+)/);
        if (match) {
          lineNumber = Number.parseInt(match[1], 10);
        }
      }

      const result = {
        valid: false,
        error: message,
        lineNumber,
      };

      this.options.onResult(result);

      return {
        success: true,
        data: result,
      };
    }
  }
}
