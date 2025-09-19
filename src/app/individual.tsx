import { IndividualAppLayout } from "@/shared/components/layout/individual-app-layout";
import type React from "react";

// Check if we're in single app build mode
declare const __BUILD_APP_ID__: string | undefined;
const buildAppId = typeof __BUILD_APP_ID__ !== "undefined" ? __BUILD_APP_ID__ : undefined;

export const IndividualApp: React.FC = () => {
  if (!buildAppId) {
    throw new Error("Individual app mode requires __BUILD_APP_ID__ to be defined");
  }

  return <IndividualAppLayout appId={buildAppId} />;
};
