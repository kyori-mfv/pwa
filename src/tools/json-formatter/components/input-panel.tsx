import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import type React from "react";
import { ValidationDisplay } from "./validation-display";

interface ValidationResult {
  valid: boolean;
  error?: string;
  lineNumber?: number;
}

interface InputPanelProps {
  input: string;
  validation: ValidationResult | null;
  onInputChange: (value: string) => void;
  onValidate: () => void;
  onClear: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  validation,
  onInputChange,
  onValidate,
  onClear,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Input JSON
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onValidate}>
              Validate
            </Button>
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your JSON here..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
        />
        <ValidationDisplay validation={validation} />
      </CardContent>
    </Card>
  );
};
