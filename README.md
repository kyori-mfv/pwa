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
- **Multi-Instance Support**: ✅ Work on multiple tasks simultaneously with independent state
- **State Persistence**: ✅ Never lose work when switching between tools - state automatically re-served
- **JSON Compare**: 🔄 Visual diff with highlighting and merge options (planned)
- **Text Compare**: 🔄 Line/character/word-level comparison algorithms (planned)
- **SQL Formatter**: 🔄 Support for MySQL, PostgreSQL, SQLite dialects (planned)
- **Extensible**: ✅ Plugin-based architecture with Strategy and Command patterns

### 🏗️ Architecture Highlights
- **Plugin System**: Each tool is a self-contained, hot-swappable plugin
- **Command Pattern**: Full undo/redo support across all operations
- **Strategy Pattern**: Multiple algorithms per tool with runtime switching
- **Observer Pattern**: Inter-tool communication and workflow automation
- **Composite Pattern**: Flexible, reusable UI components
- **State Management**: ✅ Instance state persistence with automatic re-serving

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
```bash
pnpm dev          # Start development server
pnpm build        # Production build
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
/add-strategy json-formatter pretty-print
/add-command json-formatter validate
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
/add-strategy <tool> <strategy>  # Add features
/debug-tool <tool> <issue>       # Fix problems
```

#### 3. **Verify Quality** (30 seconds)
```bash
/quick-verify                    # Smart quality checks
/verify-architecture             # If major changes
```

#### 4. **Essential Commands (80/20 Rule)**
```bash
# These 8 commands handle 80% of development work:
/status-check, /context-quick, /read-tool, /create-tool
/add-strategy, /debug-tool, /document-tool, /quick-verify
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
│   ├── core/                  # Architecture patterns implementation
│   │   ├── registry/          # Plugin system
│   │   ├── commands/          # Command pattern
│   │   ├── events/            # Observer pattern
│   │   └── patterns/          # Pattern utilities
│   ├── shared/                # Reusable components & services
│   │   ├── components/        # UI components (shadcn-based)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # Business services
│   │   └── types/             # TypeScript definitions
│   ├── tools/                 # Developer tools (plugins)
│   │   ├── json-formatter/    # JSON formatting tool
│   │   ├── json-compare/      # JSON comparison tool
│   │   ├── text-compare/      # Text diff tool
│   │   ├── sql-formatter/     # SQL formatting tool
│   │   └── _template/         # Tool template
│   └── app/                   # Application shell
│       ├── store/             # Global state (Zustand)
│       └── router/            # Routing configuration
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
3. **Implementation**: Use pattern-based commands (`/create-tool`, `/add-strategy`)
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
- 🚧 JSON tools (formatter, compare, validate)
- 📋 Text tools (compare, utilities, transform)
- 📋 SQL tools (formatter, validator, optimizer)
- 📋 Tool integration and workflows

### Phase 3: Advanced Features (Week 7-8)
- 📋 Performance optimization
- 📋 Advanced PWA features
- 📋 Accessibility improvements
- 📋 Production deployment

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