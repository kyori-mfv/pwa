import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Progress } from "@/shared/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { AlertCircle, Download, FileText, Trash2, Upload } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ExpenseDB } from "../../services/database";
import {
  downloadFile,
  exportToCSV,
  exportToJSON,
  generateExportFilename,
  importFromCSV,
  importFromJSON,
} from "../../services/import-export";
import type { ExpenseRecord, ExportOptions, ImportResult } from "../../types";

interface ImportExportActionsProps {
  expenses: ExpenseRecord[];
  onImportComplete?: (result: ImportResult) => void;
}

export const ImportExportActions: React.FC<ImportExportActionsProps> = ({
  expenses,
  onImportComplete,
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "json",
    includeAll: true,
  });
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [totalExpenseCount, setTotalExpenseCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load total expense count when export or cleanup dialog opens
  useEffect(() => {
    if (isExportDialogOpen || isCleanupDialogOpen) {
      const loadTotalCount = async () => {
        try {
          const result = await ExpenseDB.searchExpenses({
            limit: 10000, // Get all expenses to count them
          });
          setTotalExpenseCount(result.total);
        } catch (error) {
          console.error("Failed to load total expense count:", error);
          setTotalExpenseCount(0);
        }
      };
      loadTotalCount();
    }
  }, [isExportDialogOpen, isCleanupDialogOpen]);

  const handleExport = async () => {
    try {
      // Get ALL expenses from database for export
      const allExpensesResult = await ExpenseDB.searchExpenses({
        limit: 10000, // Large number to get all expenses
      });
      const allExpenses = allExpensesResult.expenses;

      let content: string;
      let contentType: string;

      if (exportOptions.format === "json") {
        content = exportToJSON(allExpenses, exportOptions);
        contentType = "application/json";
      } else {
        content = exportToCSV(allExpenses, exportOptions);
        contentType = "text/csv";
      }

      const filename = generateExportFilename(exportOptions);
      downloadFile(content, filename, contentType);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);
    setImportError(null);

    try {
      const content = await file.text();
      setImportProgress(30);

      let result: ImportResult;
      if (file.name.endsWith(".json")) {
        result = await importFromJSON(content);
      } else if (file.name.endsWith(".csv")) {
        result = await importFromCSV(content);
      } else {
        throw new Error("Unsupported file format. Please use JSON or CSV files.");
      }

      setImportProgress(60);

      // Import valid expenses to database
      if (result.valid > 0) {
        for (const expense of result.expenses) {
          await ExpenseDB.addExpense(expense);
        }
      }

      setImportProgress(100);
      setImportResult(result);
      onImportComplete?.(result);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import failed");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const resetImportDialog = () => {
    setImportProgress(0);
    setImportResult(null);
    setImportError(null);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCleanupAll = async () => {
    setIsCleaningUp(true);
    try {
      const deletedCount = await ExpenseDB.clearAllExpenses();
      console.log(`Deleted ${deletedCount} expenses`);

      // Notify parent to refresh data
      onImportComplete?.({ total: 0, valid: 0, invalid: 0, expenses: [] });

      setIsCleanupDialogOpen(false);
    } catch (error) {
      console.error("Failed to clear expenses:", error);
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Cleanup/Clear All Dialog */}
      <Dialog open={isCleanupDialogOpen} onOpenChange={setIsCleanupDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa tất cả dữ liệu chi tiêu</DialogTitle>
            <DialogDescription>
              ⚠️ Hành động này sẽ xóa vĩnh viễn tất cả {totalExpenseCount} giao dịch chi tiêu. Bạn có
              chắc chắn muốn tiếp tục không?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div className="font-medium">Cảnh báo quan trọng</div>
              </div>
              <div className="text-destructive text-sm mt-2">
                • Tất cả {totalExpenseCount} giao dịch sẽ bị xóa vĩnh viễn
                <br />• Không thể hoàn tác hành động này
                <br />• Khuyến nghị xuất dữ liệu trước khi xóa
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCleanupDialogOpen(false)}
                disabled={isCleaningUp}
              >
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleCleanupAll} disabled={isCleaningUp}>
                {isCleaningUp ? (
                  <>Đang xóa...</>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa tất cả
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xuất dữ liệu chi tiêu</DialogTitle>
            <DialogDescription>
              Chọn định dạng và các tùy chọn để xuất dữ liệu chi tiêu của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Định dạng file</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: "json" | "csv") =>
                  setExportOptions((prev) => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      JSON (đầy đủ dữ liệu)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV (dành cho Excel)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Sẽ xuất {totalExpenseCount} giao dịch chi tiêu (tất cả dữ liệu)
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Xuất file
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={isImportDialogOpen}
        onOpenChange={(open) => {
          setIsImportDialogOpen(open);
          if (!open) resetImportDialog();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Nhập dữ liệu
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nhập dữ liệu chi tiêu</DialogTitle>
            <DialogDescription>
              Chọn file JSON hoặc CSV để nhập dữ liệu chi tiêu vào ứng dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!isImporting && !importResult && !importError && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="import-file">Chọn file</Label>
                  <Input
                    ref={fileInputRef}
                    id="import-file"
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Hỗ trợ file .json và .csv
                  </div>
                </div>

                <div className="bg-muted border border-border rounded-lg p-3">
                  <div className="text-sm text-foreground space-y-2">
                    <div className="font-medium">📋 Định dạng file JSON</div>
                    <div className="bg-card border border-border rounded p-2 text-xs font-mono">
                      {`{
  "expenses": [
    {
      "amount": 50000,
      "category": "Ăn uống",
      "description": "Cà phê sáng",
      "date": "2025-12-15",
      "originalInput": "cà phê 50k"
    }
  ]
}`}
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div className="font-medium text-foreground">Lưu ý quan trọng:</div>
                      <div>• Danh mục: "Ăn uống", "Du lịch", "Gia đình", "Sức khỏe", v.v.</div>
                      <div>• Ngày: YYYY-MM-DD (2025-12-15)</div>
                      <div>• Số tiền: 50000 (không dùng "50k")</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <Label>Đang nhập dữ liệu...</Label>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}

            {importResult && (
              <div className="space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">Kết quả nhập dữ liệu:</div>
                      <div>• Tổng số: {importResult.total}</div>
                      <div>• Thành công: {importResult.valid}</div>
                      <div>• Thất bại: {importResult.invalid}</div>
                    </div>
                  </AlertDescription>
                </Alert>
                <Button className="w-full" onClick={() => setIsImportDialogOpen(false)}>
                  Hoàn thành
                </Button>
              </div>
            )}

            {importError && (
              <div className="space-y-3">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{importError}</AlertDescription>
                </Alert>
                <Button variant="outline" className="w-full" onClick={resetImportDialog}>
                  Thử lại
                </Button>
              </div>
            )}

            {!isImporting && !importResult && !importError && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
