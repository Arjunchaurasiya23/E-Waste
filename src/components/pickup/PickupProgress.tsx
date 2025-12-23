import { cn } from "@/lib/utils";

export type PickupStep = "items" | "estimate" | "schedule";

export interface PickupProgressProps {
  /**
   * Current step in the pickup creation flow.
   */
  currentStep: PickupStep;
}

const steps: { id: PickupStep; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "estimate", label: "Estimate" },
  { id: "schedule", label: "Schedule" },
];

/**
 * PickupProgress
 *
 * Simple, mobile-friendly step indicator for the pickup flow:
 * Items → Estimate → Schedule
 *
 * This component is purely visual and does not handle routing or navigation.
 */
export function PickupProgress({ currentStep }: PickupProgressProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {/* Line before step (for all but first) */}
              {index > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    isCompleted
                      ? "bg-primary"
                      : "bg-muted",
                  )}
                />
              )}

              {/* Step circle */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 text-xs font-semibold h-7 w-7 shrink-0",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  isCompleted && !isCurrent && "border-primary bg-primary/10 text-primary",
                  !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {index + 1}
              </div>

              {/* Line after step (for all but last) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    index < currentIndex
                      ? "bg-primary"
                      : "bg-muted",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "mt-1 text-[11px] font-medium",
                isCurrent ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}


