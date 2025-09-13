import type React from "react";
import { ToolTabs } from "./tool-tabs";

export const AppHeader: React.FC = () => {
  return (
    <header className="border-b border-border bg-sidebar">
      <div className="flex items-center justify-between gap-10 p-4">
        <h1 className="shrink-0 text-2xl font-bold">Developer Tools PWA</h1>
        <ToolTabs />
      </div>
    </header>
  );
};
