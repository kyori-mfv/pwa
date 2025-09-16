import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { ComparisonStrategy } from "../strategies";

interface ComparisonControlsProps {
  strategies: ComparisonStrategy[];
  selectedStrategy: ComparisonStrategy;
  onStrategyChange: (strategyName: string) => void;
  onCompare: () => void;
  onCopy: () => void;
  disabled: boolean;
}

const strategyIcons: Record<string, string> = {
  "Line-by-line": "📝",
  "Character-level": "🔤",
  "Word-level": "📖",
  "Side-by-side": "⚖️",
};

export const ComparisonControls = ({
  strategies,
  selectedStrategy,
  onStrategyChange,
  onCompare,
  onCopy,
  disabled,
}: ComparisonControlsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Comparison Algorithm</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose how to analyze and highlight differences between the two texts
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Algorithm Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {strategies.map((strategy) => {
              const isSelected = selectedStrategy.name === strategy.name;
              return (
                <Button
                  key={strategy.name}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-3 items-start justify-start whitespace-normal"
                  onClick={() => onStrategyChange(strategy.name)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {strategyIcons[strategy.name] || "🔧"}
                    </span>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm leading-tight">{strategy.name}</div>
                      <div className="text-xs opacity-70 mt-1 leading-relaxed break-words">
                        {strategy.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{selectedStrategy.name}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={onCompare} disabled={disabled}>
                Compare Texts
              </Button>
              <Button variant="outline" onClick={onCopy} disabled={!selectedStrategy}>
                Copy Result
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
