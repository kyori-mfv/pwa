import { useToolsStore } from "@/app/store/tools-store";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type React from "react";

export const ToolTabs: React.FC = () => {
  const { activeTools, currentTool, closeTool, setCurrentTool } = useToolsStore();

  return (
    <div className="flex-grow flex gap-2 flex-wrap">
      {activeTools.map((tool) => (
        <div key={tool.id} className="relative inline-flex">
          <Button
            key={tool.id}
            variant={currentTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentTool(tool.id)}
            className="relative pr-8"
          >
            {tool.plugin.metadata.name}
          </Button>
          <Button
            variant={currentTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              closeTool(tool.id);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-4 w-4 p-0 hover:bg-destructive/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
