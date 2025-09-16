# Text Compare Tool

A comprehensive text comparison tool with multiple algorithms for analyzing differences between two texts.

## Features

- **Multiple Comparison Algorithms**: Line-by-line, character-level, word-level, and side-by-side
- **Real-time Highlighting**: Visual diff highlighting with color coding
- **Statistics Display**: Shows additions, deletions, and changes count
- **State Persistence**: Maintains text and algorithm selection across sessions
- **Copy Functionality**: Export comparison results to clipboard
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. **Input Text**: Paste or type text in both "Text A (Original)" and "Text B (Modified)" panels
2. **Choose Algorithm**: Select comparison method from the algorithm buttons
3. **Compare**: Click "Compare Texts" to generate diff
4. **Review Results**: View highlighted differences and statistics
5. **Export**: Use "Copy" to save results to clipboard

## Architecture Patterns

### Strategy Pattern
The tool implements the Strategy pattern for comparison algorithms:

```typescript
interface ComparisonStrategy {
  name: string;
  description: string;
  compare(textA: string, textB: string): ComparisonResult;
}
```

**Available Strategies:**
- `LineComparisonStrategy` - Unified diff format
- `CharacterComparisonStrategy` - Inline character highlighting
- `WordComparisonStrategy` - Token-based comparison
- `SideBySideComparisonStrategy` - Split view layout

### Component Architecture
- **Modular Components**: Reusable UI components with clear separation of concerns
- **State Management**: Uses `useToolState` hook for persistence
- **Plugin System**: Auto-registers with tool registry

## File Structure

```
src/tools/text-compare/
├── components/
│   ├── index.tsx              # Main component with state logic
│   ├── header.tsx             # Tool header with title/description
│   ├── input-panel.tsx        # Text input areas with stats
│   ├── comparison-controls.tsx # Algorithm selection and actions
│   └── output-panel.tsx       # Results display with highlighting
├── strategies/
│   ├── types.ts               # Strategy interfaces
│   ├── line-comparison.ts     # LCS-based line diff
│   ├── character-comparison.ts # Character-level diff
│   ├── word-comparison.ts     # Word tokenization diff
│   └── side-by-side-comparison.ts # Split view diff
├── index.ts                   # Plugin registration
└── README.md                  # This documentation
```

## Usage Examples

### Basic Comparison
```typescript
// Text inputs automatically trigger state updates
const handleTextChange = (value: string) => {
  setToolState({ textA: value }); // or textB
};

// Algorithm selection
const handleStrategyChange = (strategyName: string) => {
  setToolState({ selectedStrategyName: strategyName });
};
```

### Custom Strategy Implementation
```typescript
export class CustomComparisonStrategy implements ComparisonStrategy {
  name = "Custom Algorithm";
  description = "Your custom comparison logic";

  compare(textA: string, textB: string): ComparisonResult {
    // Implement your comparison logic
    return {
      unified: "diff output",
      additions: 0,
      deletions: 0,
      changes: 0,
      identical: textA === textB
    };
  }
}
```

## Extension Guide

### Adding New Comparison Algorithm

1. **Create Strategy File**:
```typescript
// src/tools/text-compare/strategies/your-strategy.ts
export class YourComparisonStrategy implements ComparisonStrategy {
  name = "Your Algorithm";
  description = "Algorithm description";
  
  compare(textA: string, textB: string): ComparisonResult {
    // Your implementation
  }
}
```

2. **Register Strategy**:
```typescript
// src/tools/text-compare/components/index.tsx
const strategies = [
  // existing strategies...
  new YourComparisonStrategy(),
];
```

3. **Add Icon** (optional):
```typescript
// src/tools/text-compare/components/comparison-controls.tsx
const strategyIcons: Record<string, string> = {
  // existing icons...
  "Your Algorithm": "🆕",
};
```

### Customizing UI Components

All components use design system tokens and can be styled by modifying:
- Color schemes via CSS custom properties
- Layout adjustments in component files
- Adding new UI elements following existing patterns

## Integration Info

### Tool Registry
The tool auto-registers with the plugin system:

```typescript
const TextComparePlugin: ToolPlugin = {
  id: "text-compare",
  metadata: {
    name: "Text Compare",
    category: "text",
    description: "Compare texts with multiple algorithms",
    version: "1.0.0",
    icon: "⚖️",
  },
  component: TextCompare,
};

toolRegistry.register(TextComparePlugin);
```

### State Management
Uses the shared `useToolState` hook for persistence:

```typescript
const [toolState, setToolState] = useToolState<TextCompareState>(instanceId, {
  textA: "",
  textB: "",
  result: null,
  selectedStrategyName: strategies[0].name,
});
```

### Dependencies
- React functional components with hooks
- shadcn/ui components for consistent UI
- Design system tokens for theming
- LCS algorithm for line-based diffing