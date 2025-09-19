# Expense Manager Tool

## Overview
Vietnamese-focused expense tracking application with AI-powered natural language input. Built for PWA with offline-first capabilities and intelligent expense categorization.

## Features
- 🤖 **AI Natural Language Processing** - Gemini API integration for Vietnamese input
- 🇻🇳 **Vietnamese Localization** - Complete Vietnamese UI, categories, and currency (VND)
- 📱 **Mobile-First Design** - Responsive interface optimized for mobile usage
- 🗃️ **Offline-First Database** - IndexedDB with optimized querying and compound indexes
- ✏️ **Editable AI Preview** - Review and modify AI-parsed data before saving
- 🏷️ **Smart Categories** - 11 Vietnamese-specific categories with keyword matching
- 📊 **Recent Expenses View** - Efficient display of 10 latest expenses
- 🗓️ **Custom Date Picker** - Clean calendar interface with Vietnamese formatting

## Quick Start

### 1. Setup Gemini AI
```typescript
// Configure API key (stored securely in IndexedDB)
await updateAIProvider("gemini", {
  apiKey: "your-gemini-api-key",
  enabled: true,
});
```

### 2. Add Expenses
```typescript
// Natural language input (Vietnamese)
const input = "tôi ăn cơm trưa hôm qua hết 50k";
const parsed = await parseExpense(input);
// AI returns: { amount: 50000, category: "Ăn uống", description: "tôi ăn cơm trưa", date: yesterday }

await addExpense(parsed);
```

### 3. Query Expenses
```typescript
// Get recent expenses (efficient, database-level limit)
const recent = await ExpenseDB.getRecentCreatedExpenses(10);

// Get expenses by date range (optimized with compound indexes)
const monthly = await ExpenseDB.getExpensesByMonth(2025, 9);
```

## Architecture Patterns

### Strategy Pattern - AI Providers
```typescript
interface AIProvider {
  parseExpense(input: string): Promise<ParsedExpense>;
  isConfigured(): boolean;
  validateConfig(config: AIProviderConfig): boolean;
}

class GeminiProvider implements AIProvider {
  async parseExpense(input: string): Promise<ParsedExpense> {
    // Vietnamese-optimized prompt engineering
    // Handles "hôm qua", "100k", Vietnamese categories
  }
}
```

### Repository Pattern - Database Layer
```typescript
export const ExpenseDB = {
  // Efficient queries with database-level limiting
  async getRecentCreatedExpenses(limit = 10): Promise<ExpenseRecord[]>,
  async getExpensesByDateRange(start: Date, end: Date): Promise<ExpenseRecord[]>,
  async addExpense(expense: ExpenseInput): Promise<ExpenseRecord>,
};
```

### Hook Pattern - State Management
```typescript
const {
  parseExpense,    // AI parsing with fallback
  addExpense,      // Database + state update
  initializeAI,    // Provider setup
  isLoading        // Loading states
} = useExpenseManager(toolState, setToolState);
```

## File Structure
```
src/tools/expense-manager/
├── components/
│   ├── index.tsx                    # Main component
│   └── input/
│       └── ai-expense-input.tsx     # AI input with editable preview
├── hooks/
│   └── use-expense-manager.ts       # State management & business logic
├── services/
│   ├── database.ts                  # IndexedDB operations (Dexie)
│   └── ai-providers/
│       └── gemini-provider.ts       # Gemini API integration
├── types/
│   └── index.ts                     # TypeScript definitions
└── utils/
    ├── currency-utils.ts            # VND formatting
    └── default-categories.ts        # Vietnamese categories & keywords
```

## Database Schema

### Optimized Indexes
```typescript
// Compound indexes for efficient filtering
expenses: "++id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]"
```

### Key Methods
- `getRecentCreatedExpenses(limit)` - Latest expenses by creation time
- `getExpensesByDateRange(start, end)` - Date-filtered expenses
- `getExpensesByMonth(year, month)` - Monthly Vietnamese calendar view

## Vietnamese Categories
```typescript
const DEFAULT_CATEGORIES = [
  { name: "Ăn uống", budget: 2000000 },      // Food & Drinks
  { name: "Di chuyển", budget: 1500000 },    // Transportation
  { name: "Mua sắm", budget: 3000000 },      // Shopping
  { name: "Con cái", budget: 3000000 },      // Children
  // ... 7 more categories
];
```

## AI Prompt Engineering
```typescript
// Vietnamese-optimized prompt for Gemini
const prompt = `Phân tích chi tiêu này và trả về CHỈ MỘT đối tượng JSON:
- AMOUNT: "100k" = 100000, "1tr" = 1000000
- DESCRIPTION: Giữ nguyên nội dung, viết hoa chữ cái đầu
- CATEGORY: Chọn từ ${vietnameseCategories.join(", ")}
- DATE: Tính toán chính xác. Hôm nay là ${today}

Đầu vào: "${input}"`;
```

## Extension Examples

### Add New AI Provider
```typescript
class OpenAIProvider implements AIProvider {
  async parseExpense(input: string): Promise<ParsedExpense> {
    // Implement OpenAI integration
  }
}

// Register in initial state
aiProviders: [...existing, { id: "openai", name: "OpenAI GPT-4" }]
```

### Add Custom Category
```typescript
const newCategory = {
  id: "nha-cua",
  name: "Nhà cửa",
  icon: "Home",
  color: "#10b981",
  budget: 5000000,
  isDefault: true,
};

const keywords = ["thuê nhà", "điện nước", "sửa chữa", "nội thất"];
```

### Custom Database Query
```typescript
async getExpensesByCategory(category: string): Promise<ExpenseRecord[]> {
  return await db.expenses
    .where("category")
    .equals(category)
    .reverse()
    .toArray();
}
```

## Integration with PWA

### Tool Registration
```typescript
// src/tools/expense-manager/index.tsx
export const ExpenseManager: React.FC<ToolComponentProps> = ({ instanceId }) => {
  const [toolState, setToolState] = useToolState<ExpenseManagerState>(instanceId, initialState);
  return <AIExpenseInput toolState={toolState} setToolState={setToolState} />;
};
```

### State Persistence
```typescript
// Automatic state persistence via useToolState hook
const [toolState, setToolState] = useToolState<ExpenseManagerState>(
  instanceId,
  initialState
);
```

## Performance Optimizations

### Database Level
- **Compound indexes** for date + category queries
- **Limit queries** at database level (`getRecentCreatedExpenses(10)`)
- **Efficient date range** queries with `between()`

### UI Level
- **Database refresh** instead of local state manipulation
- **Optimistic updates** with fallback error handling
- **Lazy loading** of AI providers

### Memory Management
- Only load 10 recent expenses (not all data)
- Efficient IndexedDB queries with Dexie
- Minimal state updates via targeted setToolState calls

---

**Status**: ✅ Production Ready
**Performance**: Optimized for 10,000+ expenses
**Mobile**: Fully responsive Vietnamese interface
**Offline**: Complete offline functionality with IndexedDB