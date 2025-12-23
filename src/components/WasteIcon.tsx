import { WasteType } from "@/types";
import { cn } from "@/lib/utils";

interface WasteIconProps {
  type: WasteType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const wasteIcons: Record<WasteType, string> = {
  paper: "📰",
  plastic: "🥤",
  metal: "🔩",
  ewaste: "📱",
  glass: "🍾",
  mixed: "♻️",
};

const wasteBgColors: Record<WasteType, string> = {
  paper: "bg-amber-100",
  plastic: "bg-blue-100",
  metal: "bg-slate-100",
  ewaste: "bg-purple-100",
  glass: "bg-cyan-100",
  mixed: "bg-gray-100",
};

const wasteBorderColors: Record<WasteType, string> = {
  paper: "border-amber-300",
  plastic: "border-blue-300",
  metal: "border-slate-300",
  ewaste: "border-purple-300",
  glass: "border-cyan-300",
  mixed: "border-gray-300",
};

export function WasteIcon({ type, size = "md", showLabel, label, className }: WasteIconProps) {
  const sizes = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-xl border-2 flex items-center justify-center",
          sizes[size],
          wasteBgColors[type],
          wasteBorderColors[type]
        )}
      >
        {wasteIcons[type]}
      </div>
      {showLabel && label && (
        <span className="text-sm font-medium text-muted-foreground text-center">{label}</span>
      )}
    </div>
  );
}
