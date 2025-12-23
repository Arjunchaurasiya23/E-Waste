import { Card, CardContent } from "@/components/ui/card";
import { AmountDisplay } from "@/components/AmountDisplay";
import { Icons } from "@/components/Icons";
import { PickupEstimate } from "@/types/pickup";

export interface PickupSummaryCardProps {
  /**
   * Aggregated pickup estimate to display.
   */
  estimate: PickupEstimate;
}

/**
 * PickupSummaryCard
 *
 * Presentational card that summarizes an estimated pickup:
 * - Total estimated weight (kg)
 * - Total estimated payout (₹)
 * - Optional high-weight warning
 * - Static disclaimer about final weighing
 */
export function PickupSummaryCard({ estimate }: PickupSummaryCardProps) {
  return (
    <Card variant="elevated">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estimated payout
            </p>
            <AmountDisplay amount={estimate.totalEstimatedAmount} size="xl" />
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total weight
            </p>
            <p className="text-lg font-heading font-semibold">
              {estimate.totalEstimatedWeightKg.toFixed(1)} kg
            </p>
          </div>
        </div>

        {estimate.hasHighWeightWarning && (
          <div className="flex items-start gap-2 rounded-md bg-warning/10 px-3 py-2">
            <Icons.info className="mt-0.5 h-4 w-4 text-warning" />
            <p className="text-xs text-warning">
              Some items have high estimated weight. Collector will confirm the final
              weight at pickup.
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2">
          <Icons.info className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Final amount will be calculated after weighing at pickup. If the actual
            weight is different from your estimate, the payout will be adjusted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


