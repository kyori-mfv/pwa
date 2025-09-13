# System Architecture

## Overview

Modular PWA with plugin-based tool system. Each tool is self-contained with shared infrastructure.

## Technology Stack

- **Package Manager**: pnpm (fast, efficient disk usage)
- **Frontend**: React 19 + TypeScript + Vite 6
- **UI Components**: shadcn/ui (customizable, accessible)
- **State**: Zustand (lightweight store)
- **Styling**: Tailwind CSS 4
- **PWA**: Workbox 7 for service workers
- **Testing**: Vitest + React Testing Library
- **Code Quality**: Biome (unified linting & formatting)
- **Git Hooks**: Husky (pre-push validation)

## Core Architecture

### Tool Module System

```
src/tools/{tool-name}/
├── index.ts                 # Tool registration & exports
├── {tool-name}.tsx         # Main React component
├── use-{tool-name}.ts      # Business logic hook
├── components/             # UI components
├── utils/                  # Tool utilities
├── types/                  # TypeScript definitions
└── tests/                  # Tool tests
```

### Shared Infrastructure

```
src/shared/
├── components/            # Reusable UI components
│   ├── layout/            # App shell, navigation
│   ├── ui/                # Buttons, inputs, modals
│   └── editor/            # Code editor components
├── hooks/                 # Common React hooks
├── utils/                 # Utility functions
└── types/                 # Global type definitions
```

## Data Flow

1. **Tool Registry** → Route Configuration
2. **Route** → Tool Component → Tool Hook
3. **Tool Hook** → Shared Utils → UI Updates
4. **State Management** via Zustand stores

## Tool Interface

All tools implement `ToolModule`:

```typescript
interface ToolModule {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType;
  icon: string;
  shortcuts?: string[];
}
```

## PWA Features

- **Offline Support**: Service worker caching
- **Installable**: Web app manifest
- **Responsive**: Mobile-first design
- **Fast**: Code splitting & lazy loading

## File Organization Principles

- **kebab-case**: All files and folders
- **Co-location**: Related files grouped together
- **Clear hierarchy**: Shallow folder structure
- **Predictable paths**: Consistent naming patterns

## Component Architecture
- **Base Components**: shadcn/ui for consistent design system
- **Custom Components**: Extended/customized from shadcn base
- **Tool Components**: Tool-specific UI built with shadcn primitives
- **Accessibility**: Built-in with shadcn components
