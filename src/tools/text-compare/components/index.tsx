import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import type React from "react";
import {
  CharacterComparisonStrategy,
  type ComparisonResult,
  LineComparisonStrategy,
  SideBySideComparisonStrategy,
  WordComparisonStrategy,
} from "../strategies";
import { ComparisonControls } from "./comparison-controls";
import { InputPanel } from "./input-panel";
import { OutputPanel } from "./output-panel";

const strategies = [
  new LineComparisonStrategy(),
  new CharacterComparisonStrategy(),
  new WordComparisonStrategy(),
  new SideBySideComparisonStrategy(),
];

interface TextCompareState extends Record<string, unknown> {
  textA: string;
  textB: string;
  result: ComparisonResult | null;
  selectedStrategyName: string;
}

export const TextCompare: React.FC<ToolComponentProps> = ({ instanceId }) => {
  const [toolState, setToolState] = useToolState<TextCompareState>(instanceId, {
    textA: "",
    textB: "",
    result: null,
    selectedStrategyName: strategies[0].name,
  });

  const selectedStrategy =
    strategies.find((s) => s.name === toolState.selectedStrategyName) || strategies[0];

  const handleCompare = () => {
    if (!toolState.textA.trim() && !toolState.textB.trim()) return;

    try {
      const result = selectedStrategy.compare(toolState.textA, toolState.textB);
      setToolState({ result });
    } catch (error) {
      const errorResult: ComparisonResult = {
        unified: `Error during comparison: ${error instanceof Error ? error.message : "Unknown error"}`,
        additions: 0,
        deletions: 0,
        changes: 0,
        identical: false,
      };
      setToolState({ result: errorResult });
    }
  };

  const handleCopy = async () => {
    if (toolState.result?.unified) {
      await navigator.clipboard.writeText(toolState.result.unified);
    }
  };

  const handleClearResult = () => {
    setToolState({ result: null });
  };

  const isCompareDisabled = !toolState.textA.trim() && !toolState.textB.trim();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputPanel
          title="Text A (Original)"
          value={toolState.textA}
          placeholder="Paste or type the first text to compare..."
          onChange={(value) => setToolState({ textA: value })}
          onClear={() => setToolState({ textA: "" })}
        />

        <InputPanel
          title="Text B (Modified)"
          value={toolState.textB}
          placeholder="Paste or type the second text to compare..."
          onChange={(value) => setToolState({ textB: value })}
          onClear={() => setToolState({ textB: "" })}
        />
      </div>

      <ComparisonControls
        strategies={strategies}
        selectedStrategy={selectedStrategy}
        onStrategyChange={(value) => setToolState({ selectedStrategyName: value })}
        onCompare={handleCompare}
        onCopy={handleCopy}
        disabled={isCompareDisabled}
      />

      <OutputPanel
        result={toolState.result}
        strategyName={selectedStrategy.name}
        onCopy={handleCopy}
        onClear={handleClearResult}
      />
    </div>
  );
};
