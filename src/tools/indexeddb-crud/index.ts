import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolPlugin } from "@/shared/types/tool";
import { IndexedDbCrud } from "./components";

const IndexedDbCrudPlugin: ToolPlugin = {
  id: "indexeddb-crud",
  metadata: {
    id: "indexeddb-crud",
    name: "IndexedDB CRUD",
    category: "database",
    description: "Simple IndexedDB database management with CRUD operations",
    version: "1.0.0",
    icon: "🗄️",
  },
  component: IndexedDbCrud,
};

// Auto-register the plugin
toolRegistry.register(IndexedDbCrudPlugin);
