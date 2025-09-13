import { useToolsStore } from "@/app/store/tools-store";
import type React from "react";

export const MainContent: React.FC = () => {
  const { activeTools, currentTool } = useToolsStore();

  const currentToolInstance = activeTools.find((tool) => tool.id === currentTool);
  const CurrentToolComponent = currentToolInstance?.plugin.component;
  return (
    <main className="flex-1 overflow-auto">
      {CurrentToolComponent && currentToolInstance ? (
        <div className="p-6">
          <CurrentToolComponent key={currentToolInstance.id} instanceId={currentToolInstance.id} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Welcome to Developer Tools PWA</p>
            <p className="text-sm">Select a tool from the sidebar to get started</p>
          </div>
        </div>
      )}
    </main>
  );
};
