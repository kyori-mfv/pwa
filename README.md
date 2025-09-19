# Developer Tools PWA

A modern Progressive Web Application providing essential developer utilities with offline support, built using cutting-edge architecture patterns and optimized for AI-assisted development.

## 🚀 Overview

This project is a comprehensive developer tools platform featuring:

- **JSON Tools**: Formatter, validator, comparer with multiple algorithms
- **Text Tools**: Advanced diff comparison with merge capabilities  
- **SQL Tools**: Multi-dialect formatter with optimization hints
- **Extensible Architecture**: Plugin-based system for easy tool addition
- **Offline-First**: Full PWA capabilities with service worker caching
- **Modern Stack**: React 19, TypeScript, Vite 6, shadcn/ui, Tailwind CSS

## ✨ Key Features

### 🛠️ Developer Tools
- **JSON Formatter**: ✅ Pretty-print, minify, validate with 4 formatting strategies and undo/redo
- **Text Compare**: ✅ Advanced diff comparison with multiple algorithms and merge capabilities
- **IndexedDB CRUD**: ✅ Browser database management with visual interface
- **Expense Manager**: ✅ AI-powered expense tracking with natural language input
- **JWT Decoder**: ✅ JSON Web Token decoder and validator with comprehensive analysis
- **Multi-Instance Support**: ✅ Work on multiple tasks simultaneously with independent state
- **State Persistence**: ✅ Never lose work when switching between tools - state automatically re-served
- **Theme Support**: ✅ System/dark/light theme switching
- **Dual Mode Architecture**: ✅ Full PWA or individual app deployments with bundle optimization
- **Extensible**: ✅ Plugin-based architecture with Strategy and Command patterns

### 🏗️ Architecture Highlights
- **Dual Mode Architecture**: Full PWA or individual app deployments
- **Plugin System**: Each tool is a self-contained, hot-swappable plugin
- **Command Pattern**: Full undo/redo support across all operations
- **Strategy Pattern**: Multiple algorithms per tool with runtime switching
- **Observer Pattern**: Inter-tool communication and workflow automation
- **Composite Pattern**: Flexible, reusable UI components
- **State Management**: ✅ Instance state persistence with automatic re-serving
- **Bundle Optimization**: Individual builds include only necessary code
- **Unified Header System**: Flexible header management across deployment modes

### 💻 Developer Experience
- **AI-Optimized**: Built for efficient development with Claude Code AI
- **Pattern-Driven**: Consistent, maintainable code using proven design patterns
- **Type-Safe**: Full TypeScript coverage with strict mode
- **Fast Development**: Hot reload, instant feedback, comprehensive tooling

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript 5.6 + Vite 6
- **UI Framework**: shadcn/ui + Tailwind CSS 4
- **State Management**: Zustand (lightweight, performant)
- **Code Quality**: Biome (unified linting & formatting)
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm (fast, efficient)
- **Git Hooks**: Husky (automated quality checks)
- **PWA**: Workbox 7 (offline support, caching)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd pwa

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

#### Multi-App Mode (Default)
```bash
pnpm dev          # Start development server with all tools
pnpm build        # Production build with all tools
pnpm preview      # Preview production build
```

#### Individual App Mode
```bash
# Development
pnpm dev:json-formatter      # Start JSON Formatter only
pnpm dev:text-compare        # Start Text Compare only
pnpm dev:indexeddb-crud      # Start IndexedDB CRUD only
pnpm dev:expense-manager     # Start Expense Manager only
pnpm dev:jwt-decoder         # Start JWT Decoder only

# Production Build
pnpm build:json-formatter    # Build JSON Formatter only
pnpm build:text-compare      # Build Text Compare only
pnpm build:indexeddb-crud    # Build IndexedDB CRUD only
pnpm build:expense-manager   # Build Expense Manager only
pnpm build:jwt-decoder       # Build JWT Decoder only

# Preview Individual Builds
pnpm preview:json-formatter  # Preview JSON Formatter build
pnpm preview:text-compare    # Preview Text Compare build
pnpm preview:indexeddb-crud  # Preview IndexedDB CRUD build
pnpm preview:expense-manager # Preview Expense Manager build
pnpm preview:jwt-decoder     # Preview JWT Decoder build
```

#### Quality & Testing
```bash
pnpm test         # Run test suite
pnpm lint         # Run biome linting
pnpm format       # Format code with biome
pnpm type-check   # TypeScript checking
pnpm verify       # Full verification (lint + test + build)
```

## 🤖 Claude Code AI Integration

This project is optimized for development with **Claude Code AI**, providing unprecedented development efficiency through AI-assisted coding.

### Getting Started with Claude Code AI

1. **Open Claude Code**: Use Claude Code AI in your development environment
2. **Load Project Context**: Claude automatically reads `claude.md` for full project understanding
3. **Use AI Commands**: Leverage 15 essential commands for rapid development

### Essential Claude Commands

#### 🚀 Context & Status (Start Here)
```bash
# Check current project state
/status-check

# Load focused context for your task
/context-quick new-tool        # For creating tools
/context-quick debug          # For fixing issues
/context-quick add-feature    # For adding functionality

# Load complete context (major changes)
/context-full
```

#### ⚡ Core Development Commands
```bash
# Create new tool with patterns
/create-tool json-minifier json command,strategy

# Add functionality to tools
/wire-tools json-formatter text-compare

# Debug existing tools
/debug-tool json-formatter performance
```

#### 🔧 Quality Assurance
```bash
# Smart verification of current work
/quick-verify

# Pattern compliance check
/verify-pattern json-formatter command

# Full architecture health check  
/verify-architecture
```

### Streamlined Development Workflow

#### 1. **Start With Context** (30 seconds)
```bash
/status-check                    # What's the current state?
/context-quick <type>            # Load relevant context
```

#### 2. **Execute Development** (Minutes vs Hours)
```bash
# Create new functionality
/create-tool <name> <category>   # New tools
/debug-tool <tool> <issue>       # Fix problems
```

#### 3. **Verify Quality** (30 seconds)
```bash
/quick-verify                    # Smart quality checks
/verify-architecture             # If major changes
```

#### 4. **Essential Commands (80/20 Rule)**
```bash
# These 7 commands handle 80% of development work:
/status-check, /context-quick, /read-tool, /create-tool
/debug-tool, /document-tool, /quick-verify
```

### Tool Documentation & Maintenance Commands

#### 📖 Understanding & Documentation
```bash
# Read and understand existing tools
/read-tool json-formatter

# Generate comprehensive tool documentation  
/document-tool json-formatter

# Analyze entire tool ecosystem
/analyze-tools
```

### Benefits of Claude Code AI Integration

- **10x Development Speed**: Tools created in hours instead of days
- **Consistent Quality**: Pattern-enforced architecture and code standards  
- **Zero Context Loss**: AI maintains full project understanding
- **Automated Documentation**: Docs stay synchronized with code changes
- **Best Practices Enforced**: Built-in verification and compliance checking

## 📁 Project Structure

```
pwa/
├── claude.md                   # AI context & command reference
├── docs/                       # Comprehensive documentation
│   ├── development-plan.md     # 8-week development roadmap
│   ├── design-patterns.md      # Architecture patterns guide
│   ├── coding-conventions.md   # Code style & conventions  
│   ├── tools.md               # Tool registry & status
│   └── verification.md        # Quality assurance guide
├── src/
│   ├── index.tsx              # Root with dual-mode bootstrap
│   ├── core/                  # Architecture patterns implementation
│   │   ├── registry/          # Plugin system
│   │   ├── commands/          # Command pattern
│   │   ├── events/            # Observer pattern
│   │   └── patterns/          # Pattern utilities
│   ├── shared/                # Reusable components & services
│   │   ├── components/        # UI components (shadcn-based)
│   │   │   └── layout/        # Layout components for both modes
│   │   │       ├── app-layout.tsx          # Multi-app layout
│   │   │       ├── individual-app-layout.tsx  # Individual app layout
│   │   │       └── app-body.tsx            # Multi-app content area
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # Business services
│   │   └── types/             # TypeScript definitions (body/header interface)
│   ├── tools/                 # Developer tools (plugins)
│   │   ├── json-formatter/    # JSON formatting tool
│   │   ├── text-compare/      # Text comparison tool
│   │   ├── indexeddb-crud/    # IndexedDB management tool
│   │   ├── expense-manager/   # AI expense tracking tool
│   │   ├── jwt-decoder/       # JWT decoder & validator
│   │   └── _template/         # Tool template
│   └── app/                   # Application shells
│       ├── multi.tsx          # Multi-app mode bootstrap
│       ├── individual.tsx     # Individual app mode bootstrap
│       └── store/             # Global state (Zustand)
└── tests/                     # Test suites organized by feature
```

## 🏗️ Architecture

### Design Patterns Used
- **Plugin Architecture**: Modular, extensible tool system
- **Command Pattern**: Undo/redo support for all operations
- **Strategy Pattern**: Multiple algorithms per tool
- **Observer Pattern**: Tool communication and workflows  
- **Composite Pattern**: Flexible UI component composition
- **State Management Pattern**: Instance state persistence with automatic re-serving

### Key Principles
- **Separation of Concerns**: Clear boundaries between layers
- **Dependency Injection**: Testable, flexible service architecture
- **Event-Driven**: Loose coupling between tools
- **Pattern-Driven Development**: Consistent, maintainable code

## 🧪 Development with Claude Code AI

### Tool Development Lifecycle

1. **Planning**: Use `/next-task` to get priority work
2. **Context Loading**: Use `/context-quick <type>` for focused context
3. **Implementation**: Use pattern-based commands (`/create-tool`)
4. **Verification**: Use `/quick-verify` for quality assurance
5. **Documentation**: Auto-generated via `/end-session`

### Quality Assurance
- **Automated Testing**: Pattern-specific test generation
- **Code Quality**: Biome linting + formatting + Husky hooks
- **Architecture Compliance**: Pattern verification commands
- **Documentation Sync**: Automatic documentation updates

### Performance Optimization
- **Code Splitting**: Lazy-loaded tools and components
- **Bundle Analysis**: Built-in performance monitoring
- **Caching Strategy**: Service worker optimization
- **Tree Shaking**: Minimal bundle size

## 📈 Development Roadmap

### Phase 1: Foundation (Week 1-2)
- ✅ Project setup with modern toolchain
- ✅ Core architecture patterns implementation
- ✅ shadcn/ui component library integration
- ✅ Claude Code AI optimization

### Phase 2: Core Tools (Week 3-6)
- ✅ JSON tools (formatter, validator with strategies)
- ✅ Text tools (compare with multiple algorithms)
- ✅ Database tools (IndexedDB CRUD interface)
- ✅ Finance tools (AI-powered expense manager)
- ✅ Security tools (JWT decoder and validator)

### Phase 3: Advanced Features (Week 7-8)
- ✅ Dual-mode architecture (multi-app and individual app deployments)
- ✅ Bundle optimization for individual apps
- ✅ Unified header system across deployment modes
- 📋 Advanced PWA features and service worker optimization
- 📋 Accessibility improvements
- 📋 Production deployment strategies

*Legend: ✅ Complete, 🚧 In Progress, 📋 Planned*

## 🤝 Contributing

### Development Setup
```bash
# Install dependencies
pnpm install

# Install git hooks
pnpm exec husky init

# Start development with Claude Code AI
# Open Claude Code and use: /start-session "contributing setup"
```

### Creating New Tools
```bash
# Using Claude Code AI (recommended)
/quick-start-tool <tool-name>

# Manual process (see docs/development-plan.md)
```

### Code Quality Standards
- **TypeScript**: Strict mode, full coverage
- **Testing**: 90%+ coverage requirement
- **Linting**: Zero errors, minimal warnings
- **Patterns**: Must follow established architecture patterns

## 📝 License

[MIT License](LICENSE) - Feel free to use this project for your own developer tools.

## 🙋‍♂️ Support

- **Documentation**: See `docs/` directory for comprehensive guides
- **Claude Code AI**: Use `/status-check` and `/next-task` for guidance  
- **Issues**: Report bugs and feature requests via GitHub issues

---

**Built with ❤️ using Claude Code AI and modern web technologies**