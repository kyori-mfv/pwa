import type React from "react";

export interface ToolMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  version?: string;
  icon?: string;
}

export interface ToolPlugin {
  id: string;
  metadata: ToolMetadata;
  component: React.ComponentType;
}

export interface ToolInstance {
  id: string;
  plugin: ToolPlugin;
  active: boolean;
}
