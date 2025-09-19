import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolPlugin } from "@/shared/types/tool";
import { IndexedDbCrud } from "./components";
import { Header } from "./components/header";

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
  body: IndexedDbCrud,
  header: Header,
};

// Auto-register the plugin
toolRegistry.register(IndexedDbCrudPlugin);
