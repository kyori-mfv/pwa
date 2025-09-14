import { Toaster } from "@/shared/components/ui/sonner";
import type React from "react";
import { AppHeader } from "./app-header";
import { MainContent } from "./main-content";
import { ToolSidebar } from "./tool-sidebar";

export const AppShell: React.FC = () => {
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
