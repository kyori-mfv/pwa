import { AppBody } from "@/shared/components/layout/app-body";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppSidebar } from "@/shared/components/layout/app-sidebar";
import { Toaster } from "@/shared/components/ui/sonner";
import type React from "react";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="flex h-[calc(100vh-73px)]">
        <AppSidebar />
        <AppBody />
      </div>
      <Toaster richColors />
    </div>
  );
};
