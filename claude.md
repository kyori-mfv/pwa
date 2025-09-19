# Developer Tools PWA - Claude AI Context

## Project Overview
A PWA containing multiple developer utilities: JSON formatter, JSON compare, text compare, SQL formatter, and more.

## Quick Commands

### Multi-App Mode (Default)
- `pnpm dev` - Start development server with all tools
- `pnpm build` - Production build with all tools
- `pnpm preview` - Preview production build

### Individual App Mode
- `pnpm dev:json-formatter` - Start JSON Formatter only
- `pnpm dev:text-compare` - Start Text Compare only
- `pnpm dev:indexeddb-crud` - Start IndexedDB CRUD only
- `pnpm dev:expense-manager` - Start Expense Manager only
- `pnpm dev:jwt-decoder` - Start JWT Decoder only

- `pnpm build:json-formatter` - Build JSON Formatter only
- `pnpm build:text-compare` - Build Text Compare only
- `pnpm build:indexeddb-crud` - Build IndexedDB CRUD only
- `pnpm build:expense-manager` - Build Expense Manager only
- `pnpm build:jwt-decoder` - Build JWT Decoder only

- `pnpm preview:json-formatter` - Preview JSON Formatter build
- `pnpm preview:text-compare` - Preview Text Compare build
- `pnpm preview:indexeddb-crud` - Preview IndexedDB CRUD build
- `pnpm preview:expense-manager` - Preview Expense Manager build
- `pnpm preview:jwt-decoder` - Preview JWT Decoder build

### Quality & Testing
- `pnpm test` - Run test suite
- `pnpm lint` - Run biome linting
- `pnpm format` - Run biome formatting
- `pnpm type-check` - TypeScript checking
- `pnpm verify` - Full verification suite

### Vercel Deployment
- `pnpm deploy:prod:expense-manager` - Deploy Expense Manager to production
- `pnpm deploy:preview:expense-manager` - Deploy Expense Manager for preview

## File Naming Convention (MANDATORY)
- **All files and folders**: kebab-case
- **React components**: kebab-case filename, PascalCase export
  ```typescript
  // File: json-formatter.tsx
  export const JsonFormatter = () => { ... }
  ```
- **Hooks**: use-hook-name.ts
- **Utils**: util-name.ts
- **Types**: kebab-case files, PascalCase interfaces

## Architecture

### Dual-Mode Architecture
The application supports two deployment modes through environment-based configuration:

1. **Multi-App Mode (Default)**: Full PWA with all tools in tabbed interface
2. **Individual App Mode**: Single-tool deployment for specific apps

### Directory Structure
- **Tools**: `src/tools/` - each tool is self-contained module
- **Shared**: `src/shared/` - common components, hooks, utils
- **Types**: `src/shared/types/` - global TypeScript definitions
- **Tests**: `tests/` - organized by feature
- **App Modes**:
  - `src/app/multi.tsx` - Multi-app layout and routing
  - `src/app/individual.tsx` - Individual app bootstrap
- **Layouts**:
  - `src/shared/components/layout/app-layout.tsx` - Multi-app layout
  - `src/shared/components/layout/individual-app-layout.tsx` - Individual app layout
  - `src/shared/components/layout/app-body.tsx` - Multi-app content area

## Technology Stack
- **Package Manager**: pnpm (fast, efficient)
- **Frontend**: React 19 + TypeScript + Vite 6
- **UI Components**: shadcn/ui (customizable base components)
- **Linting/Formatting**: Biome (fast, unified toolchain)
- **Git Hooks**: Husky (pre-push validation)
- **State**: Zustand, **Styling**: Tailwind CSS 4
- **PWA**: Workbox 7, **Testing**: Vitest

## Vercel Deployment Configuration

### Individual App Deployment
The project supports deploying individual tools to Vercel using the dual-mode architecture:

- **Configuration**: `vercel.json` - Vercel deployment configuration
- **Environment**: `VITE_BUILD_APP_ID=expense-manager` - Specifies which app to build
- **Build Command**: `pnpm build:expense-manager` - Individual app build
- **Output Directory**: `dist/` - Vite build output
- **Cache Configuration**: Static assets cached for 1 year, service worker no-cache
- **Security Headers**: Content security, frame options, XSS protection enabled
- **PWA Support**: Service worker allowed, cleanup enabled for outdated caches

### Deployment Files
- `.vercelignore` - Files excluded from deployment (docs, tests, development files)
- `vercel.json` - Vercel platform configuration with environment variables
- Updated `.gitignore` - Excludes `.vercel` directory from version control

## AI Commands

### Essential Context Commands

#### /context-full
Load complete project context for comprehensive understanding
```bash
# Usage: /context-full
# Reads: claude.md + development-plan.md + design-patterns.md + coding-conventions.md
# Use: When starting fresh or major architectural work
```

#### /context-quick <type>
Load focused context for specific work
```bash
# Usage: /context-quick new-tool
# Types: new-tool, debug, add-feature, architecture
# Use: Faster context loading for focused tasks
```

#### /status-check
Check current project status and priorities
```bash
# Usage: /status-check
# Shows: Current phase, active tools, next tasks, issues
# Use: Understanding current state and what to work on
```

#### /next-task
Get next priority task based on development phase
```bash
# Usage: /next-task
# Returns: Priority task + required context
# Use: When unsure what to work on next
```

### Core Development Commands

#### /create-tool <name> <category> [patterns]
Create new tool with architectural patterns
```bash
# Usage: /create-tool json-minifier json strategy
# Creates: Complete tool structure with patterns
# Use: Starting new tool development
```


### Quality Assurance Commands

#### /debug-tool <tool> [issue]
Debug tool with pattern analysis
```bash
# Usage: /debug-tool json-formatter performance
# Analyzes: Pattern usage, bottlenecks, issues
# Use: Troubleshooting existing tools
```

#### /verify-pattern <tool> <pattern>
Verify pattern implementation compliance
```bash
# Usage: /verify-pattern json-formatter strategy
# Checks: Pattern interfaces, implementations
# Use: Ensuring architectural consistency
```

#### /verify-architecture
Full architecture health check
```bash
# Usage: /verify-architecture
# Validates: All patterns, dependencies, structure
# Use: Overall project health verification
```

#### /quick-verify
Smart verification of current changes
```bash
# Usage: /quick-verify
# Runs: Relevant verification based on recent work
# Use: Before committing or task completion
```

### Documentation & Maintenance Commands

#### /read-tool <tool-name>
Read and analyze existing tool structure and context
```bash
# Usage: /read-tool json-formatter
# Reads: Tool files, patterns, dependencies, current state
# Returns: Complete tool analysis and context summary
# Use: Understanding existing tools before modification
```

#### /document-tool <tool-name>
Generate simple documentation for tool
```bash
# Usage: /document-tool json-formatter
# Creates: Only README.md in tool directory (no other files)
# Updates: docs/tools.md registry with current status
# Note: Single README.md file is sufficient - avoid creating multiple docs
# Use: Creating concise docs for tool understanding and usage
```

#### /analyze-tools
Analyze all tools and generate maintenance overview
```bash
# Usage: /analyze-tools
# Scans: All tools in src/tools/ directory
# Generates: Architecture overview, dependencies, integration points
# Use: Understanding overall tool ecosystem and relationships
```

## Current Status
- **Active Tools**: JSON Formatter, Text Compare, IndexedDB CRUD, Expense Manager, JWT Decoder
- **Architecture Features**: ✅ Dual-mode deployment, ✅ Individual app builds, ✅ Instance state persistence, ✅ Multi-instance support, ✅ Unified header system
- **Build Modes**: ✅ Multi-app mode, ✅ Individual app mode with bundle optimization
- **Known Issues**: [none]
- **Last Modified**: Tool type interface refactor (component → body, headerComponent → header)

## Efficient Development Workflows

### 🚀 Starting Any Development Work
```bash
# Essential 3-step startup:
1. /status-check                              # What's current state?
2. /context-quick <type>                      # Load relevant context
3. [Use appropriate development command]
```

### ⚡ Common Task Workflows
```bash
# Create new tool:
/context-quick new-tool
/create-tool <name> <category> <patterns>
/document-tool <name>
/quick-verify

# Modify existing tool:
/read-tool <tool-name>
/context-quick add-feature
[modify tool directly]
/document-tool <tool-name>
/quick-verify

# Debug existing tool:
/read-tool <tool-name>
/context-quick debug
/debug-tool <tool-name> <issue>
/quick-verify

# Project maintenance:
/analyze-tools
/verify-architecture
```

### 📋 Quality Workflow
```bash
# Before any commit or completion:
1. /quick-verify                              # Smart verification
2. /verify-architecture                       # If major changes
3. Commit with confidence
```

## Verification Rules (MANDATORY)
After completing ANY task, Claude MUST:
1. Run appropriate `/verify-*` command first
2. Execute `pnpm verify` for build/test/lint
3. Use `/verify-pattern` for pattern compliance
4. Run `/verify-architecture` for major changes
5. Test functionality with `/debug-tool` if issues
6. Generate docs with `/document-*` commands
7. Ensure all Husky pre-push hooks pass

## 🤖 Claude AI Usage Guide

### Context Loading (ESSENTIAL)
```bash
# ALWAYS start with one of these:
/status-check                              # Current project state
/context-quick <type>                      # Focused context
/context-full                              # Complete understanding

# Choose based on task complexity
```

### Command Flow for Any Task
```bash
1. /status-check                           # Understand current state
2. /context-quick <type>                   # Load relevant context  
3. [Execute development command]           # Do the work
4. /quick-verify                          # Verify quality
```

### Most Used Commands (80/20 Rule)
```bash
# These 8 commands handle 80% of development work:
/status-check                              # Project status
/context-quick <type>                      # Load context
/read-tool <name>                          # Understand existing tool
/create-tool <name> <category>             # New tools
/debug-tool <tool> <issue>                 # Fix issues
/document-tool <name>                      # Generate docs
/quick-verify                              # Quality check
```

## Key Files for Context
- `README.md` - Project overview & Claude Code AI integration guide
- `vite.config.ts` - Dual-mode build configuration with environment detection
- `vercel.json` - Vercel deployment configuration for individual apps
- `.vercelignore` - Files excluded from Vercel deployment
- `src/index.tsx` - Root-level mode detection and dynamic app loading
- `src/core/registry/tool-registry.ts` - Plugin system core + state management
- `src/shared/types/tool.ts` - Tool interface definitions (body/header properties)
- `src/shared/hooks/use-tool-state.ts` - Instance state persistence hook
- `src/app/store/tools-store.ts` - Tool registration + state coordination
- **Multi-App Mode**:
  - `src/app/multi.tsx` - Multi-app bootstrap
  - `src/shared/components/layout/app-layout.tsx` - Multi-app layout
  - `src/shared/components/layout/app-body.tsx` - Content area with header support
- **Individual App Mode**:
  - `src/app/individual.tsx` - Individual app bootstrap
  - `src/shared/components/layout/individual-app-layout.tsx` - Individual app layout
- `src/tools/*/` - Tool implementations with body/header components
- `docs/development-plan.md` - Complete development roadmap
- `docs/design-patterns.md` - Architecture patterns overview
- `docs/instance-state-management.md` - State re-serving implementation guide
- `docs/coding-conventions.md` - Code style and conventions