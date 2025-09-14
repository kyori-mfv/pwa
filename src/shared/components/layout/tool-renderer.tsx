import type React from "react";

import type { ToolComponentProps } from "@/shared/types/tool";

interface ToolRendererProps {
  instanceId: string;
  component: React.ComponentType<ToolComponentProps>;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({
  instanceId,
  component: ComponentRenderer,
}) => {
  return (
    <div className="p-6">
      <ComponentRenderer instanceId={instanceId} />
    </div>
  );
};
