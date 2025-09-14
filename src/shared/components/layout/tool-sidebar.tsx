import { useToolsStore } from "@/app/store/tools-store";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import type React from "react";

export const ToolSidebar: React.FC = () => {
  const { openTool, getAvailableTools } = useToolsStore();
  const availableTools = getAvailableTools();

  return (
    <aside className="w-64 border-r bg-sidebar">
      <div className="p-4 space-y-3">
        {availableTools.map((tool) => (
          <Card
            key={tool.id}
            className="p-0 cursor-pointer transition-colors hover:bg-sidebar-accent"
            onClick={() => openTool(tool.id)}
          >
            <div className="p-3">
              <div className="font-medium text-sm">{tool.metadata.name}</div>
              <div className="text-muted-foreground text-xs mt-1">{tool.metadata.description}</div>
            </div>
          </Card>
        ))}
        {availableTools.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No tools available yet
          </div>
        )}
      </div>
    </aside>
  );
};
