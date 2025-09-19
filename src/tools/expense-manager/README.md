# Expense Manager Tool

AI-powered expense tracking tool with natural language processing and comprehensive financial management.

## Features

- AI expense parsing with Gemini integration
- Interactive dashboard with charts and statistics
- Database-level search with pagination
- Mobile responsive design
- Offline capability with IndexedDB
- Localized currency formatting

## Quick Start

1. Configure AI provider (Gemini API key)
2. Add expenses using natural language
3. Review and edit AI-parsed data
4. View dashboard analytics

## Architecture Patterns

### Hook-Based State Management
- `useExpenseManager` - Core business logic and database operations
- `useAIExpenseForm` - AI form state management
- `useTransactionsSearch` - Search functionality

### Strategy Pattern - AI Providers
Multiple AI providers with runtime switching and fallback mechanisms.

### Repository Pattern - Database Layer
Database abstraction with optimized compound indexes and efficient querying.

### Component Separation
Focused, reusable components for maintainability:
- AI input coordinator
- Text input and parsing controls
- Editable preview form
- Provider configuration

## File Structure

```
src/tools/expense-manager/
├── components/           # UI components
├── hooks/               # Custom React hooks
├── services/            # Database and AI services
├── types.ts            # TypeScript interfaces
└── utils/              # Utility functions
```

## Extension Guide

### Adding New AI Providers
Implement the `AIProvider` interface and register in configuration.

### Custom Categories
Add categories with icons, colors, and budgets in types configuration.

### Database Extensions
Extend `ExpenseDB` with additional query methods using Dexie.

## Integration

Uses PWA's `useToolState` for automatic state persistence and instance management.

## Performance

- Database-level filtering and pagination
- Component separation for maintainability
- Mobile-optimized responsive design
- Offline-first architecture with IndexedDB

## Development Status

✅ **Production Ready** - Comprehensive feature set
✅ **Performance Optimized** - Handles large datasets efficiently
✅ **Mobile Responsive** - Complete mobile interface
✅ **Offline Capable** - Full offline functionality