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
- **text-compare**: Line-by-line text comparison
  - Features: Diff visualization, merge conflicts, multiple algorithms
  - Location: `src/tools/text-compare/`
  - Route: `/tools/text-compare`

### SQL Tools
- **sql-formatter**: Format SQL queries with syntax highlighting
  - Features: Multi-dialect support, validation, optimization hints
  - Location: `src/tools/sql-formatter/`
  - Route: `/tools/sql-formatter`

## Tool Categories
- `json` - JSON processing tools
- `text` - Text manipulation tools
- `sql` - SQL and database tools
- `utility` - General utilities

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