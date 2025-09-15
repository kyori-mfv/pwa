import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolPlugin } from "@/shared/types/tool";
import { JwtDecoder } from "./components";

const JwtDecoderPlugin: ToolPlugin = {
  id: "jwt-decoder",
  metadata: {
    id: "jwt-decoder",
    name: "JWT Decoder",
    category: "utility",
    description:
      "Decode and validate JSON Web Tokens (JWT) to inspect headers, payloads, and claims",
    version: "1.0.0",
    icon: "🔐",
  },
  component: JwtDecoder,
};

// Auto-register the plugin
toolRegistry.register(JwtDecoderPlugin);
