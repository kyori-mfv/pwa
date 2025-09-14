import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { DatabaseInfo } from "../types";
import { DatabaseManagementDialog } from "./database-management-dialog";
import { ObjectStoreManagementDialog } from "./object-store-management-dialog";

interface DatabaseSelectorProps {
  databases: DatabaseInfo[];
  selectedDatabase: string;
  selectedStore: string;
  onDatabaseChange: (database: string) => void;
  onStoreChange: (store: string) => void;
  onDeleteDatabase: (name: string) => Promise<void>;
  onDeleteObjectStore: (databaseName: string, name: string) => Promise<void>;
}

export const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({
  databases,
  selectedDatabase,
  selectedStore,
  onDatabaseChange,
  onStoreChange,
  onDeleteDatabase,
  onDeleteObjectStore,
}) => {
  const selectedDbInfo = databases.find((db) => db.name === selectedDatabase);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database</CardTitle>
        <CardDescription>Select or create a database</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Database</Label>
          <div className="flex items-center gap-2">
            <Select
              key={`databases-${databases.length}`}
              value={selectedDatabase}
              onValueChange={onDatabaseChange}
              disabled={databases.length === 0}
            >
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={
                    databases.length === 0 ? "No databases available" : "Choose database..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {databases.map((db) => (
                  <SelectItem key={db.name} value={db.name}>
                    {db.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDatabase && selectedDbInfo && (
              <DatabaseManagementDialog
                database={selectedDbInfo}
                onDeleteDatabase={onDeleteDatabase}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Object Stores</Label>
          <div className="flex gap-2">
            <Select
              value={selectedStore}
              onValueChange={onStoreChange}
              disabled={!selectedDbInfo || selectedDbInfo?.objectStores.length === 0}
            >
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={
                    !selectedDbInfo
                      ? "Select a database first"
                      : selectedDbInfo?.objectStores.length === 0
                        ? "No object stores in this database"
                        : "Choose store..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {selectedDbInfo?.objectStores.map((store) => (
                  <SelectItem key={store.name} value={store.name}>
                    {store.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
            {selectedStore &&
              selectedDbInfo &&
              (() => {
                const selectedStoreInfo = selectedDbInfo.objectStores.find(
                  (store) => store.name === selectedStore
                );
                return selectedStoreInfo ? (
                  <ObjectStoreManagementDialog
                    objectStore={selectedStoreInfo}
                    databaseName={selectedDbInfo.name}
                    onDeleteObjectStore={onDeleteObjectStore}
                  />
                ) : null;
              })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
