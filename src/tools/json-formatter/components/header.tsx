import type React from "react";

export const Header: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">JSON Formatter</h1>
      <p className="text-muted-foreground">Format, validate, and beautify JSON data</p>
    </div>
  );
};
