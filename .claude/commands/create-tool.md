---
description: Create new tool with architectural patterns
argument-hint: [name] [category] [patterns]
---

Create a new tool: **$1** in category **$2** with patterns **$3**

**Tool Creation Process:**
1. Create directory structure: `src/tools/$1/`
2. Generate tool template with specified patterns
3. Implement required architectural patterns
4. Set up plugin registration
5. Create basic UI components
6. Add TypeScript definitions

**Patterns Available:**
- `command` - Command pattern with undo/redo
- `strategy` - Multiple algorithm strategies
- `observer` - Event-based communication
- `state` - State machine pattern

**Categories:**
- `json` - JSON processing tools
- `text` - Text manipulation tools
- `sql` - SQL formatting/analysis tools
- `utility` - General utility tools

**Example:** `/create-tool json-formatter json command,strategy`

Please create a complete tool structure with the specified patterns, following the project's architectural conventions and coding standards.