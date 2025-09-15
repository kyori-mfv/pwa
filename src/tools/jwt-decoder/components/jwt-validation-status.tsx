import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { JwtValidationResult } from "../types";

interface JwtValidationStatusProps {
  validationResult: JwtValidationResult | null;
}

export function JwtValidationStatus({ validationResult }: JwtValidationStatusProps) {
  if (!validationResult) return null;

  const { isValidFormat, isExpired, errors } = validationResult;

  if (!isValidFormat) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invalid JWT</AlertTitle>
        <AlertDescription>{errors[0]}</AlertDescription>
      </Alert>
    );
  }

  if (errors.length > 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Validation Errors</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside">
            {errors.map((error: string) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Valid JWT Structure</AlertTitle>
      <AlertDescription>
        {isExpired ? "Token is expired but structure is valid" : "Token structure is valid"}
      </AlertDescription>
    </Alert>
  );
}
