---
description: Read and analyze existing tool structure and context
argument-hint: [tool-name]
---

Read and analyze tool: **$1**

**Analysis Areas:**
1. **File Structure** - List all files and directories
2. **Component Analysis** - Main component implementation
3. **Pattern Usage** - Identify implemented design patterns
4. **Dependencies** - Internal and external dependencies
5. **Integration Points** - Event bus connections and tool interactions
6. **Current State** - Implementation completeness and known issues

**Files to examine:**
- `src/tools/$1/index.ts` - Plugin registration
- `src/tools/$1/$1.tsx` - Main component
- `src/tools/$1/strategies/` - Algorithm implementations
- `src/tools/$1/commands/` - User actions
- `src/tools/$1/components/` - UI components
- `src/tools/$1/types/` - TypeScript definitions

**Output Format:**
- Complete tool structure overview
- Implementation status summary
- Pattern compliance check
- Integration analysis
- Recommendations for improvements

Please provide a comprehensive analysis of the specified tool's current state and architecture.