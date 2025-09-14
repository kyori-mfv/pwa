import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";
import { Edit3, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { RecordData } from "../types";

interface RecordsTableProps {
  records: RecordData[];
  selectedStore: string;
  onDeleteRecord: (recordData: unknown) => void;
  onUpdateRecord: (recordData: Record<string, unknown>) => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  selectedStore,
  onDeleteRecord,
  onUpdateRecord,
}) => {
  const [editingId, setEditingId] = useState<unknown>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (record: RecordData) => {
    setEditingId(record.id);
    setEditValue(JSON.stringify(record.data, null, 2));
  };

  const handleSave = () => {
    try {
      const updatedData = JSON.parse(editValue);
      onUpdateRecord(updatedData);
      setEditingId(null);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Records ({records.length})</CardTitle>
        <CardDescription>View and manage records</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={String(record.id)}>
                    <TableCell>
                      {editingId === record.id ? (
                        <Textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="min-h-20 font-mono text-xs"
                        />
                      ) : (
                        JSON.stringify(record.data, null, 2)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        {editingId === record.id ? (
                          <>
                            <Button size="icon" onClick={handleSave}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="icon" onClick={handleCancel}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" onClick={() => handleEdit(record)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => onDeleteRecord(record.data)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {selectedStore ? "No records found" : "Select an object store"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
