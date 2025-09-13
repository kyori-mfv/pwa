---
description: Verify pattern implementation compliance
argument-hint: [tool] [pattern]
---

Verify pattern implementation: **$2** in tool: **$1**

**Pattern Verification Process:**
1. **Interface Compliance** - Check pattern interfaces are properly implemented
2. **Structure Analysis** - Verify file organization follows pattern conventions
3. **Implementation Quality** - Assess code quality and best practices
4. **Integration Check** - Verify pattern integrates with tool architecture
5. **Test Coverage** - Ensure pattern functionality is properly tested

**Pattern Types to Verify:**

**Command Pattern (`command`):**
- Command interface implementation (execute/undo methods)
- Command manager integration
- Undo/redo functionality
- Command history management
- Error handling in commands

**Strategy Pattern (`strategy`):**
- Strategy interface implementation
- Strategy registry/factory
- Runtime strategy switching
- Strategy selection UI
- Performance considerations

**Observer Pattern (`observer`):**
- Event subscription/unsubscription
- Event emission and handling
- Event bus integration
- Memory leak prevention
- Error boundary handling

**State Pattern (`state`):**
- State machine implementation
- State transitions
- State persistence
- State validation
- UI state synchronization

**Verification Checklist:**
```typescript
// Example for Command Pattern
interface PatternCompliance {
  interfaceImplemented: boolean;
  methodsPresent: string[];
  integrationComplete: boolean;
  testsPresent: boolean;
  documentationExists: boolean;
}
```

**Files to Check:**
- `src/tools/$1/$2s/` - Pattern implementations
- `src/tools/$1/types/` - Type definitions
- `src/tools/$1/tests/` - Pattern tests
- `src/tools/$1/index.ts` - Pattern integration

**Output:**
- Compliance score (0-100%)
- Detailed compliance report
- Missing implementations
- Recommended fixes
- Best practice suggestions

Please analyze the specified pattern implementation and provide a comprehensive compliance assessment with actionable recommendations.