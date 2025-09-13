import type React from "react";

import type { ToolComponentProps } from "@/shared/types/tool";

interface InstanceRendererProps {
  instanceId: string;
  component: React.ComponentType<ToolComponentProps>;
}

export const InstanceRenderer: React.FC<InstanceRendererProps> = ({
  instanceId,
  component: ComponentRenderer,
}) => {
  return (
    <div className="p-6">
      <ComponentRenderer instanceId={instanceId} />
    </div>
  );
};
