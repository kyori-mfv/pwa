import { useToolsStore } from "@/app/store/tools-store";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type React from "react";

export const ToolTabs: React.FC = () => {
  const { activeTools, currentTool, closeTool, setCurrentTool } = useToolsStore();

  return (
    <div className="flex gap-2 flex-wrap">
      {activeTools.map((tool) => (
        <Button
          key={tool.id}
          variant={currentTool === tool.id ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentTool(tool.id)}
          className="relative pr-8"
        >
          {tool.plugin.metadata.name}

          <X
            className="h-3 w-3"
            onClick={(e) => {
              e.stopPropagation();
              closeTool(tool.id);
            }}
          />
        </Button>
      ))}
    </div>
  );
};
