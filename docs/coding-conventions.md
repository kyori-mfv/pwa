# Code Patterns & Conventions

## File Naming (MANDATORY)

- **All files and folders**: kebab-case only
- **React components**: kebab-case filename, PascalCase export
- **Hooks**: `use-` prefix (use-json-formatter.ts)
- **Utils**: descriptive kebab-case (json-utils.ts)
- **Types**: kebab-case files, PascalCase interfaces

## Component Pattern (with shadcn/ui)

```typescript
// File: json-formatter.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useJsonFormatter } from "./use-json-formatter";

export const JsonFormatter = () => {
  const { data, format, validate, setData } = useJsonFormatter();

  return (
    <Card className="json-formatter p-6">
      <Textarea 
        value={data} 
        onChange={(e) => setData(e.target.value)}
        placeholder="Enter JSON here..."
      />
      <Button onClick={format} className="mt-4">
        Format JSON
      </Button>
    </Card>
  );
};
```

## Hook Pattern

```typescript
// File: use-json-formatter.ts
export const useJsonFormatter = () => {
  const [data, setData] = useState("");

  const format = useCallback(() => {
    // Business logic here
  }, [data]);

  return { data, setData, format };
};
```

## Tool Registration Pattern

```typescript
// File: index.ts (in each tool folder)
import { JsonFormatter } from "./json-formatter";

export const jsonFormatterTool: ToolModule = {
  id: "json-formatter",
  name: "JSON Formatter",
  category: "json",
  description: "Format and validate JSON data",
  component: JsonFormatter,
  icon: "code",
};

export { JsonFormatter };
```

## Folder Structure Pattern

```
src/tools/tool-name/
├── index.ts                # Registration & exports
├── tool-name.tsx           # Main component
├── use-tool-name.ts        # Business logic
├── components/             # UI components
│   ├── tool-input.tsx
│   └── tool-output.tsx
├── utils/                  # Tool utilities
│   └── tool-utils.ts
├── types/                  # Type definitions
│   └── index.ts
└── tests/                  # Component tests
    └── tool-name.test.tsx
```

## State Management

- **Global state**: Zustand stores in `src/app/store/`
- **Local state**: React hooks within components
- **Tool state**: Custom hooks (use-tool-name.ts)

## Testing Pattern

```typescript
// File: json-formatter.test.tsx
import { render, screen } from "@testing-library/react";
import { JsonFormatter } from "../json-formatter";

describe("JsonFormatter", () => {
  test("renders without crashing", () => {
    render(<JsonFormatter />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
```

## Import/Export Conventions

```typescript
// Named exports (preferred)
export const JsonFormatter = () => { ... }
export const useJsonFormatter = () => { ... }

// Avoid default exports except for tool registration
export default jsonFormatterTool // Only in index.ts
```

## UI Component Patterns

### shadcn/ui Usage
- **Base components**: Import from `@/components/ui/`
- **Customization**: Use `cn()` utility for conditional classes
- **Variants**: Use built-in variant props when available

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

<Button 
  variant="outline" 
  size="sm"
  className={cn("custom-class", isActive && "bg-primary")}
>
  Action
</Button>
```

### CSS/Styling Patterns
- **Primary**: shadcn/ui components with Tailwind
- **Custom styling**: Tailwind utilities + CSS variables
- **Responsive design**: Mobile-first approach
- **Dark mode**: Built-in with shadcn theming

## Error Handling

```typescript
try {
  const result = processData(input);
  return result;
} catch (error) {
  console.error(`Error in ${toolName}:`, error);
  // Handle error appropriately
}
```

## Code Quality with Biome

### Formatting Rules
- **Automatic**: Run `pnpm format` before commits
- **Consistent**: Biome handles all formatting
- **Fast**: No configuration needed

### Linting Rules  
- **Modern**: ES2024+ standards
- **Strict**: TypeScript strict mode
- **Performance**: Fast linting with Biome

```bash
# Check code quality
pnpm lint    # Check for issues
pnpm format  # Auto-fix formatting
```

## React 19 Features Usage

- Use `use()` hook for async data fetching
- Leverage automatic batching
- Utilize concurrent features when beneficial

## Package Management

- **Use pnpm**: `pnpm add package-name`
- **Workspaces**: Efficient dependency management
- **Lock file**: Always commit `pnpm-lock.yaml`
