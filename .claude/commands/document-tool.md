---
description: Generate simple documentation for tool
argument-hint: [tool-name]
---

Generate simple documentation for tool: **$1**

**Documentation to Create:**
- **Only README.md** - Single comprehensive file in tool directory

**Content Structure:**
```
src/tools/$1/README.md
├── Tool overview and features
├── Quick start guide
├── Architecture patterns used
├── Basic usage examples
├── File structure
├── Extension guide
└── Integration info
```

**Requirements:**
- Keep documentation concise and focused
- Include essential usage examples
- Document architecture patterns (Strategy/Command)
- Show basic integration approach
- Provide extension examples

**Output:**
- Single README.md file in tool directory
- Update docs/tools.md registry with tool status

**Important:**
- Only create README.md - no additional documentation files
- Keep content essential and avoid verbose explanations
- Focus on practical usage and understanding

Please analyze the specified tool and generate a single, well-structured README.md file with essential documentation.