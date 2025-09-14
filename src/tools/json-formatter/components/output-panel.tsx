import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Copy } from "lucide-react";
import type React from "react";
import type { FormattingStrategy } from "../strategies";
import { FormatControls } from "./format-controls";

interface OutputPanelProps {
  output: string;
  selectedStrategy: FormattingStrategy;
  strategies: FormattingStrategy[];
  onStrategyChange: (strategyName: string) => void;
  onFormat: () => void;
  onCopy: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  selectedStrategy,
  strategies,
  onStrategyChange,
  onFormat,
  onCopy,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Formatted Output
          <div className="flex gap-2">
            <FormatControls
              selectedStrategy={selectedStrategy}
              strategies={strategies}
              onStrategyChange={onStrategyChange}
            />
            <Button onClick={onFormat}>Format</Button>
            <Button variant="outline" size="sm" onClick={onCopy} disabled={!output}>
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
  );
};
