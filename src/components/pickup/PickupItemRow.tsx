import { ScrapCategory, PickupEstimateItem, PickupEstimateItemInput, ValidationResult } from "@/types/pickup";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AmountDisplay } from "@/components/AmountDisplay";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

export interface PickupItemRowProps {
  /**
   * Enriched estimate item to display.
   * All calculated fields (unitPrice, estimatedAmount) should be provided by the caller.
   */
  item: PickupEstimateItem;
  /**
   * Available scrap categories for selection.
   */
  categories: ScrapCategory[];
  /**
   * Called whenever the user updates category or weight.
   * The consumer is responsible for re-calculating the item and passing
   * an updated PickupEstimateItem back in via props.
   */
  onItemChange: (updated: PickupEstimateItemInput) => void;
  /**
   * Called when the user requests removal of this row.
   */
  onRemove: (categoryId: string) => void;
  /**
   * Optional validation result for the current weight.
   * When provided, visual feedback is rendered below the input.
   */
  validationResult?: ValidationResult;
  /**
   * Optional high-weight warning flag for this item (e.g. > 50 kg).
   */
  showHighWeightWarning?: boolean;
}

/**
 * PickupItemRow
 *
 * Presentational-only row component for a single scrap item in the
 * multi-item pickup builder. It renders:
 * - Category selector
 * - Weight input (kg)
 * - Unit price (read-only)
 * - Estimated subtotal (read-only)
 * - Remove button
 *
 * All calculations must be done outside this component using pure utilities.
 */
export function PickupItemRow({
  item,
  categories,
  onItemChange,
  onRemove,
  validationResult,
  showHighWeightWarning,
}: PickupItemRowProps) {
  const selectedCategory = categories.find((c) => c.id === item.categoryId);

  const handleCategoryChange = (categoryId: string) => {
    onItemChange({
      categoryId,
      estimatedWeightKg: item.estimatedWeightKg,
    });
  };

  const handleWeightChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    const numeric = value === "" ? 0 : Number(value);

    onItemChange({
      categoryId: item.categoryId,
      estimatedWeightKg: numeric,
    });
  };

  const hasError = validationResult?.valid === false && Boolean(validationResult.error);

  return (
    <Card className="w-full border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {/* Category selector */}
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Scrap type</p>
            <Select
              value={item.categoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select scrap type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remove button */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mt-6 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.categoryId)}
            aria-label="Remove item"
          >
            <Icons.close className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Weight input */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Approx weight (kg)</p>
            <div className="relative">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={item.estimatedWeightKg || ""}
                onChange={handleWeightChange}
                className={cn(
                  "pr-10",
                  hasError && "border-destructive focus-visible:ring-destructive",
                )}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                kg
              </span>
            </div>
            {hasError && (
              <p className="text-xs text-destructive">
                {validationResult?.error}
              </p>
            )}
            {!hasError && selectedCategory && (
              <p className="text-[11px] text-muted-foreground">
                Min {selectedCategory.minWeightKg} kg • Max {selectedCategory.maxWeightKg} kg
              </p>
            )}
          </div>

          {/* Unit price and subtotal */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Price &amp; estimate</p>
            <div className="flex flex-col gap-1 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>₹/kg</span>
                <span className="font-medium text-foreground">
                  {selectedCategory ? selectedCategory.unitPrice : item.unitPrice}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Subtotal</span>
                <AmountDisplay amount={item.estimatedAmount} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {showHighWeightWarning && (
          <div className="flex items-start gap-2 rounded-md bg-warning/10 px-3 py-2">
            <Icons.info className="mt-0.5 h-4 w-4 text-warning" />
            <p className="text-xs text-warning">
              This item has a high estimated weight. Final amount will depend on
              actual weighing at pickup.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


