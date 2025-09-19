import { Database } from "lucide-react";
import type React from "react";

export const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Database className="h-12 w-12" />
      <div>
        <h1 className="text-3xl font-bold">IndexedDB CRUD</h1>
        <p className="text-muted-foreground">Manage IndexedDB databases and records</p>
      </div>
    </div>
  );
};
