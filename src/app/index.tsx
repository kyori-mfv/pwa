import { AppHeader } from "@/shared/components/layout/app-header";
import { MainContent } from "@/shared/components/layout/main-content";
import { ToolSidebar } from "@/shared/components/layout/tool-sidebar";
import { Toaster } from "@/shared/components/ui/sonner";
import type React from "react";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="flex h-[calc(100vh-73px)]">
        <ToolSidebar />
        <MainContent />
      </div>
      <Toaster richColors />
    </div>
  );
};
