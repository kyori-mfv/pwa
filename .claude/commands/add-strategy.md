---
description: Add strategy pattern to existing tool
argument-hint: [tool] [strategy]
---

Add strategy pattern implementation: **$2** to tool: **$1**

**Strategy Creation Process:**
1. **Create Strategy File** - `src/tools/$1/strategies/$2-strategy.ts`
2. **Implement Strategy Interface** - Follow tool's strategy pattern
3. **Register Strategy** - Add to tool's strategy registry
4. **UI Integration** - Add strategy selection to tool UI
5. **Update Types** - Add strategy to TypeScript definitions
6. **Add Tests** - Create strategy-specific tests

**Strategy Template:**
```typescript
export interface ToolStrategy {
  name: string;
  description: string;
  execute(input: any): Promise<any>;
}

export class $2Strategy implements ToolStrategy {
  name = '$2';
  description = 'Strategy for $2 processing';
  
  async execute(input: any): Promise<any> {
    // Implementation here
  }
}
```

**Integration Steps:**
1. Add strategy to tool's strategy registry
2. Update UI dropdown/selection component
3. Implement strategy switching logic
4. Add strategy-specific configuration options
5. Update documentation

**Files to Modify:**
- `src/tools/$1/strategies/$2-strategy.ts` (new)
- `src/tools/$1/strategies/index.ts` (update registry)
- `src/tools/$1/components/strategy-selector.tsx` (update UI)
- `src/tools/$1/types/index.ts` (update types)

Please implement the new strategy following the tool's existing patterns and architectural conventions.