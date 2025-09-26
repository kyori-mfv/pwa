import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { BarChart3, DollarSign, Menu, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

export type SidebarView = "dashboard" | "income" | "expense";

interface SidebarProps {
  currentView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  className?: string;
}

const sidebarItems = [
  {
    id: "dashboard" as const,
    label: "Dashboard",
    icon: BarChart3,
    color: "text-blue-600",
  },
  {
    id: "income" as const,
    label: "Thu nhập",
    icon: TrendingUp,
    color: "text-chart-5",
  },
  {
    id: "expense" as const,
    label: "Chi tiêu",
    icon: TrendingDown,
    color: "text-chart-3",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 h-14 px-2 py-2 rounded-lg",
                  isActive && "bg-primary/10 text-primary"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", item.color, isActive && "text-primary")} />
                <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex bg-background border-r border-border h-full flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <h2 className="font-semibold text-lg">Quản lý Tài chính</h2>
            </div>
          )}

          {/* Desktop Collapse Button */}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12",
                    isCollapsed && "justify-center px-2",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className={cn("h-5 w-5", item.color)} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!isCollapsed && (
            <div className="text-xs text-center text-muted-foreground">
              <p>Quản lý thu chi</p>
              <p>với AI thông minh</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
