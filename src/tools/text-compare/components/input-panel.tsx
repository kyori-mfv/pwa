import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";

interface InputPanelProps {
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const InputPanel = ({ title, value, placeholder, onChange, onClear }: InputPanelProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="outline" size="sm" onClick={onClear} disabled={!value.trim()}>
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[300px] font-mono text-sm resize-y"
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded shadow-sm">
            {value.split("\n").length} lines • {value.length} chars
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
