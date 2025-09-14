import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type React from "react";
import type { FormattingStrategy } from "../strategies";

interface FormatControlsProps {
  selectedStrategy: FormattingStrategy;
  strategies: FormattingStrategy[];
  onStrategyChange: (strategyName: string) => void;
}

export const FormatControls: React.FC<FormatControlsProps> = ({
  selectedStrategy,
  strategies,
  onStrategyChange,
}) => {
  return (
    <Select value={selectedStrategy.name} onValueChange={onStrategyChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {strategies.map((strategy) => (
            <SelectItem key={strategy.name} value={strategy.name}>
              {strategy.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
