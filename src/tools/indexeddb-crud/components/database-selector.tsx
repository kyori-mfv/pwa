import { Button } from "@/shared/components/ui/button";
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
import { Plus } from "lucide-react";
import type { DatabaseInfo } from "../types";

interface DatabaseSelectorProps {
  databases: DatabaseInfo[];
  selectedDatabase: string;
  selectedStore: string;
  onDatabaseChange: (database: string) => void;
  onStoreChange: (store: string) => void;
  onCreateDatabase: () => void;
}

export const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({
  databases,
  selectedDatabase,
  selectedStore,
  onDatabaseChange,
  onStoreChange,
  onCreateDatabase,
}) => {
  const selectedDbInfo = databases.find((db) => db.name === selectedDatabase);

  return (
    <Card className="basis-2xs shrink-0">
      <CardHeader>
        <CardTitle>Database</CardTitle>
        <CardDescription>Select or create a database</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Database</Label>
          <Select
            value={selectedDatabase}
            onValueChange={onDatabaseChange}
            disabled={databases.length === 0}
          >
            <SelectTrigger className="w-full">
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
        </div>

        <Button onClick={onCreateDatabase} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Database
        </Button>

        <div className="space-y-2">
          <Label>Object Stores</Label>
          <Select
            value={selectedStore}
            onValueChange={onStoreChange}
            disabled={!selectedDbInfo || selectedDbInfo?.objectStores.length === 0}
          >
            <SelectTrigger className="w-full">
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
        </div>
      </CardContent>
    </Card>
  );
};
