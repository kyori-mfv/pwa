# Expense Manager

Comprehensive personal finance management tool with AI-powered natural language input, supporting both income and expense tracking with intelligent categorization, real-time dashboard updates, and responsive design.

## Features

### 💰 Dual Transaction Support
- **Income Management**: Track salary, freelance, investments, business income with dedicated AI input
- **Expense Management**: Track spending across multiple categories with smart categorization
- **Unified Dashboard**: Combined financial overview with real-time statistics and analytics
- **Separate Data Storage**: Dedicated storage for income and expenses with clean data separation

### 🤖 AI-Powered Input
- **Natural Language Processing**: Input transactions using conversational Vietnamese
- **Context-Aware Detection**: Automatically detects income vs expense from input keywords
- **Category Auto-Selection**: AI matches input to appropriate categories with visual feedback
- **Multiple Provider Support**: Gemini 2.0 Flash (primary), OpenAI GPT-4, and Claude AI integration
- **Real-time Parsing**: Instant preview of parsed transactions before saving

### 📊 Comprehensive Dashboard
- **Financial Overview Cards**: Total income, expenses, net balance, and savings rate
- **Category Analysis**: Visual breakdown by category with interactive charts and budgets
- **Date Range Filtering**: Flexible date range selection for detailed analysis
- **Real-time Updates**: Dashboard automatically refreshes when data changes
- **Transaction History**: Detailed listings with pagination, search, and filter capabilities

### 📱 Responsive Design
- **Mobile-First Navigation**: Bottom tab navigation for mobile devices
- **Desktop Sidebar**: Professional collapsible sidebar for desktop with view switching
- **Optimized Layouts**: Different layouts optimized for different screen sizes
- **Touch-Friendly**: Large tap targets and mobile-optimized interactions
- **Adaptive Padding**: Mobile padding optimization for better content visibility

### 🎨 Modern UI/UX
- **Consistent Design**: Unified visual language across all components
- **Color-Coded Transactions**: Green for income, red for expenses with proper contrast
- **Visual Indicators**: Icons, badges, and clear status indicators
- **Professional Layout**: Clean, organized interface with intuitive navigation
- **Loading States**: Smooth loading indicators and transitions

### 🔧 Advanced Data Management
- **Service Architecture**: Dedicated ExpenseService and IncomeService for clean separation
- **Real-time Synchronization**: Dashboard updates automatically when transactions change
- **Import/Export**: Complete data portability with JSON and CSV format support
- **Local Storage**: IndexedDB-based offline data persistence with automatic migration
- **Clean Architecture**: Separate income and expense services for maintainable codebase
- **Backup & Restore**: Export/import functionality with progress tracking

### 🔄 Real-time Features
- **Automatic Refresh**: Dashboard updates immediately after adding/deleting transactions
- **Live Statistics**: Financial totals update in real-time without page refresh
- **Instant Feedback**: Transaction changes reflect immediately in all views
- **Synchronized Views**: All components stay in sync with latest data

## Quick Start

### Adding Income
1. Navigate to **"Quản lý Thu nhập"** tab
2. Configure Gemini AI provider with API key
3. Enter income using natural Vietnamese language:
   - `"Lương tháng 12 là 15 triệu"`
   - `"Freelance project 5 triệu hôm nay"`
   - `"Đầu tư cổ phiếu lời 2 triệu"`
4. AI automatically parses amount, category, and date
5. Review and confirm the parsed income

### Adding Expenses
1. Navigate to **"Quản lý Chi tiêu"** tab
2. Enter expense details using natural Vietnamese language:
   - `"Cà phê 35k hôm nay"`
   - `"Mua rau 50000 ngày 15/12"`
   - `"Xăng xe 200k"`
3. AI automatically parses amount, category, and date
4. Review and confirm the parsed expense

### Viewing Analytics
1. Switch to **"Dashboard Tổng quan"** tab
2. Use date range picker to filter data by specific periods
3. View comprehensive financial overview:
   - **Tổng thu nhập**: Total income with transaction count
   - **Tổng chi tiêu**: Total expenses with transaction count
   - **Số dư ròng**: Net balance (positive/negative)
   - **Tỷ lệ tiết kiệm**: Savings rate percentage
4. Analyze **"Thông tin chi tiêu"** section with search and filters
5. View category breakdown charts with budget comparisons
6. Navigate through transactions using pagination

### Data Management
1. Available in both Income and Expense views
2. Use import/export actions at the bottom:
   - **Export**: Download all data as JSON/CSV
   - **Import**: Upload expense data from file with validation
   - **Progress Tracking**: Real-time import progress with error reporting

## Architecture

### Service-Based Architecture
```
┌─ Dashboard Stats Hook ─┐
│  ├─ ExpenseService    │  ← Direct access to expenses table
│  └─ IncomeService     │  ← Direct access to income table
└────────────────────────┘
         ↓
┌─ Database Layer (IndexedDB) ─┐
│  ├─ expenses (dedicated)     │
│  ├─ income (dedicated)       │
│  └─ categories (shared)      │
└────────────────────────────────┘
```

### Real-time Data Flow
1. **User Action** → Service Method → Database Update
2. **Service Method** → Update toolState → Trigger Dashboard Refresh
3. **Dashboard** → Load Fresh Data → Update UI Components
4. **Result** → Immediate visual feedback across all views

### Data Architecture
- **Separate Tables**: Clean separation between income and expense data
- **Function-based Services**: Modern function-based service architecture instead of classes
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Performance Optimized**: Direct table access without intermediate transaction layer

## Data Formats

### Current Schema (Version 4)
```json
{
  "income": [
    {
      "id": "uuid-v4",
      "amount": 15000000,
      "category": "Lương & Thưởng",
      "description": "Lương tháng 12",
      "date": "2024-12-15",
      "originalInput": "Lương tháng 12 là 15 triệu",
      "createdAt": "2024-12-15T10:00:00Z",
      "updatedAt": "2024-12-15T10:00:00Z"
    }
  ],
  "expenses": [
    {
      "id": "uuid-v4",
      "amount": 35000,
      "category": "Cà phé & Đồ uống",
      "description": "Cà phê sáng",
      "date": "2024-12-15",
      "type": "expense",
      "originalInput": "Cà phê 35k hôm nay",
      "createdAt": "2024-12-15T08:00:00Z",
      "updatedAt": "2024-12-15T08:00:00Z"
    }
  ]
}
```

### Import/Export Features
- **JSON**: Complete data export with all fields preserved
- **CSV**: Excel-compatible format for spreadsheet analysis
- **Validation**: Comprehensive data validation on import
- **Progress Tracking**: Real-time import progress with error reporting
- **Duplicate Handling**: Smart duplicate detection and resolution

## Categories

### Income Categories
- Lương & Thưởng
- Freelance & Dịch vụ
- Đầu tư & Cổ phiếu
- Kinh doanh
- Thu nhập khác

### Expense Categories
- Ăn uống & Nhà hàng
- Cà phê & Đồ uống
- Mua sắm & Quần áo
- Giao thông & Xăng xe
- Giải trí & Phim ảnh
- Sức khỏe & Y tế
- Giáo dục & Học tập
- Nhà ở & Tiện ích
- Du lịch & Nghỉ dưỡng
- Khác

### Category Features
- **Smart Categorization**: AI automatically selects appropriate categories
- **Visual Distinction**: Color coding for easy recognition
- **Budget Integration**: Budget allocation and tracking per category
- **Chart Visualization**: Interactive charts showing category breakdowns

## AI Integration

### Primary Provider: Google Gemini 2.0 Flash
- **Setup**: Configure API key in application settings
- **Performance**: Fast, accurate Vietnamese language processing
- **Context Understanding**: Excellent at parsing Vietnamese financial terminology
- **Rate Limits**: 60 requests/minute, 1000 requests/day

### Backup Providers
- **OpenAI GPT-4**: Alternative provider for redundancy
- **Anthropic Claude**: Additional fallback option
- **Provider Switching**: Easy switching between providers in settings

### Natural Language Processing
The AI understands Vietnamese financial patterns:
- **Amount Recognition**: `35k`, `50000`, `2 triệu`, `15 triệu`
- **Category Inference**: Context-based category selection
- **Date Parsing**: `"hôm nay"`, `"hôm qua"`, `"ngày 15/12"`
- **Income vs Expense**: Automatic detection from context keywords
- **Original Input Preservation**: Complete input history for reference

## Technical Implementation

### Performance Optimizations
- **Function-based Services**: Modern functional architecture instead of classes
- **Direct Database Access**: No intermediate transaction layer for faster queries
- **Real-time Updates**: Efficient state management with automatic refresh
- **Database Indexing**: Optimized queries for fast data retrieval
- **Component Memoization**: Prevents unnecessary re-renders
- **Pagination Fix**: Proper page-to-offset conversion for accurate pagination
- **Background Processing**: Async operations don't block UI

### Browser Compatibility
- **Modern Browsers**: Full support for latest Chrome, Firefox, Safari, Edge
- **Progressive Web App**: PWA capabilities for mobile installation
- **Offline Functionality**: Complete offline support with IndexedDB
- **Mobile Responsive**: Touch-optimized interface for mobile devices

### Development Architecture
- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety across all components
- **Tailwind CSS 4**: Modern utility-first styling
- **Biome**: Fast linting and formatting
- **Vite 6**: Lightning-fast development and building
- **IndexedDB + Dexie**: Robust local data storage

## Recent Updates

### Version 3.0 - Architecture Modernization & Performance
- **✅ Eliminated Transactions Table**: Removed unified transactions approach for cleaner architecture
- **✅ Function-based Services**: Converted static classes to modern functions for better performance
- **✅ Direct Data Access**: Each service accesses its dedicated table directly
- **✅ Category Filtering**: "Thông tin chi tiêu" now shows only expense categories
- **✅ TypeScript Compliance**: Full type safety with strict linting rules
- **✅ Performance Boost**: Faster queries without intermediate transaction layer

### Version 2.0 - Major Service Architecture Refactor
- **✅ Separate Services**: Dedicated ExpenseService and IncomeService
- **✅ Real-time Dashboard**: Automatic refresh when data changes
- **✅ Fixed Pagination**: Proper page-to-offset conversion for accurate navigation
- **✅ Enhanced UI**: Updated "Thông tin giao dịch" → "Thông tin chi tiêu"

### Version 1.9 - Dashboard Integration
- **✅ Unified Dashboard**: Combined income and expense analytics
- **✅ Financial Overview**: Real-time financial statistics and savings rate
- **✅ Chart Integration**: Interactive category breakdown charts
- **✅ Mobile Optimization**: Improved mobile padding and navigation
- **✅ Sidebar Navigation**: Professional desktop sidebar with view switching

### Version 1.8 - Income Management
- **✅ Income Tracking**: Complete income management system
- **✅ AI Income Input**: Natural language processing for income entries
- **✅ Dual Storage**: Separate income and expense data management
- **✅ Responsive Design**: Mobile-first navigation with desktop sidebar

## Known Issues & Fixes

### Recently Fixed
- **✅ Transactions Table Removal**: Eliminated unified transactions table for cleaner data flow
- **✅ Function-based Architecture**: Converted classes to functions for better linting compliance
- **✅ Category Filtering**: Fixed expense view to show only expense categories
- **✅ TypeScript Errors**: Resolved all type safety issues after architecture changes
- **✅ Performance**: Direct database access improves query speed
- **✅ Code Quality**: Full biome linting compliance with modern patterns

### Best Practices
- **Regular Backups**: Export data monthly for safety
- **API Key Security**: Store API keys securely, don't share or commit
- **Data Validation**: Always review AI-parsed results before saving
- **Performance**: Use date range filters for large datasets

## Usage Tips

### Efficient Transaction Entry
- **Consistent Terminology**: Use consistent Vietnamese terms for better AI recognition
- **Context Descriptions**: Include context for accurate categorization
- **Verification**: Always verify AI-parsed results before saving
- **Natural Dates**: Use `"hôm nay"`, `"hôm qua"` for current/previous day

### Data Management
- **Regular Exports**: Export data regularly as backup
- **Monthly Reviews**: Review and clean up transactions monthly
- **Category Analysis**: Use category filters to analyze spending patterns
- **Historical Data**: Import historical data to establish financial baselines

### Troubleshooting
- **AI Parsing Issues**: Check internet connection and API key configuration
- **Import Errors**: Verify file format matches expected JSON structure
- **Performance**: Clear browser cache if experiencing slowdowns
- **Data Safety**: Always export before using any cleanup functions

## Development Status

**✅ Production Ready** - Comprehensive feature set with modernized architecture
- **✅ Function-based Services**: Modern functional architecture for better maintainability
- **✅ Direct Data Access**: Eliminated transactions table for improved performance
- **✅ Real-time Updates**: Immediate feedback across all components
- **✅ Data Management**: Complete import/export with progress tracking
- **✅ Vietnamese Support**: Full localization with cultural context
- **✅ Performance Optimized**: Handles large datasets efficiently with direct table access
- **✅ Mobile Responsive**: Complete mobile-first interface
- **✅ Offline Capable**: Full offline functionality with local storage
- **✅ Type Safety**: Full TypeScript coverage with strict linting
- **✅ AI Integration**: Multiple provider support with fallbacks

## Support

For technical issues or feature requests:
1. Check the troubleshooting section above
2. Verify your browser supports modern JavaScript features
3. Ensure IndexedDB is available and not blocked
4. Test with a fresh browser profile if problems persist

---

**Last Updated**: December 2024 - Version 3.0
**Compatibility**: Modern browsers with IndexedDB support
**License**: Internal development tool