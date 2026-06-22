import * as React from "react";
import { cn } from "@/app/components/ui/utils";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/app/components/ui/card";

interface DashboardCardProps {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({ title, action, className, children }: DashboardCardProps) {
  return (
    <Card className={cn("bg-surface border-border shadow-sm pt-6", className)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}