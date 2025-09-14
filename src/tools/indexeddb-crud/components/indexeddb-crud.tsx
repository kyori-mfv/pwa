import { Input } from "@/shared/components/ui/input";
import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import { Database, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useIndexedDb } from "../hooks";
import type { IndexedDbState } from "../types";
import { AddRecordForm } from "./add-record-form";
import { DatabaseSelector } from "./database-selector";
import { RecordsTable } from "./records-table";

export const IndexedDbCrud: React.FC<ToolComponentProps> = ({ instanceId }) => {
  const [currentDb, setCurrentDb] = useState<IDBDatabase | null>(null);
  const [jsonInput, setJsonInput] = useState('{"name": "John", "age": 30}');

  const {
    loadDatabases,
    openDatabase,
    loadRecords,
    createDatabase,
    addRecord,
    updateRecord,
    deleteRecord,
  } = useIndexedDb();

  const [toolState, setToolState] = useToolState<IndexedDbState>(instanceId, {
    selectedDatabase: "",
    selectedStore: "",
    databases: [],
    records: [],
    newRecord: {},
    filterText: "",
    editingRecordId: null,
  });

  // Load databases on mount
  useEffect(() => {
    const loadData = async () => {
      const databases = await loadDatabases();
      setToolState({ databases });
    };
    loadData();
  }, [loadDatabases, setToolState]);

  // Open selected database
  useEffect(() => {
    const openDb = async () => {
      if (!toolState.selectedDatabase) return;

      const result = await openDatabase(toolState.selectedDatabase);
      if (result) {
        setCurrentDb(result.db);
        setToolState({
          databases: toolState.databases.map((d) =>
            d.name === toolState.selectedDatabase ? { ...d, objectStores: result.stores } : d
          ),
        });
      }
    };
    openDb();
  }, [toolState.selectedDatabase, openDatabase, toolState.databases, setToolState]);

  // Load records when store changes
  useEffect(() => {
    const loadData = async () => {
      if (currentDb && toolState.selectedStore) {
        const records = await loadRecords(currentDb, toolState.selectedStore);
        setToolState({ records });
      }
    };
    loadData();
  }, [currentDb, toolState.selectedStore, loadRecords, setToolState]);

  const handleDatabaseChange = (value: string) => {
    setToolState({ selectedDatabase: value, selectedStore: "", records: [] });
  };

  const handleStoreChange = (value: string) => {
    setToolState({ selectedStore: value, records: [] });
  };

  const handleCreateDatabase = async () => {
    const newDbName = await createDatabase();
    if (newDbName) {
      const databases = await loadDatabases();
      setToolState({ databases, selectedDatabase: newDbName });
    }
  };

  const handleAddRecord = async () => {
    if (currentDb && toolState.selectedStore) {
      const success = await addRecord(currentDb, toolState.selectedStore, jsonInput);
      if (success) {
        setJsonInput('{"name": "John", "age": 30}'); // Reset input
        const records = await loadRecords(currentDb, toolState.selectedStore);
        setToolState({ records });
      }
    }
  };

  const handleUpdateRecord = async (recordData: Record<string, unknown>) => {
    if (currentDb && toolState.selectedStore) {
      const success = await updateRecord(currentDb, toolState.selectedStore, recordData);
      if (success) {
        const records = await loadRecords(currentDb, toolState.selectedStore);
        setToolState({ records });
      }
    }
  };

  const handleDeleteRecord = async (recordData: unknown) => {
    if (currentDb && toolState.selectedStore) {
      const success = await deleteRecord(currentDb, toolState.selectedStore, recordData);
      if (success) {
        const records = await loadRecords(currentDb, toolState.selectedStore);
        setToolState({ records });
      }
    }
  };

  // Filter records based on search text
  const filteredRecords = useMemo(() => {
    if (!toolState.filterText) return toolState.records;

    return toolState.records.filter((record) =>
      JSON.stringify(record.data).toLowerCase().includes(toolState.filterText.toLowerCase())
    );
  }, [toolState.records, toolState.filterText]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Database className="h-12 w-12" />
        <div>
          <h1 className="text-3xl font-bold">IndexedDB CRUD</h1>
          <p className="text-muted-foreground">Manage IndexedDB databases and records</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-6">
          <DatabaseSelector
            databases={toolState.databases}
            selectedDatabase={toolState.selectedDatabase}
            selectedStore={toolState.selectedStore}
            onDatabaseChange={handleDatabaseChange}
            onStoreChange={handleStoreChange}
            onCreateDatabase={handleCreateDatabase}
          />

          <AddRecordForm
            selectedStore={toolState.selectedStore}
            jsonInput={jsonInput}
            onJsonInputChange={setJsonInput}
            onAddRecord={handleAddRecord}
          />
        </div>

        {toolState.selectedStore && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter records..."
              value={toolState.filterText}
              onChange={(e) => setToolState({ filterText: e.target.value })}
              className="pl-9"
            />
          </div>
        )}

        <RecordsTable
          records={filteredRecords}
          selectedStore={toolState.selectedStore}
          onDeleteRecord={handleDeleteRecord}
          onUpdateRecord={handleUpdateRecord}
        />
      </div>
    </div>
  );
};
