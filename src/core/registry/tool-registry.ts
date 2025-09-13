import type { ToolInstance, ToolPlugin } from "@/shared/types/tool";

export class ToolRegistry {
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
}

export const toolRegistry = new ToolRegistry();
