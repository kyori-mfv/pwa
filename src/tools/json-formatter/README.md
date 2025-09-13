# JSON Formatter Tool

A comprehensive JSON formatting and validation tool with multiple formatting strategies and undo/redo support.

## Features

- **4 Formatting Strategies**: Pretty (2-space), Compact (1-space), Minified, Tabs
- **Real-time Validation**: Instant syntax checking with error details
- **Undo/Redo Support**: Full command history
- **Copy to Clipboard**: One-click output copying
- **Responsive Design**: Works on desktop and mobile

## Quick Start

1. Select "JSON Formatter" from the tools sidebar
2. Paste JSON in the input area
3. Choose formatting strategy
4. Click "Format" or "Validate"

## Architecture

### Strategy Pattern
Different formatting algorithms:
```typescript
interface FormattingStrategy {
  name: string;
  description: string;
  format(json: string): string;
}
```

**Available Strategies:**
- `PrettyFormatStrategy` - Standard 2-space indentation
- `CompactFormatStrategy` - 1-space indentation
- `MinifiedFormatStrategy` - No whitespace
- `TabFormatStrategy` - Tab-based indentation

### Command Pattern
Operations with undo/redo support:
```typescript
interface Command {
  id: string;
  description: string;
  execute(): Promise<CommandResult>;
  undo?(): Promise<void>;
}
```

## Usage Examples

### Basic Formatting
```typescript
import { PrettyFormatStrategy } from "@/tools/json-formatter/strategies";

const strategy = new PrettyFormatStrategy();
const formatted = strategy.format('{"name":"John","age":30}');
```

### Command with Undo
```typescript
import { FormatCommand } from "@/tools/json-formatter/commands";
import { commandManager } from "@/core/commands/command-manager";

const command = new FormatCommand({
  input: jsonString,
  strategy: new PrettyFormatStrategy(),
  onResult: (result) => console.log(result),
  onUndo: (prev) => console.log("Undone"),
  onRedo: (redo) => console.log("Redone")
});

await commandManager.executeCommand(command);
```

## File Structure

```
src/tools/json-formatter/
├── README.md                 # This file
├── index.ts                  # Tool registration
├── component.tsx             # Main React component
├── commands/
│   ├── format-command.ts     # Format command
│   └── validate-command.ts   # Validate command
└── strategies/
    └── formatting-strategy.ts # All strategies
```

## Adding Custom Strategies

```typescript
class CustomStrategy implements FormattingStrategy {
  name = "Custom";
  description = "Your custom formatting";
  
  format(json: string): string {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 4); // 4-space indent
  }
}
```

## Testing

```typescript
// Test strategy
const strategy = new PrettyFormatStrategy();
expect(strategy.format('{"test":true}')).toBe('{\n  "test": true\n}');

// Test validation
const command = new ValidateCommand({
  input: '{"valid": true}',
  onResult: (result) => expect(result.valid).toBe(true)
});
```

## Integration

The tool auto-registers when imported:
```typescript
import "@/tools/json-formatter"; // Registers with tool registry
```

---

**Version**: 1.0.0 | **Lines of Code**: 449 | **Status**: Production Ready