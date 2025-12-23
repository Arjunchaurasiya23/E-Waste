import { PickupStatus } from "@/types";
import { Icons } from "@/components/Icons";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface PickupTimelineProps {
  status: PickupStatus;
  className?: string;
}

const TIMELINE_STEPS: { status: PickupStatus; icon: keyof typeof Icons; label: { en: string; hi: string } }[] = [
  { status: "requested", icon: "clock", label: { en: "Requested", hi: "अनुरोधित" } },
  { status: "assigned", icon: "user", label: { en: "Assigned", hi: "सौंपा गया" } },
  { status: "on_the_way", icon: "truck", label: { en: "On the way", hi: "रास्ते में" } },
  { status: "weighing", icon: "package", label: { en: "Weighing", hi: "तौल रहे हैं" } },
  { status: "paid", icon: "rupee", label: { en: "Paid", hi: "भुगतान किया" } },
];

export function PickupTimeline({ status, className }: PickupTimelineProps) {
  const { t } = useApp();
  
  const currentStepIndex = TIMELINE_STEPS.findIndex(step => step.status === status);
  const actualIndex = status === "picked" ? 4 : currentStepIndex;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-center justify-between">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
            style={{ width: `${(actualIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
          />
        </div>
        
        {TIMELINE_STEPS.map((step, index) => {
          const Icon = Icons[step.icon];
          const isCompleted = index <= actualIndex;
          const isCurrent = index === actualIndex;
          
          return (
            <div key={step.status} className="relative flex flex-col items-center z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20 scale-110"
                )}
              >
                {isCompleted && index < actualIndex ? (
                  <Icons.check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 font-medium text-center max-w-[60px]",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t(step.label.en, step.label.hi)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
