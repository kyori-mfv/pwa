# Expense Manager

Vietnamese-focused personal expense tracking tool with AI-powered input parsing, data visualization, and comprehensive data management features.

## Features

### Core Functionality
- **AI-Powered Expense Input**: Natural language processing for Vietnamese expense descriptions
- **Multi-Category Support**: Pre-configured Vietnamese expense categories with custom category creation
- **Date-Range Analytics**: Interactive dashboard with category-based expense visualization
- **Real-time Search**: Fast expense searching with category and date filtering

### Data Management
- **Import/Export**: Complete data portability with JSON and CSV format support
- **Data Cleanup**: Secure bulk deletion with confirmation safeguards
- **Vietnamese Template Compatibility**: Full support for Vietnamese expense JSON templates
- **Local Storage**: IndexedDB-based offline data persistence

### User Interface
- **Dual-Tab Layout**: Separate input and analytics interfaces
- **Vietnamese Localization**: Complete Vietnamese language support
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Immediate UI updates after data operations

## Quick Start

### Adding Expenses
1. Navigate to **"Thêm chi tiêu"** tab
2. Enter expense details using natural Vietnamese language:
   - `"Cà phê 35k hôm nay"`
   - `"Mua rau 50000 ngày 15/12"`
   - `"Xăng xe 200k"`
3. AI automatically parses amount, category, and date
4. Review and confirm the parsed expense

### Viewing Analytics
1. Switch to **"Dashboard"** tab
2. Use date range picker to filter expenses
3. View category breakdown chart and expense trends
4. Access detailed transaction history

### Data Management
1. Go to **"Thêm chi tiêu"** tab
2. Use import/export actions at the bottom:
   - **Export**: Download all expenses as JSON/CSV
   - **Import**: Upload expense data from file
   - **Cleanup**: Remove all data with confirmation

## Data Formats

### Import/Export Compatibility
Supports Vietnamese expense template format:

```json
{
  "expenses": [
    {
      "amount": 35000,
      "category": "Cà phê & Đồ uống",
      "description": "Cà phê sáng",
      "date": "2024-12-15",
      "originalInput": "Cà phê 35k hôm nay"
    }
  ]
}
```

### Supported Formats
- **JSON**: Complete data export with all fields preserved
- **CSV**: Excel-compatible format for spreadsheet analysis

### Date Format Support
- Vietnamese format: `dd/mm/yyyy`, `dd-mm-yyyy`
- ISO format: `yyyy-mm-dd`
- Natural language: `"hôm nay"`, `"hôm qua"`, `"ngày 15"`

## Categories

### Pre-configured Categories
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

### Custom Categories
Add new categories through the category management interface with:
- Custom names and icons
- Color coding for visual distinction
- Budget allocation per category

## AI Integration

### Supported Providers
- **Google Gemini 2.0 Flash** (Primary)
- OpenAI GPT-4 (Optional)
- Anthropic Claude (Optional)

### Natural Language Processing
The AI understands Vietnamese expense patterns:
- Amount recognition: `35k`, `50000`, `2 triệu`
- Category inference from description context
- Date parsing from natural language
- Original input preservation for reference

## Data Security

### Local Storage
- All data stored locally using IndexedDB
- No data transmitted to external servers
- Complete offline functionality
- Secure cleanup with confirmation dialogs

### Import Safety
- Data validation before import
- Duplicate detection and handling
- Error reporting for invalid entries
- Progress tracking for large imports

## Technical Details

### Architecture
- React 19 with TypeScript
- IndexedDB with Dexie for data persistence
- Zustand for state management
- Tailwind CSS for styling
- Chart.js for data visualization

### Performance
- Efficient database indexing for fast queries
- Optimized search with compound indexes
- Lazy loading for large datasets
- Background processing for data operations

### Browser Compatibility
- Modern browsers with IndexedDB support
- Progressive Web App (PWA) capabilities
- Offline functionality when installed

## Usage Tips

### Efficient Expense Entry
- Use consistent Vietnamese terminology for better AI recognition
- Include context in descriptions for accurate categorization
- Verify AI-parsed results before saving
- Use natural date references like `"hôm nay"` for current day

### Data Management Best Practices
- Export data regularly as backup
- Review and clean up expenses monthly
- Use category filters to analyze spending patterns
- Import historical data to establish spending baselines

### Troubleshooting
- **AI not parsing correctly**: Check internet connection and API key configuration
- **Import errors**: Verify file format matches expected JSON/CSV structure
- **Performance issues**: Clear browser cache and restart application
- **Data loss prevention**: Always export before using cleanup function

## Development Status

✅ **Production Ready** - Comprehensive feature set with import/export
✅ **Data Management** - Complete import/export and cleanup functionality
✅ **Vietnamese Support** - Full localization and template compatibility
✅ **Performance Optimized** - Handles large datasets efficiently
✅ **Mobile Responsive** - Complete mobile interface
✅ **Offline Capable** - Full offline functionality with local storage

## Version History
- **v1.0**: Initial release with basic expense tracking
- **v1.1**: Added AI-powered input parsing
- **v1.2**: Implemented dashboard analytics
- **v1.3**: Added comprehensive import/export and cleanup features