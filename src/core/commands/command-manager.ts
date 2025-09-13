import type { Command, CommandResult } from "@/shared/types/command";

class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;

  async executeCommand(command: Command): Promise<CommandResult> {
    const result = await command.execute();

    if (result.success) {
      // Remove any commands after current index
      this.history = this.history.slice(0, this.currentIndex + 1);
      // Add new command
      this.history.push(command);
      this.currentIndex++;
    }

    return result;
  }

  async undo(): Promise<boolean> {
    if (this.currentIndex < 0) return false;

    const command = this.history[this.currentIndex];
    if (command.undo) {
      await command.undo();
      this.currentIndex--;
      return true;
    }

    return false;
  }

  async redo(): Promise<boolean> {
    if (this.currentIndex >= this.history.length - 1) return false;

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    const result = await command.execute();

    return result.success;
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  getHistory(): Command[] {
    return [...this.history];
  }
}

export const commandManager = new CommandManager();
