import { useToolsStore } from "@/app/store/tools-store";
import type React from "react";
import { ToolRenderer } from "./tool-renderer";

export const AppBody: React.FC = () => {
  const { activeTools, currentTool } = useToolsStore();

  const currentToolInstance = activeTools.find((tool) => tool.id === currentTool);
  const HeaderComponent = currentToolInstance?.plugin.header;

  return (
    <main className="flex-1 overflow-auto">
      {currentToolInstance ? (
        <>
          {HeaderComponent && (
            <div className="px-6 pt-6">
              <HeaderComponent />
            </div>
          )}
          <ToolRenderer
            key={currentToolInstance.id}
            instanceId={currentToolInstance.id}
            component={currentToolInstance.plugin.body}
          />
        </>
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
