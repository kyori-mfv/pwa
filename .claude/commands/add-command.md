---
description: Add command pattern to tool
argument-hint: [tool] [command]
---

Add command pattern implementation: **$2** to tool: **$1**

**Command Creation Process:**
1. **Create Command File** - `src/tools/$1/commands/$2-command.ts`
2. **Implement Command Interface** - With execute() and undo() methods
3. **Register Command** - Add to tool's command manager
4. **UI Integration** - Add command trigger to tool UI
5. **Update Types** - Add command to TypeScript definitions
6. **Add Tests** - Create command-specific tests with undo/redo

**Command Template:**
```typescript
export interface Command {
  execute(): Promise<CommandResult>;
  undo(): Promise<void>;
  description: string;
}

export class $2Command implements Command {
  description = '$2 command for $1';
  private previousState: any;

  constructor(private context: ToolContext, private payload: any) {}

  async execute(): Promise<CommandResult> {
    this.previousState = this.context.getCurrentState();
    // Command implementation here
    return { success: true, data: result };
  }

  async undo(): Promise<void> {
    this.context.restoreState(this.previousState);
  }
}
```

**Integration Steps:**
1. Add command to tool's command registry
2. Create UI button/trigger for the command
3. Implement command in tool's action handlers
4. Add command to undo/redo history
5. Update tool's command manager
6. Add keyboard shortcuts if applicable

**Files to Modify:**
- `src/tools/$1/commands/$2-command.ts` (new)
- `src/tools/$1/commands/index.ts` (update registry)
- `src/tools/$1/use-$1-tool.ts` (update hook)
- `src/tools/$1/components/tool-actions.tsx` (update UI)
- `src/tools/$1/types/index.ts` (update types)

Please implement the new command with full undo/redo support following the tool's existing command patterns.