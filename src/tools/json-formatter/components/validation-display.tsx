import { AlertCircle, CheckCircle } from "lucide-react";
import type React from "react";

interface ValidationResult {
  valid: boolean;
  error?: string;
  lineNumber?: number;
}

interface ValidationDisplayProps {
  validation: ValidationResult | null;
}

export const ValidationDisplay: React.FC<ValidationDisplayProps> = ({ validation }) => {
  if (!validation) return null;

  return (
    <div
      className={`mt-4 flex items-start gap-2 p-3 rounded-md ${
        validation.valid
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {validation.valid ? (
        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      )}
      <div className="text-sm">
        {validation.valid ? (
          "Valid JSON"
        ) : (
          <div>
            <div className="font-medium">Invalid JSON</div>
            {validation.error && <div className="mt-1">{validation.error}</div>}
            {validation.lineNumber && <div className="mt-1">Line: {validation.lineNumber}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
