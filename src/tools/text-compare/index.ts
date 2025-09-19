import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolPlugin } from "@/shared/types/tool";
import { TextCompare } from "./components";
import { Header } from "./components/header";

const TextComparePlugin: ToolPlugin = {
  id: "text-compare",
  metadata: {
    id: "text-compare",
    name: "Text Compare",
    category: "text",
    description:
      "Compare two texts using different algorithms: line-by-line, character-level, word-level, or side-by-side view",
    version: "1.0.0",
    icon: "⚖️",
  },
  body: TextCompare,
  header: Header,
};

// Auto-register the plugin
toolRegistry.register(TextComparePlugin);
