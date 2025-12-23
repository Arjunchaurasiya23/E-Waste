/**
 * EmptyState Component
 * 
 * Reusable empty state component for displaying helpful messages
 * when there's no data to show. Includes icon, title, description,
 * and optional call-to-action button.
 * 
 * Usage:
 * <EmptyState
 *   icon={Icons.package}
 *   title="No pickups yet"
 *   description="Schedule your first pickup to get started"
 *   action={{
 *     label: "Schedule Pickup",
 *     onClick: () => navigate("/customer/schedule")
 *   }}
 * />
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /**
   * Icon to display (from Icons component or lucide-react)
   */
  icon: LucideIcon;
  
  /**
   * Main title text
   */
  title: string;
  
  /**
   * Description text (supports bilingual via useApp t function)
   */
  description?: string;
  
  /**
   * Optional call-to-action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "hero" | "outline";
  };
  
  /**
   * Custom icon size (default: 16x16 = 64px)
   */
  iconSize?: "sm" | "md" | "lg";
  
  /**
   * Additional className
   */
  className?: string;
  
  /**
   * Custom content (overrides default layout)
   */
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconSize = "md",
  className,
  children,
}: EmptyStateProps) {
  const iconSizes = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  if (children) {
    return <div className={cn("text-center py-12", className)}>{children}</div>;
  }

  return (
    <div className={cn("text-center py-12 px-4", className)}>
      {/* Icon */}
      <div className={cn(
        "rounded-full bg-muted mx-auto mb-4 flex items-center justify-center",
        iconSizes[iconSize]
      )}>
        <Icon className={cn(
          "text-muted-foreground",
          iconSize === "sm" ? "h-6 w-6" : iconSize === "md" ? "h-8 w-8" : "h-10 w-10"
        )} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant={action.variant || "hero"}
          size="lg"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

