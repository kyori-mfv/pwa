# Tools Registry

## Available Tools

### JSON Tools
- **json-formatter**: ✅ Format, validate, and minify JSON data
  - **Status**: Ready - Fully implemented and tested
  - **Features**: 4 formatting strategies (Pretty, Compact, Minified, Tabs), real-time validation, undo/redo support
  - **Architecture**: Strategy Pattern + Command Pattern implementation
  - **Location**: `src/tools/json-formatter/`
  - **Documentation**: [README](../src/tools/json-formatter/README.md) | [API](./tools/json-formatter-api.md) | [Examples](./examples/json-formatter-examples.md) | [Architecture](./architecture/json-formatter-patterns.md)
  - **Version**: 1.0.0

- **json-compare**: Compare two JSON objects with diff visualization
  - Features: Side-by-side diff, highlight changes, export results
  - Location: `src/tools/json-compare/`
  - Route: `/tools/json-compare`

### Text Tools
- **text-compare**: ✅ Compare two texts with multiple algorithms
  - **Status**: Ready - Fully implemented and tested
  - **Features**: 4 comparison strategies (line-by-line, character-level, word-level, side-by-side), real-time highlighting, statistics display, state persistence
  - **Architecture**: Strategy Pattern + Plugin Architecture + State Management
  - **Location**: `src/tools/text-compare/`
  - **Documentation**: [README](../src/tools/text-compare/README.md)
  - **Version**: 1.0.0

### SQL Tools
- **sql-formatter**: Format SQL queries with syntax highlighting
  - Features: Multi-dialect support, validation, optimization hints
  - Location: `src/tools/sql-formatter/`
  - Route: `/tools/sql-formatter`

### Utility Tools
- **jwt-decoder**: ✅ Decode and validate JSON Web Tokens (JWT)
  - **Status**: Ready - Fully implemented and tested
  - **Features**: JWT decoding, claims validation, expiration checking, copy functionality, state persistence
  - **Architecture**: Plugin Architecture + Composite Pattern + State Management
  - **Location**: `src/tools/jwt-decoder/`
  - **Documentation**: [README](../src/tools/jwt-decoder/README.md)
  - **Version**: 1.0.0

### Finance Tools
- **expense-manager**: ✅ Vietnamese AI-powered expense tracking
  - **Status**: Ready - Fully implemented and tested
  - **Features**: Gemini AI integration, Vietnamese localization, offline-first database, editable AI preview, smart categorization, mobile-first design
  - **Architecture**: Strategy Pattern (AI Providers) + Repository Pattern (Database) + Hook Pattern (State Management)
  - **Location**: `src/tools/expense-manager/`
  - **Documentation**: [README](../src/tools/expense-manager/README.md)
  - **Version**: 1.0.0

## Tool Categories
- `json` - JSON processing tools
- `text` - Text manipulation tools
- `sql` - SQL and database tools
- `utility` - General utilities
- `finance` - Financial and expense tracking tools

## Tool Registration
Tools are registered in `src/app/store/tools-store.ts`:

```typescript
export const tools: ToolModule[] = [
  jsonFormatterTool,
  jsonCompareTool,
  textCompareTool,
  sqlFormatterTool
]
```

## Adding New Tools
1. Create tool directory: `src/tools/{tool-name}/`
2. Implement `ToolModule` interface
3. Register in tools store
4. Add route configuration
5. Update this registry

## Tool Template
Use `src/tools/_template/` as starting point for new tools.

## Tool Status
- ✅ **Ready**: Fully implemented and tested
- 🚧 **In Progress**: Under development
- 📋 **Planned**: Scheduled for development
- ❌ **Deprecated**: No longer maintained

## Current Development Focus
- **Database Tools Ecosystem**: Focus on IndexedDB tooling with CRUD operations and advanced querying
- **Next Priority**: IndexedDB Query Builder to complement existing CRUD tool
- **Architecture**: Leveraging shared Dexie.js infrastructure for consistency