# Verification Workflows

## Overview
Systematic verification ensures code quality and prevents regressions. Claude AI must follow these workflows after completing tasks.

## Verification Commands
```bash
# Full verification suite
pnpm verify

# Individual checks
pnpm build              # Build check
pnpm test               # Test suite
pnpm lint               # Biome linting
pnpm format             # Biome formatting
pnpm type-check         # TypeScript checking

# Git hooks (automatic)
# Husky pre-push hook runs verification
```

## Task-Based Verification

### After Adding New Tool
**MANDATORY steps:**
1. `pnpm build` - Must succeed
2. `pnpm type-check` - Zero errors
3. `pnpm test` - All tests pass
4. `pnpm lint` - Clean biome output
5. `pnpm format` - Code properly formatted
6. shadcn components used correctly
7. Manual check: Tool appears in navigation
8. Manual check: Tool route works
9. Husky pre-push hook passes

### After Code Changes
**MANDATORY steps:**
1. `pnpm test` - All existing tests pass
2. `pnpm type-check` - No new errors
3. `pnpm build` - Successful build
4. `pnpm lint` - Zero biome warnings
5. `pnpm format` - Code auto-formatted
6. Test affected functionality manually
7. Verify shadcn component usage

### After Bug Fixes
**MANDATORY steps:**
1. Verify bug is actually fixed
2. `pnpm test` - Focus on related tests
3. Check no regression introduced
4. `pnpm lint && pnpm format` - Code quality
5. Test edge cases around the fix
6. Ensure Husky hooks still pass

## Verification Report Format
Claude must end each task with:

```
## ✅ Verification Complete

**Task**: [Description of what was completed]
**Status**: ✅ Passed / ❌ Failed / ⚠️ Partial
**Commands Run**: 
- pnpm build: ✅
- pnpm test: ✅
- pnpm lint: ✅
- pnpm format: ✅
- pnpm type-check: ✅
- husky pre-push: ✅

**Issues Found**: [List any issues or "None"]

**Manual Testing Needed**:
- [Steps for user to verify]

**Next Steps**:
- [Any follow-up tasks]
```

## Quality Gates
- **Build**: Must compile without errors
- **Tests**: Must maintain >80% coverage
- **Types**: Zero TypeScript errors
- **Lint**: Zero errors, minimal warnings
- **Performance**: No significant regressions

## Failure Protocol
If verification fails:
1. **DO NOT** mark task as complete
2. Fix all issues found
3. Re-run verification
4. Only proceed when all checks pass

## Integration Testing
For cross-tool changes:
1. Test tool interactions
2. Verify shared components work
3. Check routing still functions
4. Validate state management

## Performance Verification
- Bundle size hasn't increased significantly
- Tool load times remain fast
- No memory leaks introduced
- UI remains responsive