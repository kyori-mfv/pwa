import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import type React from "react";
import {
  CompactFormatStrategy,
  MinifiedFormatStrategy,
  PrettyFormatStrategy,
  TabFormatStrategy,
} from "../strategies";
import { Header } from "./header";
import { InputPanel } from "./input-panel";
import { OutputPanel } from "./output-panel";

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

interface JsonFormatterState extends Record<string, unknown> {
  input: string;
  output: string;
  selectedStrategyName: string;
  validation: ValidationResult | null;
}

export const JsonFormatter: React.FC<ToolComponentProps> = ({ instanceId }) => {
  const [toolState, setToolState] = useToolState<JsonFormatterState>(instanceId, {
    input: "",
    output: "",
    selectedStrategyName: strategies[0].name,
    validation: null,
  });

  const selectedStrategy =
    strategies.find((s) => s.name === toolState.selectedStrategyName) || strategies[0];

  const handleFormat = () => {
    if (!toolState.input.trim()) return;

    try {
      const result = selectedStrategy.format(toolState.input);
      setToolState({ output: result, validation: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format";
      setToolState({ validation: { valid: false, error: errorMessage } });
    }
  };

  const handleValidate = () => {
    if (!toolState.input.trim()) return;

    try {
      JSON.parse(toolState.input);
      setToolState({ validation: { valid: true } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON";
      setToolState({ validation: { valid: false, error: errorMessage } });
    }
  };

  const handleCopy = async () => {
    if (toolState.output) {
      await navigator.clipboard.writeText(toolState.output);
    }
  };

  const handleClear = () => {
    setToolState({ input: "", output: "", validation: null });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputPanel
          input={toolState.input}
          validation={toolState.validation}
          onInputChange={(value) => setToolState({ input: value })}
          onValidate={handleValidate}
          onClear={handleClear}
        />

        <OutputPanel
          output={toolState.output}
          selectedStrategy={selectedStrategy}
          strategies={strategies}
          onStrategyChange={(value) => setToolState({ selectedStrategyName: value })}
          onFormat={handleFormat}
          onCopy={handleCopy}
        />
      </div>
    </div>
  );
};
