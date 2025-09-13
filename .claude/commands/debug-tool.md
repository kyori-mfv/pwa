---
description: Debug tool with pattern analysis and issue identification
argument-hint: [tool-name] [issue-type]
---

Debug tool: **$1** for issue: **$2**

**Debug Analysis:**
1. **Tool Structure** - Verify all required files and directories exist
2. **Pattern Implementation** - Check design pattern compliance
3. **Component Health** - Analyze React component structure
4. **Integration Issues** - Check event bus connections
5. **Performance Issues** - Identify rendering or calculation bottlenecks
6. **Type Safety** - Verify TypeScript implementation

**Issue-Specific Analysis:**

**Performance Issues (`performance`):**
- Check for unnecessary re-renders
- Identify expensive calculations
- Analyze component memoization
- Review state update patterns

**UI Issues (`ui`):**
- Component composition analysis
- shadcn/ui integration check
- Responsive design verification
- Accessibility compliance

**Integration Issues (`integration`):**
- Event bus communication check
- Tool-to-tool data flow analysis
- Command pattern implementation
- State management verification

**Logic Issues (`logic`):**
- Strategy pattern implementation
- Algorithm correctness
- Error handling coverage
- Edge case validation

**Output:**
- Issue diagnosis with root cause analysis
- Specific fixes and recommendations
- Code examples for corrections
- Testing steps to verify fixes

Please analyze the specified tool for the given issue type and provide detailed debugging information with actionable solutions.