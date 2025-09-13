import { commandManager } from "@/core/commands/command-manager";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { AlertCircle, CheckCircle, Copy, Redo, Undo } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { FormatCommand, ValidateCommand } from "./commands";
import {
  CompactFormatStrategy,
  type FormattingStrategy,
  MinifiedFormatStrategy,
  PrettyFormatStrategy,
  TabFormatStrategy,
} from "./strategies";

const strategies = [
  new PrettyFormatStrategy(),
  new CompactFormatStrategy(),
  new MinifiedFormatStrategy(),
  new TabFormatStrategy(),
];

interface ValidationResult {
  valid: boolean;
  error?: string;
  lineNumber?: number;
}

export const JsonFormatterComponent: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<FormattingStrategy>(strategies[0]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateUndoRedoState = () => {
    setCanUndo(commandManager.canUndo());
    setCanRedo(commandManager.canRedo());
  };

  const handleFormat = async () => {
    if (!input.trim()) return;

    const command = new FormatCommand({
      input,
      strategy: selectedStrategy,
      onResult: (result) => {
        setOutput(result);
        setValidation(null);
      },
      onUndo: (previousInput, previousOutput) => {
        setInput(previousInput);
        setOutput(previousOutput);
        setValidation(null);
      },
      onRedo: (redoInput, redoOutput) => {
        setInput(redoInput);
        setOutput(redoOutput);
        setValidation(null);
      },
    });

    // Store current output state before executing
    command.setPreviousOutput(output);

    const result = await commandManager.executeCommand(command);
    if (!result.success && result.error) {
      setValidation({ valid: false, error: result.error });
    }
    updateUndoRedoState();
  };

  const handleValidate = async () => {
    if (!input.trim()) return;

    const command = new ValidateCommand({
      input,
      onResult: (result) => {
        setValidation(result);
      },
    });

    await commandManager.executeCommand(command);
  };

  const handleUndo = async () => {
    await commandManager.undo();
    updateUndoRedoState();
  };

  const handleRedo = async () => {
    await commandManager.redo();
    updateUndoRedoState();
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setValidation(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">JSON Formatter</h1>
          <p className="text-muted-foreground">Format, validate, and beautify JSON data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Input JSON
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleValidate}>
                  Validate
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />

            {validation && (
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
                      {validation.lineNumber && (
                        <div className="mt-1">Line: {validation.lineNumber}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Formatted Output
              <div className="flex gap-2">
                <Select
                  value={selectedStrategy.name}
                  onValueChange={(value) => {
                    const strategy = strategies.find((s) => s.name === value);
                    if (strategy) setSelectedStrategy(strategy);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.name} value={strategy.name}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleFormat}>Format</Button>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Formatted JSON will appear here..."
              value={output}
              readOnly
              className="min-h-[400px] font-mono text-sm bg-muted/50"
            />

            {selectedStrategy && (
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>{selectedStrategy.name}:</strong> {selectedStrategy.description}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
