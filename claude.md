# Developer Tools PWA - Claude AI Context

## Project Overview
A PWA containing multiple developer utilities: JSON formatter, JSON compare, text compare, SQL formatter, and more.

## Quick Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build
- `pnpm test` - Run test suite
- `pnpm lint` - Run biome linting
- `pnpm format` - Run biome formatting
- `pnpm type-check` - TypeScript checking
- `pnpm verify` - Full verification suite

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
- **Tools**: `src/tools/` - each tool is self-contained module
- **Shared**: `src/shared/` - common components, hooks, utils
- **Types**: `src/shared/types/` - global TypeScript definitions
- **Tests**: `tests/` - organized by feature

## Technology Stack
- **Package Manager**: pnpm (fast, efficient)
- **Frontend**: React 19 + TypeScript + Vite 6
- **UI Components**: shadcn/ui (customizable base components)
- **Linting/Formatting**: Biome (fast, unified toolchain)
- **Git Hooks**: Husky (pre-push validation)
- **State**: Zustand, **Styling**: Tailwind CSS 4
- **PWA**: Workbox 7, **Testing**: Vitest

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
# Usage: /create-tool json-minifier json command,strategy
# Creates: Complete tool structure with patterns
# Use: Starting new tool development
```

#### /add-strategy <tool> <strategy>
Add strategy pattern to existing tool
```bash
# Usage: /add-strategy json-formatter pretty-print
# Creates: Strategy implementation + UI integration
# Use: Adding algorithm variations to tools
```

#### /add-command <tool> <command>
Add command pattern to tool
```bash
# Usage: /add-command json-formatter format-compact
# Creates: Command class with undo/redo
# Use: Adding user actions to tools
```

#### /wire-tools <tool1> <tool2>
Connect tools via event communication
```bash
# Usage: /wire-tools json-formatter text-compare
# Creates: Event handlers for tool integration
# Use: Creating tool workflows
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
# Usage: /verify-pattern json-formatter command
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
- **Active Tools**: JSON Formatter (with state persistence)
- **In Development**: [none]
- **Architecture Features**: ✅ Instance state persistence, ✅ Multi-instance support
- **Known Issues**: [none]
- **Last Modified**: State persistence implementation complete

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
/add-strategy <tool> <strategy>  OR  /add-command <tool> <command>
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
/add-strategy <tool> <strategy>            # Add features
/debug-tool <tool> <issue>                 # Fix issues
/document-tool <name>                      # Generate docs
/quick-verify                              # Quality check
```

## Key Files for Context
- `README.md` - Project overview & Claude Code AI integration guide
- `src/core/registry/tool-registry.ts` - Plugin system core + state management
- `src/core/commands/command-manager.ts` - Command pattern hub
- `src/core/events/event-bus.ts` - Observer pattern implementation
- `src/shared/types/tool.ts` - Tool interface definitions + state types
- `src/shared/hooks/use-tool-state.ts` - Instance state persistence hook
- `src/app/store/tools-store.ts` - Tool registration + state coordination
- `src/tools/json-formatter/` - Reference implementation with state persistence
- `docs/development-plan.md` - Complete development roadmap
- `docs/design-patterns.md` - Architecture patterns overview
- `docs/instance-state-management.md` - State re-serving implementation guide
- `docs/coding-conventions.md` - Code style and conventions