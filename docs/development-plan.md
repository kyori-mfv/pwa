# Development Plan

## Project Overview

Build a PWA with multiple developer tools using modern architecture patterns and toolchain.

## Phase 1: Project Setup ✅

### Essential Dependencies

- React 19 + TypeScript + Vite 6
- shadcn/ui components + Tailwind CSS 4
- Zustand (state management)
- Dexie.js (IndexedDB wrapper)
- Biome (linting/formatting) + Husky (git hooks)
- Vitest (testing)

## Phase 2: Core Architecture ✅

### Project Structure Creation

```bash
mkdir -p src/{core,shared,tools,app}
mkdir -p src/core/registry
mkdir -p src/shared/{components,hooks,utils,types}
mkdir -p src/shared/components/{ui,layout}
mkdir -p src/app/{store,router}
mkdir -p src/tools/_template
mkdir -p tests/{core,shared,tools}
```

### Key Components

- **Tool Registry**: Simple plugin registration system
- **Tool State Hook**: `useToolState` for instance persistence
- **Shared UI**: shadcn/ui components for consistent design
- **Theme System**: Light/dark/system theme switching

## Phase 3: Tool Template & Implementation ✅

### 3.1 Tool Structure

```bash
# src/tools/{tool-name}/
├── index.ts                # Plugin registration & auto-registration
├── components/
│   ├── index.tsx           # Main component export
│   ├── {tool-name}.tsx     # Primary tool implementation
│   └── {feature}.tsx       # Feature-specific components
├── hooks/
│   ├── index.ts            # Hook exports
│   └── use-{tool-name}.ts  # Business logic and operations
├── utils/
│   ├── index.ts            # Utility exports
│   └── {tool-name}.ts      # Core utility functions
├── types/
│   └── index.ts            # TypeScript interfaces and types
└── README.md               # Tool documentation
```

### 3.2 Tool Plugin Pattern

```typescript
// src/tools/{tool-name}/index.ts
const ToolPlugin: ToolPlugin = {
  id: "tool-name",
  metadata: {
    id: "tool-name",
    name: "Tool Display Name",
    category: "database" | "json" | "text" | "utility",
    description: "Tool description",
    version: "1.0.0",
    icon: "🔧",
  },
  component: ToolComponent,
};

// Auto-register the plugin
toolRegistry.register(ToolPlugin);
```

### 3.3 Main Component Pattern

```typescript
// src/tools/{tool-name}/components/index.tsx
interface ToolState extends Record<string, unknown> {
  // Tool-specific state properties
}

export const ToolComponent: React.FC<ToolComponentProps> = ({ instanceId }) => {
  const [toolState, setToolState] = useToolState<ToolState>(instanceId, {
    // Default state
  });

  // Tool logic and handlers

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Header />
      {/* Tool UI components */}
    </div>
  );
};
```

## Phase 4: Database Tools Development

### 4.1 Database Tools (Current Priority)

```bash
# IndexedDB CRUD Tool (Completed - Learning-focused)
✅ Completed - IndexedDB CRUD tool with Dexie.js integration
# Features: database management, object store creation, CRUD operations
# Architecture: Hybrid Dexie.js + native IndexedDB approach

# Week 4.1: IndexedDB Query Builder 🎯 (Next Priority)
/create-tool indexeddb-query-builder database
# Implement SQL-like query interface for IndexedDB data
# Visual query builder with drag-drop interface
# Advanced filtering, sorting, aggregation capabilities
# Leverages existing Dexie.js infrastructure from CRUD tool
# Features:
#   - Visual query builder with drag-drop interface
#   - Index-aware query optimization
#   - Export query results to JSON/CSV
```

## Phase 5: Development Scripts & Quality

## Development Scripts

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "biome check .",
    "lint:fix": "biome check . --apply",
    "format": "biome format . --write",
    "type-check": "tsc --noEmit",
    "verify": "pnpm lint && pnpm type-check && pnpm test && pnpm build",

    "tool:create": "node scripts/create-tool.js",
    "tool:list": "node scripts/list-tools.js",
    "claude:verify": "node scripts/claude-verification.js"
  }
}
```

### Helper Scripts

```bash
# scripts/create-tool.js - Tool scaffolding
# scripts/claude-verification.js - Pattern verification
# scripts/analyze-project.js - Architecture health check
```

## Quality Gates

### Before Each Commit

```bash
# Husky pre-push hook runs:
pnpm lint      # Biome linting
pnpm format    # Code formatting
pnpm type-check # TypeScript validation
pnpm test      # Unit tests
```

### Before Each Tool Release

```bash
/verify-pattern <tool> <patterns>  # Pattern compliance
/verify-architecture              # Overall health
```

## Risk Mitigation

### Technical Risks

- **Pattern Complexity**: Start simple, add complexity gradually
- **Performance**: Implement code splitting and lazy loading early
- **Testing**: Write tests alongside features, not after

### Timeline Risks

- **Scope Creep**: Stick to core tools first, advanced features later
- **Integration Issues**: Build integration from day 1, not at the end
- **Documentation**: Write docs as you code, use Claude commands

This plan creates a **solid foundation** for a scalable developer tools platform that can grow from basic functionality to a comprehensive suite while maintaining high code quality and development velocity.
