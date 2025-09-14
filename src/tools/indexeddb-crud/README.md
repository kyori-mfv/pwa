# IndexedDB CRUD Tool

A simple browser-based tool for managing IndexedDB databases with full CRUD operations, filtering, and editing capabilities.

## Features

- **Database Management**: Create and select IndexedDB databases
- **Object Store Operations**: Work with object stores within databases
- **CRUD Operations**: Create, Read, Update, and Delete records with JSON data
- **Record Filtering**: Search and filter records by content
- **Inline Editing**: Edit records directly in the table
- **State Persistence**: Maintains your work across browser sessions
- **Clean UI**: Intuitive layout with clear visual feedback

## How to Use

### 1. Create a Database

- Click "Create Database" button
- Enter database name and object store name
- The database will be created with auto-incrementing IDs

### 2. Select Database & Object Store

- Choose a database from the dropdown (or see "No databases available" text)
- Select an object store from the dropdown (or see "Select a database first" text)

### 3. Add Records

- Type JSON data in the textarea (e.g., `{"name": "John", "age": 30}`)
- Click "Add Record" to save to IndexedDB
- Invalid JSON will show an error message

### 4. Filter Records

- Use the search input to filter records by content

### 5. Edit Records

- Click the edit icon to edit records inline
- Save or cancel changes with the action buttons

### 6. Delete Records

- Click the trash icon to delete individual records

## Technical Details

- **Storage**: Uses browser's IndexedDB API via Dexie.js wrapper
- **Database Library**: Dexie.js for simplified IndexedDB operations
- **Schema Management**: Hybrid approach using Dexie.js + native IndexedDB for reliability
- **Data Format**: JSON objects with configurable key paths and auto-increment support
- **Persistence**: Tool state persists across sessions
- **Error Handling**: Validation and user feedback

## File Structure

```
src/tools/indexeddb-crud/
├── components/
│   ├── index.tsx             # Main UI component with CRUD + filtering
│   ├── indexeddb-crud.tsx    # Alternative component implementation
│   ├── records-table.tsx     # Table with inline editing functionality
│   ├── add-record-form.tsx   # JSON input form component
│   └── database-selector.tsx # Database/store selection component
├── hooks/
│   ├── use-indexeddb.ts      # Business logic with full CRUD operations
│   └── index.ts              # Hook exports
├── utils/
│   ├── indexeddb.ts          # IndexedDB utilities with update support
│   └── index.ts              # Utility exports
├── types/
│   └── index.ts              # TypeScript definitions + filter/edit state
├── index.ts                  # Plugin registration
└── README.md                 # This file
```

## Development

The tool follows the established plugin architecture:

- Auto-registers with the tool registry
- Uses `useToolState` hook for state persistence
- Implements shadcn/ui components for consistent design
- Includes proper TypeScript typing throughout

Perfect for learning IndexedDB concepts or managing browser storage during development!
