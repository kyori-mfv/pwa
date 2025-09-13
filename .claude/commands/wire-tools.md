---
description: Connect tools via event communication
argument-hint: [tool1] [tool2]
---

Wire event communication between tools: **$1** → **$2**

**Event Wiring Process:**
1. **Analyze Tool Interfaces** - Identify output events from $1 and input handlers for $2
2. **Create Event Mapping** - Define event types and data transformation
3. **Implement Event Handlers** - Set up listeners and emitters
4. **Add Integration Logic** - Handle data flow between tools
5. **Update UI** - Add visual indicators of tool connections
6. **Test Integration** - Verify data flows correctly

**Event Communication Pattern:**
```typescript
// Tool 1 (Publisher)
eventBus.emit('$1-data-processed', {
  sourceToolId: '$1',
  data: processedData,
  timestamp: Date.now()
});

// Tool 2 (Subscriber)  
eventBus.subscribe('$1-data-processed', (event) => {
  if (event.sourceToolId === '$1') {
    tool2.handleImportedData(event.data);
  }
});
```

**Integration Types:**
- **Data Pipeline** - Direct data flow from one tool to another
- **Workflow** - Sequential tool operations
- **Parallel Processing** - Same data processed by multiple tools
- **Results Comparison** - Compare outputs from different tools

**Files to Create/Modify:**
- `src/core/events/tool-integrations.ts` - Integration definitions
- `src/tools/$1/events/emitters.ts` - Output event emitters
- `src/tools/$2/events/listeners.ts` - Input event handlers
- `src/shared/types/tool-events.ts` - Event type definitions
- `src/app/store/integration-store.ts` - Integration state management

**UI Integration:**
- Visual connection indicators between tools
- Data flow status indicators
- Integration configuration panels
- Error handling and retry mechanisms

Please implement bidirectional event communication between the specified tools with proper error handling and UI feedback.