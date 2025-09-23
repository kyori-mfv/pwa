import { useToolsStore } from "@/app/store/tools-store";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { cn } from "@/shared/utils/cn";
import type React from "react";
import { useEffect } from "react";
import { ToolRenderer } from "./tool-renderer";

interface IndividualAppLayoutProps {
  appId: string;
}

export const IndividualAppLayout: React.FC<IndividualAppLayoutProps> = ({ appId }) => {
  const { activeTools, openTool, getAvailableTools } = useToolsStore();

  // Auto-open the specified app
  useEffect(() => {
    const existingInstance = activeTools.find((tool) => tool.plugin.id === appId);
    if (!existingInstance) {
      openTool(appId);
    }
  }, [activeTools, openTool, appId]);

  const appInstance = activeTools.find((tool) => tool.plugin.id === appId);
  const selectedApp = getAvailableTools().find((tool) => tool.id === appId);
  const HeaderComponent = selectedApp?.header;

  return (
    appInstance && (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Individual App Header */}
        <header className="border-b bg-primary backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div
              className={cn(
                "flex items-center gap-3",
                "[&_h1]:text-primary-foreground [&_h1]:text-xl",
                "[&_p]:text-primary-foreground/60 [&_p]:text-sm"
              )}
            >
              {HeaderComponent && <HeaderComponent />}
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* App Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <ToolRenderer
              key={appInstance.id}
              instanceId={appInstance.id}
              component={appInstance.plugin.body}
            />
          </div>
        </main>

        <Toaster richColors />
      </div>
    )
  );
};
