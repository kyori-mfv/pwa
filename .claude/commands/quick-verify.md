---
description: Smart verification of current changes and project health
allowed-tools: Bash(pnpm *)
---

Perform smart verification based on recent work and project state:

**Verification Steps:**
1. **Build Check** - Run `pnpm build` if project is initialized
2. **Type Check** - Run `pnpm type-check` for TypeScript validation
3. **Linting** - Run `pnpm lint` for code quality
4. **Tests** - Run `pnpm test` for functionality validation
5. **Pattern Compliance** - Check recent changes follow architectural patterns

**Smart Analysis:**
- If recent changes are to tools → Focus on tool-specific verification
- If changes are to core → Run full architecture verification
- If changes are to documentation → Verify documentation consistency
- If project not initialized → Skip build tools, focus on structure

**Quality Gates:**
- All build steps must pass
- No TypeScript errors
- No linting violations
- All tests passing
- Architectural patterns maintained

**Output:**
- Pass/fail status for each check
- Summary of any issues found
- Recommended fixes for failures
- Confirmation of readiness for commit/deployment

Please run appropriate verification checks based on the current project state and recent changes.