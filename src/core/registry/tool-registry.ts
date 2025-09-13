import type { ToolInstance, ToolPlugin, ToolStateManager } from "@/shared/types/tool";

export class ToolRegistry implements ToolStateManager {
  private plugins = new Map<string, ToolPlugin>();
  private instances = new Map<string, ToolInstance>();

  register(plugin: ToolPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  getPlugin(id: string): ToolPlugin | undefined {
    return this.plugins.get(id);
  }

  getAllPlugins(): ToolPlugin[] {
    return Array.from(this.plugins.values());
  }

  createInstance(pluginId: string): ToolInstance | null {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return null;

    const instance: ToolInstance = {
      id: `${pluginId}-${Date.now()}`,
      plugin,
      active: true,
      state: {},
      lastAccessed: Date.now(),
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  removeInstance(instanceId: string): void {
    this.instances.delete(instanceId);
  }

  getInstances(): ToolInstance[] {
    return Array.from(this.instances.values());
  }

  getInstance(instanceId: string): ToolInstance | undefined {
    return this.instances.get(instanceId);
  }

  // ToolStateManager implementation
  getState(instanceId: string): Record<string, unknown> | undefined {
    const instance = this.instances.get(instanceId);
    return instance?.state;
  }

  setState(instanceId: string, state: Record<string, unknown>): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.state = { ...state };
      instance.lastAccessed = Date.now();
    }
  }

  clearState(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.state = {};
    }
  }
}

export const toolRegistry = new ToolRegistry();
