import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  amount: number;
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  className?: string;
  prefix?: string;
  animated?: boolean;
}

export function AmountDisplay({ 
  amount, 
  size = "md", 
  showIcon = true, 
  className,
  prefix,
  animated = false
}: AmountDisplayProps) {
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-8 w-8",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1 font-semibold font-heading text-foreground",
      sizes[size],
      animated && "animate-count",
      className
    )}>
      {prefix && <span className="text-muted-foreground font-normal">{prefix}</span>}
      {showIcon && <Icons.rupee className={iconSizes[size]} />}
      <span>{amount.toLocaleString("en-IN")}</span>
    </div>
  );
}
