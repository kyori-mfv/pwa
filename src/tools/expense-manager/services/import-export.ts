import type { ExpenseRecord, ExportOptions, ImportResult } from "../types";

/**
 * Export expenses to JSON format (compatible with Vietnamese expense template)
 */
export const exportToJSON = (
  expenses: ExpenseRecord[],
  options: ExportOptions = { format: "json" }
): string => {
  const filteredExpenses = filterExpensesByOptions(expenses, options);

  const exportData = {
    expenses: filteredExpenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date.toISOString().split("T")[0], // YYYY-MM-DD format
      originalInput: expense.originalInput || "",
    })),
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Export expenses to CSV format
 */
export const exportToCSV = (
  expenses: ExpenseRecord[],
  options: ExportOptions = { format: "csv" }
): string => {
  const filteredExpenses = filterExpensesByOptions(expenses, options);

  const headers = ["Date", "Amount", "Category", "Description", "Original Input"];
  const csvRows = [
    headers.join(","),
    ...filteredExpenses.map((expense) =>
      [
        expense.date.toISOString().split("T")[0], // Date only
        expense.amount.toString(),
        `"${expense.category}"`,
        `"${expense.description}"`,
        `"${expense.originalInput || ""}"`,
      ].join(",")
    ),
  ];

  return csvRows.join("\n");
};

/**
 * Download file with given content and filename
 */
export const downloadFile = (content: string, filename: string, contentType: string): void => {
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

/**
 * Generate filename for export based on options
 */
export const generateExportFilename = (options: ExportOptions): string => {
  const timestamp = new Date().toISOString().split("T")[0];
  const format = options.format;
  let filename = `expenses_${timestamp}`;

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

/**
 * Import expenses from JSON format (compatible with Vietnamese expense template)
 */
export const importFromJSON = async (jsonContent: string): Promise<ImportResult> => {
  try {
    const data = JSON.parse(jsonContent);

    if (!data.expenses || !Array.isArray(data.expenses)) {
      throw new Error("Invalid JSON format: expenses array not found");
    }

    const validExpenses: ExpenseRecord[] = [];
    let invalidCount = 0;

    for (const item of data.expenses) {
      try {
        // Convert template format to internal format
        const expense = {
          amount: item.amount,
          category: item.category,
          description: item.description,
          date: item.date, // Will be parsed by validateAndParseExpense
          originalInput: item.originalInput,
        };

        const validatedExpense = validateAndParseExpense(expense);
        validExpenses.push(validatedExpense);
      } catch (error) {
        console.warn("Failed to parse expense item:", item, error);
        invalidCount++;
      }
    }

    return {
      total: data.expenses.length,
      valid: validExpenses.length,
      invalid: invalidCount,
      expenses: validExpenses,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Import expenses from CSV format
 */
export const importFromCSV = async (csvContent: string): Promise<ImportResult> => {
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

  const validExpenses: ExpenseRecord[] = [];
  let invalidCount = 0;

  for (let i = 0; i < dataLines.length; i++) {
    try {
      const row = parseCSVRow(dataLines[i]);

      const expense: Omit<ExpenseRecord, "id" | "createdAt" | "updatedAt"> = {
        date: new Date(row[dateIndex]),
        amount: Number.parseFloat(row[amountIndex]),
        category: row[categoryIndex].replace(/"/g, ""),
        description: row[descriptionIndex].replace(/"/g, ""),
        type: "expense",
        originalInput:
          originalInputIndex >= 0 ? row[originalInputIndex]?.replace(/"/g, "") : undefined,
      };

      const validatedExpense = validateAndParseExpense(expense);
      validExpenses.push(validatedExpense);
    } catch {
      invalidCount++;
    }
  }

  return {
    total: dataLines.length,
    valid: validExpenses.length,
    invalid: invalidCount,
    expenses: validExpenses,
  };
};

/**
 * Filter expenses based on export options
 */
const filterExpensesByOptions = (
  expenses: ExpenseRecord[],
  options: ExportOptions
): ExpenseRecord[] => {
  let filtered = [...expenses];

  // Filter by date range
  if (options.dateRange) {
    const { start, end } = options.dateRange;
    filtered = filtered.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }

  // Filter by categories
  if (options.categories && options.categories.length > 0) {
    filtered = filtered.filter(
      (expense) => options.categories?.includes(expense.category) ?? false
    );
  }

  return filtered;
};

/**
 * Validate and parse expense data
 */
const validateAndParseExpense = (item: unknown): ExpenseRecord => {
  const expense = item as Record<string, unknown>;

  if (!expense.amount || typeof expense.amount !== "number" || expense.amount <= 0) {
    throw new Error("Invalid amount");
  }

  if (!expense.category || typeof expense.category !== "string") {
    throw new Error("Invalid category");
  }

  if (!expense.description || typeof expense.description !== "string") {
    throw new Error("Invalid description");
  }

  if (!expense.date) {
    throw new Error("Invalid date");
  }

  // Handle both YYYY-MM-DD format and ISO datetime format
  let date: Date;
  if (typeof expense.date === "string") {
    // If it's a date-only string (YYYY-MM-DD), treat it as UTC to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(expense.date)) {
      date = new Date(`${expense.date}T00:00:00Z`);
    } else {
      date = new Date(expense.date);
    }
  } else {
    date = expense.date as Date;
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const now = new Date();
  return {
    id: (expense.id as string) || crypto.randomUUID(),
    amount: expense.amount as number,
    category: (expense.category as string).trim(),
    description: (expense.description as string).trim(),
    date,
    type: "expense",
    originalInput: (expense.originalInput as string) || undefined,
    createdAt: expense.createdAt ? new Date(expense.createdAt as string | Date) : now,
    updatedAt: expense.updatedAt ? new Date(expense.updatedAt as string | Date) : now,
  };
};

/**
 * Find column index by possible names
 */
const findColumnIndex = (headers: string[], possibleNames: string[], optional = false): number => {
  for (const name of possibleNames) {
    const index = headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));
    if (index !== -1) return index;
  }
  return optional ? -1 : -1;
};

/**
 * Parse CSV row handling quoted values
 */
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
