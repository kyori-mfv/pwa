# JSON Formatter Tool

A comprehensive JSON formatting and validation tool with multiple formatting strategies.

## Features

- **4 Formatting Strategies**: Pretty (2-space), Compact (1-space), Minified, Tabs
- **Real-time Validation**: Instant syntax checking with error details
- **Copy to Clipboard**: One-click output copying
- **Responsive Design**: Works on desktop and mobile
- **Instance State**: Preserves input and settings across navigation

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

### State Management
Persistent tool state:
```typescript
interface JsonFormatterState {
  input: string;
  output: string;
  selectedStrategyName: string;
  validation: ValidationResult | null;
}
```

## Usage Examples

### Basic Formatting
```typescript
import { PrettyFormatStrategy } from "@/tools/json-formatter/strategies";

const strategy = new PrettyFormatStrategy();
const formatted = strategy.format('{"name":"John","age":30}');
```

### Direct Formatting
```typescript
import { PrettyFormatStrategy } from "@/tools/json-formatter/strategies";

const strategy = new PrettyFormatStrategy();
try {
  const formatted = strategy.format('{"name":"John","age":30}');
  console.log(formatted);
} catch (error) {
  console.error("Invalid JSON:", error.message);
}
```

## File Structure

```
src/tools/json-formatter/
├── README.md                 # This file
├── index.ts                  # Tool registration
├── component.tsx             # Main React component
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
try {
  JSON.parse('{"valid": true}');
  console.log("Valid JSON");
} catch (error) {
  console.log("Invalid JSON");
}
```

## Integration

The tool auto-registers when imported:
```typescript
import "@/tools/json-formatter"; // Registers with tool registry
```

---

**Version**: 1.0.0 | **Lines of Code**: 449 | **Status**: Production Ready