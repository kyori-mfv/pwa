import { useToolsStore } from "@/app/store/tools-store";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { X } from "lucide-react";
import type React from "react";

export const AppShell: React.FC = () => {
  const { activeTools, currentTool, openTool, closeTool, setCurrentTool, getAvailableTools } =
    useToolsStore();
  const availableTools = getAvailableTools();
  const currentToolInstance = activeTools.find((tool) => tool.id === currentTool);

  const CurrentToolComponent = currentToolInstance?.plugin.component;
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Developer Tools PWA</h1>

          {/* Tool Tabs */}
          <div className="flex gap-2">
            {activeTools.map((tool) => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentTool(tool.id)}
                className="relative pr-8"
              >
                {tool.plugin.metadata.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTool(tool.id);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Available Tools</h2>
            <Separator className="mb-4" />
            <div className="space-y-2">
              {availableTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="p-0 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => openTool(tool.id)}
                >
                  <div className="p-3">
                    <div className="font-medium text-sm">{tool.metadata.name}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {tool.metadata.description}
                    </div>
                  </div>
                </Card>
              ))}
              {availableTools.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No tools available yet
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {CurrentToolComponent ? (
            <div className="p-6">
              <CurrentToolComponent />
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
      </div>
    </div>
  );
};
