import type React from "react";

export const Header: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Chi tiêu</h1>
        <p className="text-muted-foreground">Theo dõi chi tiêu với AI ngôn ngữ tự nhiên</p>
      </div>
    </div>
  );
};
