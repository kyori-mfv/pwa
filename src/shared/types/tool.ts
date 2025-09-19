import type React from "react";

export interface ToolMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  version?: string;
  icon?: string;
}

export interface ToolComponentProps {
  instanceId: string;
}

export interface ToolPlugin {
  id: string;
  metadata: ToolMetadata;
  body: React.ComponentType<ToolComponentProps>;
  header?: React.ComponentType;
}

export interface ToolInstance {
  id: string;
  plugin: ToolPlugin;
  active: boolean;
  state?: Record<string, unknown>;
  lastAccessed?: number;
}

export interface ToolStateManager {
  getState(instanceId: string): Record<string, unknown> | undefined;
  setState(instanceId: string, state: Record<string, unknown>): void;
  clearState(instanceId: string): void;
}
