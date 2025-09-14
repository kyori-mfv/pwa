import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Database, Plus } from "lucide-react";

interface AddRecordFormProps {
  selectedStore: string;
  jsonInput: string;
  onJsonInputChange: (value: string) => void;
  onAddRecord: () => void;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({
  selectedStore,
  jsonInput,
  onJsonInputChange,
  onAddRecord,
}) => {
  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle>Add Record</CardTitle>
        <CardDescription>Create new record in selected store</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedStore ? (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Select a Database & Object Store</p>
            <p className="text-sm">Choose a database and object store to start adding records</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Record Data (JSON)</Label>
              <Textarea
                placeholder='{"name": "John", "age": 30}'
                value={jsonInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  onJsonInputChange(e.target.value);
                }}
                className="min-h-[108px]"
              />
            </div>

            <Button
              onClick={onAddRecord}
              disabled={!selectedStore || !jsonInput.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
