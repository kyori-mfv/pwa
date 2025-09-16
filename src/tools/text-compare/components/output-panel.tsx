import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { ComparisonResult } from "../strategies";

interface OutputPanelProps {
  result: ComparisonResult | null;
  strategyName: string;
  onCopy: () => void;
  onClear: () => void;
}

export const OutputPanel = ({ result, strategyName, onCopy, onClear }: OutputPanelProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Comparison Result</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View highlighted differences and statistics between the texts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCopy} disabled={!result?.unified}>
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={onClear} disabled={!result?.unified}>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {result ? (
          <>
            {/* Statistics */}
            {result.identical ? (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="text-2xl text-green-600">✅</div>
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Texts are identical
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-4 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-md">
                  <span className="w-2 h-2 bg-destructive rounded-full" />
                  {result.deletions} removed
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {result.additions} added
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {result.changes} changes
                </div>
              </div>
            )}

            {/* Diff Content */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted px-3 py-2 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  {strategyName} Comparison
                </span>
              </div>
              <div className="max-h-96 overflow-auto">
                {strategyName === "Side-by-side" ? (
                  <SideBySideDiff content={result.unified} />
                ) : (
                  <UnifiedDiff content={result.unified} strategyName={strategyName} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center space-y-2">
              <div className="text-4xl text-muted-foreground">📋</div>
              <p className="text-muted-foreground">
                Click "Compare" to see the differences between your texts
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SideBySideDiff = ({ content }: { content: string }) => {
  const lines = content.split("\n").slice(2); // Skip header lines

  return (
    <div className="font-mono text-sm">
      {lines.map((line, lineIndex) => {
        const parts = line.split(" | ");
        const leftSide = parts[0] || "";
        const rightSide = parts[1] || "";

        let lineClass = "border-b border-border";
        if (rightSide.includes("[CHANGED]")) {
          lineClass += " bg-primary/10";
        } else if (rightSide.includes("[DELETED]")) {
          lineClass += " bg-destructive/10";
        } else if (rightSide.includes("[ADDED]")) {
          lineClass += " bg-green-50 dark:bg-green-900/20";
        }

        return (
          <div
            key={`side-line-${lineIndex}-${leftSide.slice(0, 10)}`}
            className={`grid grid-cols-2 ${lineClass}`}
          >
            <div className="p-3 border-r border-border">{leftSide.padEnd(30)}</div>
            <div className="p-3">
              {rightSide
                .replace(" [CHANGED]", "")
                .replace(" [DELETED]", "")
                .replace(" [ADDED]", "")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const UnifiedDiff = ({ content, strategyName }: { content: string; strategyName: string }) => {
  const renderContent = () => {
    if (strategyName === "Character-level") {
      return renderCharacterDiff(content);
    }
    if (strategyName === "Word-level") {
      return renderWordDiff(content);
    }
    return renderLineDiff(content);
  };

  return <div className="font-mono text-sm">{renderContent()}</div>;
};

const renderCharacterDiff = (content: string) => {
  const parts: JSX.Element[] = [];
  let index = 0;

  // Use split and filter approach instead of regex exec
  const segments = content.split(/(\[-[^\]]*-\]|\[\+[^\]]*\+\])/g);

  for (const segment of segments) {
    if (segment === "") continue;

    if (segment.startsWith("[-") && segment.endsWith("-]")) {
      // Removed text
      const text = segment.slice(2, -2);
      parts.push(
        <span key={`char-del-${index++}`} className="bg-destructive/20 text-destructive px-1">
          {text}
        </span>
      );
    } else if (segment.startsWith("[+") && segment.endsWith("+]")) {
      // Added text
      const text = segment.slice(2, -2);
      parts.push(
        <span
          key={`char-add-${index++}`}
          className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-1"
        >
          {text}
        </span>
      );
    } else {
      // Unchanged text
      if (segment) {
        parts.push(
          <span key={`char-unchanged-${index++}`} className="text-foreground">
            {segment}
          </span>
        );
      }
    }
  }

  return <div className="p-4 whitespace-pre-wrap">{parts}</div>;
};

const renderWordDiff = (content: string) => {
  const parts: JSX.Element[] = [];
  let index = 0;

  // Use split and filter approach instead of regex exec
  const segments = content.split(/(\{-[^}]*-\}|\{\+[^}]*\+\})/g);

  for (const segment of segments) {
    if (segment === "") continue;

    if (segment.startsWith("{-") && segment.endsWith("-}")) {
      // Removed text
      const text = segment.slice(2, -2);
      parts.push(
        <span
          key={`word-del-${index++}`}
          className="bg-destructive/20 text-destructive px-1 rounded"
        >
          {text}
        </span>
      );
    } else if (segment.startsWith("{+") && segment.endsWith("+}")) {
      // Added text
      const text = segment.slice(2, -2);
      parts.push(
        <span
          key={`word-add-${index++}`}
          className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-1 rounded"
        >
          {text}
        </span>
      );
    } else {
      // Unchanged text
      if (segment) {
        parts.push(
          <span key={`word-unchanged-${index++}`} className="text-foreground">
            {segment}
          </span>
        );
      }
    }
  }

  return <div className="p-4 whitespace-pre-wrap">{parts}</div>;
};

const renderLineDiff = (content: string) => {
  const lines = content.split("\n");

  return (
    <div>
      {lines.map((line, lineIndex) => {
        let lineClass = "p-3 border-b border-border";
        let prefix = "";
        let content = line;

        if (line.startsWith("+ ")) {
          lineClass += " bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
          prefix = "+";
          content = line.slice(2);
        } else if (line.startsWith("- ")) {
          lineClass += " bg-destructive/10 text-destructive";
          prefix = "-";
          content = line.slice(2);
        } else if (line.startsWith("  ")) {
          lineClass += " text-foreground";
          content = line.slice(2);
        }

        return (
          <div key={`line-${lineIndex}-${line.slice(0, 10)}`} className={lineClass}>
            <span className="inline-block w-6 text-center font-bold">{prefix}</span>
            {content}
          </div>
        );
      })}
    </div>
  );
};
