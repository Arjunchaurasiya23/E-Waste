import { useApp } from "@/context/AppContext";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface PriceLockIndicatorProps {
  expiresAt: Date;
  className?: string;
}

export function PriceLockIndicator({ expiresAt, className }: PriceLockIndicatorProps) {
  const { t } = useApp();
  
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffMins = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
  
  const isExpired = diffMs <= 0;
  const isExpiringSoon = diffHours < 2 && !isExpired;

  if (isExpired) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
        <Icons.close className="h-4 w-4" />
        <span>{t("Price expired", "मूल्य समाप्त")}</span>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm px-3 py-1.5 rounded-full",
        isExpiringSoon 
          ? "bg-warning/10 text-warning" 
          : "bg-success/10 text-success",
        className
      )}
    >
      <Icons.clock className="h-4 w-4" />
      <span>
        {t("Price locked for", "मूल्य लॉक है")} {diffHours > 0 ? `${diffHours}h ` : ""}{diffMins}m
      </span>
    </div>
  );
}
