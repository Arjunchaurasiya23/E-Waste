import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        info: "border-transparent bg-info/15 text-info",
        accent: "border-transparent bg-accent/15 text-accent",
        // Pickup status badges - enhanced with more granular states
        requested: "border-warning/30 bg-warning/10 text-warning",
        assigned: "border-info/30 bg-info/10 text-info",
        on_the_way: "border-primary/30 bg-primary/10 text-primary",
        weighing: "border-accent/30 bg-accent/10 text-accent",
        picked: "border-success/30 bg-success/10 text-success",
        paid: "border-success/30 bg-success/10 text-success",
        // Waste type badges
        paper: "border-amber-300 bg-amber-100 text-amber-800",
        plastic: "border-blue-300 bg-blue-100 text-blue-800",
        metal: "border-slate-300 bg-slate-100 text-slate-800",
        ewaste: "border-purple-300 bg-purple-100 text-purple-800",
        glass: "border-cyan-300 bg-cyan-100 text-cyan-800",
        mixed: "border-gray-300 bg-gray-100 text-gray-800",
      },
      size: {
        default: "px-3 py-1 text-sm",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
