import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolPlugin } from "@/shared/types/tool";
import { JsonFormatter } from "./components";
import { Header } from "./components/header";

const JsonFormatterPlugin: ToolPlugin = {
  id: "json-formatter",
  metadata: {
    id: "json-formatter",
    name: "JSON Formatter",
    category: "json",
    description: "Format, validate, and beautify JSON data with multiple formatting strategies",
    version: "1.0.0",
    icon: "{ }",
  },
  body: JsonFormatter,
  header: Header,
};

// Auto-register the plugin
toolRegistry.register(JsonFormatterPlugin);
