import type { Command, CommandResult } from "@/shared/types/command";
import type { FormattingStrategy } from "../strategies";

export interface FormatCommandOptions {
  input: string;
  strategy: FormattingStrategy;
  onResult: (result: string) => void;
  onUndo: (previousInput: string, previousOutput: string) => void;
  onRedo: (redoInput: string, redoOutput: string) => void;
}

export class FormatCommand implements Command {
  id = "json-format";
  description = "Format JSON using selected strategy";

  private options: FormatCommandOptions;
  private previousInput = "";
  private previousOutput = "";
  private executedInput = "";
  private executedOutput = "";
  private hasExecuted = false;

  constructor(options: FormatCommandOptions) {
    this.options = options;
  }

  async execute(): Promise<CommandResult> {
    try {
      if (!this.hasExecuted) {
        // First execution: store states and execute
        this.previousInput = this.options.input;
        this.executedInput = this.options.input;

        const formatted = this.options.strategy.format(this.options.input);
        this.executedOutput = formatted;
        this.hasExecuted = true;

        this.options.onResult(formatted);

        return {
          success: true,
          data: formatted,
        };
      }

      // Redo execution: apply stored results
      this.options.onRedo(this.executedInput, this.executedOutput);

      return {
        success: true,
        data: this.executedOutput,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown formatting error",
      };
    }
  }

  setPreviousOutput(output: string): void {
    this.previousOutput = output;
  }

  async undo(): Promise<void> {
    this.options.onUndo(this.previousInput, this.previousOutput);
  }
}
