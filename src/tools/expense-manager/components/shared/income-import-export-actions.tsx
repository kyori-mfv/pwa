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
import { DatabaseAccess } from "../../services/database";
import * as IncomeService from "../../services/income-service";
import type { ExportOptions, IncomeRecord } from "../../types";

interface IncomeImportResult {
  total: number;
  valid: number;
  invalid: number;
  income: IncomeRecord[];
}

interface IncomeImportExportActionsProps {
  income: IncomeRecord[];
  onImportComplete?: (result: IncomeImportResult) => void;
}

export const IncomeImportExportActions: React.FC<IncomeImportExportActionsProps> = ({
  income,
  onImportComplete,
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "json",
    includeAll: true,
  });
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<IncomeImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [totalIncomeCount, setTotalIncomeCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load total income count when export or cleanup dialog opens
  useEffect(() => {
    if (isExportDialogOpen || isCleanupDialogOpen) {
      const loadTotalCount = async () => {
        try {
          const result = await IncomeService.searchIncome({
            limit: 10000, // Get all income to count them
          });
          setTotalIncomeCount(result.total);
        } catch (error) {
          console.error("Failed to load total income count:", error);
          setTotalIncomeCount(0);
        }
      };
      loadTotalCount();
    }
  }, [isExportDialogOpen, isCleanupDialogOpen]);

  const handleExport = async () => {
    try {
      // Get ALL income from database for export
      const allIncomeResult = await IncomeService.searchIncome({
        limit: 10000, // Large number to get all income
      });
      const allIncome = allIncomeResult.income;

      let content: string;
      let contentType: string;

      if (exportOptions.format === "json") {
        content = exportIncomeToJSON(allIncome, exportOptions);
        contentType = "application/json";
      } else {
        content = exportIncomeToCSV(allIncome, exportOptions);
        contentType = "text/csv";
      }

      const filename = generateIncomeExportFilename(exportOptions);
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

      let result: IncomeImportResult;
      if (file.name.endsWith(".json")) {
        result = await importIncomeFromJSON(content);
      } else if (file.name.endsWith(".csv")) {
        result = await importIncomeFromCSV(content);
      } else {
        throw new Error("Unsupported file format. Please use JSON or CSV files.");
      }

      setImportProgress(60);

      // Import valid income to database
      if (result.valid > 0) {
        for (const incomeRecord of result.income) {
          await IncomeService.addIncome(incomeRecord);
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
      const deletedCount = await IncomeService.clearAllIncome();
      console.log(`Deleted ${deletedCount} income records`);

      // Notify parent to refresh data
      onImportComplete?.({ total: 0, valid: 0, invalid: 0, income: [] });

      setIsCleanupDialogOpen(false);
    } catch (error) {
      console.error("Failed to clear income:", error);
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
            <DialogTitle>Xóa tất cả dữ liệu thu nhập</DialogTitle>
            <DialogDescription>
              ⚠️ Hành động này sẽ xóa vĩnh viễn tất cả {totalIncomeCount} giao dịch thu nhập. Bạn có
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
                • Tất cả {totalIncomeCount} giao dịch sẽ bị xóa vĩnh viễn
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
            <DialogTitle>Xuất dữ liệu thu nhập</DialogTitle>
            <DialogDescription>
              Chọn định dạng và các tùy chọn để xuất dữ liệu thu nhập của bạn.
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
              Sẽ xuất {totalIncomeCount} giao dịch thu nhập (tất cả dữ liệu)
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
            <DialogTitle>Nhập dữ liệu thu nhập</DialogTitle>
            <DialogDescription>
              Chọn file JSON hoặc CSV để nhập dữ liệu thu nhập vào ứng dụng.
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
  "income": [
    {
      "amount": 1000000,
      "category": "Lương",
      "description": "Lương tháng 12",
      "date": "2025-12-15",
      "originalInput": "lương 1 triệu"
    }
  ]
}`}
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div className="font-medium text-foreground">Lưu ý quan trọng:</div>
                      <div>• Danh mục: "Lương", "Thưởng", "Kinh doanh", "Đầu tư", v.v.</div>
                      <div>• Ngày: YYYY-MM-DD (2025-12-15)</div>
                      <div>• Số tiền: 1000000 (không dùng "1 triệu")</div>
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

// Income-specific export functions
const exportIncomeToJSON = (income: IncomeRecord[], options: ExportOptions): string => {
  const filteredIncome = filterIncomeByOptions(income, options);

  const exportData = {
    income: filteredIncome.map((incomeRecord) => ({
      amount: incomeRecord.amount,
      category: incomeRecord.category,
      description: incomeRecord.description,
      date: incomeRecord.date.toISOString().split("T")[0], // YYYY-MM-DD format
      originalInput: incomeRecord.originalInput || "",
    })),
  };

  return JSON.stringify(exportData, null, 2);
};

const exportIncomeToCSV = (income: IncomeRecord[], options: ExportOptions): string => {
  const filteredIncome = filterIncomeByOptions(income, options);

  const headers = ["Date", "Amount", "Category", "Description", "Original Input"];
  const csvRows = [
    headers.join(","),
    ...filteredIncome.map((incomeRecord) =>
      [
        incomeRecord.date.toISOString().split("T")[0], // Date only
        incomeRecord.amount.toString(),
        `"${incomeRecord.category}"`,
        `"${incomeRecord.description}"`,
        `"${incomeRecord.originalInput || ""}"`,
      ].join(",")
    ),
  ];

  return csvRows.join("\n");
};

const generateIncomeExportFilename = (options: ExportOptions): string => {
  const timestamp = new Date().toISOString().split("T")[0];
  const format = options.format;
  let filename = `income_${timestamp}`;

  if (options.dateRange) {
    const startDate = options.dateRange.start.toISOString().split("T")[0];
    const endDate = options.dateRange.end.toISOString().split("T")[0];
    filename += `_${startDate}_to_${endDate}`;
  }

  if (options.categories && options.categories.length > 0) {
    const categories = options.categories.join("_").replace(/[^a-zA-Z0-9_]/g, "");
    filename += `_${categories}`;
  }

  return `${filename}.${format}`;
};

const importIncomeFromJSON = async (jsonContent: string): Promise<IncomeImportResult> => {
  try {
    const data = JSON.parse(jsonContent);

    if (!data.income || !Array.isArray(data.income)) {
      throw new Error("Invalid JSON format: income array not found");
    }

    const validIncome: IncomeRecord[] = [];
    let invalidCount = 0;

    for (const item of data.income) {
      try {
        const incomeRecord = {
          amount: item.amount,
          category: item.category,
          description: item.description,
          date: item.date, // Will be parsed by validateAndParseIncome
          originalInput: item.originalInput,
        };

        const validatedIncome = validateAndParseIncome(incomeRecord);
        validIncome.push(validatedIncome);
      } catch (error) {
        console.warn("Failed to parse income item:", item, error);
        invalidCount++;
      }
    }

    return {
      total: data.income.length,
      valid: validIncome.length,
      invalid: invalidCount,
      income: validIncome,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const importIncomeFromCSV = async (csvContent: string): Promise<IncomeImportResult> => {
  const lines = csvContent.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("CSV must contain at least header and one data row");
  }

  const header = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const dataLines = lines.slice(1);

  // Find column indices
  const dateIndex = findColumnIndex(header, ["date", "Date"]);
  const amountIndex = findColumnIndex(header, ["amount", "Amount"]);
  const categoryIndex = findColumnIndex(header, ["category", "Category"]);
  const descriptionIndex = findColumnIndex(header, ["description", "Description"]);
  const originalInputIndex = findColumnIndex(
    header,
    ["original input", "Original Input", "originalinput"],
    true
  );

  if (dateIndex === -1 || amountIndex === -1 || categoryIndex === -1 || descriptionIndex === -1) {
    throw new Error("Required columns not found: Date, Amount, Category, Description");
  }

  const validIncome: IncomeRecord[] = [];
  let invalidCount = 0;

  for (let i = 0; i < dataLines.length; i++) {
    try {
      const row = parseCSVRow(dataLines[i]);

      const incomeRecord: Omit<IncomeRecord, "id" | "createdAt" | "updatedAt"> = {
        date: new Date(row[dateIndex]),
        amount: Number.parseFloat(row[amountIndex]),
        category: row[categoryIndex].replace(/"/g, ""),
        description: row[descriptionIndex].replace(/"/g, ""),
        type: "income",
        originalInput:
          originalInputIndex >= 0 ? row[originalInputIndex]?.replace(/"/g, "") : undefined,
      };

      const validatedIncome = validateAndParseIncome(incomeRecord);
      validIncome.push(validatedIncome);
    } catch {
      invalidCount++;
    }
  }

  return {
    total: dataLines.length,
    valid: validIncome.length,
    invalid: invalidCount,
    income: validIncome,
  };
};

const filterIncomeByOptions = (income: IncomeRecord[], options: ExportOptions): IncomeRecord[] => {
  let filtered = [...income];

  // Filter by date range
  if (options.dateRange) {
    const { start, end } = options.dateRange;
    filtered = filtered.filter((incomeRecord) => {
      const incomeDate = new Date(incomeRecord.date);
      return incomeDate >= start && incomeDate <= end;
    });
  }

  // Filter by categories
  if (options.categories && options.categories.length > 0) {
    filtered = filtered.filter(
      (incomeRecord) => options.categories?.includes(incomeRecord.category) ?? false
    );
  }

  return filtered;
};

const validateAndParseIncome = (item: unknown): IncomeRecord => {
  const incomeRecord = item as Record<string, unknown>;

  if (!incomeRecord.amount || typeof incomeRecord.amount !== "number" || incomeRecord.amount <= 0) {
    throw new Error("Invalid amount");
  }

  if (!incomeRecord.category || typeof incomeRecord.category !== "string") {
    throw new Error("Invalid category");
  }

  if (!incomeRecord.description || typeof incomeRecord.description !== "string") {
    throw new Error("Invalid description");
  }

  if (!incomeRecord.date) {
    throw new Error("Invalid date");
  }

  // Handle both YYYY-MM-DD format and ISO datetime format
  let date: Date;
  if (typeof incomeRecord.date === "string") {
    // If it's a date-only string (YYYY-MM-DD), treat it as UTC to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(incomeRecord.date)) {
      date = new Date(`${incomeRecord.date}T00:00:00Z`);
    } else {
      date = new Date(incomeRecord.date);
    }
  } else {
    date = incomeRecord.date as Date;
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const now = new Date();
  return {
    id: (incomeRecord.id as string) || crypto.randomUUID(),
    amount: incomeRecord.amount as number,
    category: (incomeRecord.category as string).trim(),
    description: (incomeRecord.description as string).trim(),
    date,
    type: "income",
    originalInput: (incomeRecord.originalInput as string) || undefined,
    createdAt: incomeRecord.createdAt ? new Date(incomeRecord.createdAt as string | Date) : now,
    updatedAt: incomeRecord.updatedAt ? new Date(incomeRecord.updatedAt as string | Date) : now,
  };
};

const findColumnIndex = (headers: string[], possibleNames: string[], optional = false): number => {
  for (const name of possibleNames) {
    const index = headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));
    if (index !== -1) return index;
  }
  return optional ? -1 : -1;
};

const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

const downloadFile = (content: string, filename: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
