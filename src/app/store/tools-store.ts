import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolInstance, ToolPlugin } from "@/shared/types/tool";
import { create } from "zustand";

interface ToolsState {
  activeTools: ToolInstance[];
  currentTool: string | null;

  // Actions
  openTool: (pluginId: string) => void;
  closeTool: (instanceId: string) => void;
  setCurrentTool: (instanceId: string | null) => void;
  getAvailableTools: () => ToolPlugin[];
  saveToolState: (instanceId: string, state: Record<string, unknown>) => void;
  loadToolState: (instanceId: string) => Record<string, unknown> | undefined;
}

export const useToolsStore = create<ToolsState>((set) => ({
  activeTools: [],
  currentTool: null,

  openTool: (pluginId: string) => {
    const instance = toolRegistry.createInstance(pluginId);
    if (instance) {
      set((state) => ({
        activeTools: [...state.activeTools, instance],
        currentTool: instance.id,
      }));
    }
  },

  closeTool: (instanceId: string) => {
    toolRegistry.removeInstance(instanceId);
    set((state) => ({
      activeTools: state.activeTools.filter((tool) => tool.id !== instanceId),
      currentTool: state.currentTool === instanceId ? null : state.currentTool,
    }));
  },

  setCurrentTool: (instanceId: string | null) => {
    set({ currentTool: instanceId });
  },

  getAvailableTools: () => {
    return toolRegistry.getAllPlugins();
  },

  saveToolState: (instanceId: string, state: Record<string, unknown>) => {
    toolRegistry.setState(instanceId, state);
    // Update the store to trigger re-renders with latest instance state
    set((prevState) => ({
      activeTools: prevState.activeTools.map((tool) =>
        tool.id === instanceId ? { ...tool, state, lastAccessed: Date.now() } : tool
      ),
    }));
  },

  loadToolState: (instanceId: string) => {
    return toolRegistry.getState(instanceId);
  },
}));
