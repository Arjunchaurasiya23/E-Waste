import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { WasteIcon } from "@/components/WasteIcon";
import { AmountDisplay } from "@/components/AmountDisplay";
import { cn } from "@/lib/utils";

interface WasteBagWidgetProps {
  className?: string;
  variant?: "compact" | "full";
}

export function WasteBagWidget({ className, variant = "compact" }: WasteBagWidgetProps) {
  const navigate = useNavigate();
  const { wasteBag, getWasteBagTotals, adminSettings, t, removeFromWasteBag } = useApp();
  
  const { totalWeight, totalAmount, itemCount } = getWasteBagTotals();
  const hasUnknownWeight = totalWeight === null;
  const isFreePickup = totalWeight !== null && totalWeight >= adminSettings.minFreePickupWeight;
  
  if (itemCount === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <Card 
        variant="elevated" 
        className={cn("bg-accent/10 border-accent/30 cursor-pointer card-hover", className)}
        onClick={() => navigate("/customer/waste-bag")}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center relative">
            <Icons.package className="h-6 w-6 text-accent" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {t("Waste Bag", "कबाड़ बैग")}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasUnknownWeight 
                ? t(`${itemCount} items (weight TBD)`, `${itemCount} आइटम (वजन बाद में)`)
                : t(`${totalWeight} kg • Est. `, `${totalWeight} किलो • अनु. `)
              }
              {!hasUnknownWeight && <AmountDisplay amount={totalAmount!} size="sm" className="inline" />}
            </p>
          </div>
          <Icons.chevronRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
            <Icons.package className="h-5 w-5 text-accent" />
            {t("Waste Bag", "कबाड़ बैग")}
          </h3>
          <span className="text-sm text-muted-foreground">
            {itemCount} {t("items", "आइटम")}
          </span>
        </div>

        <div className="space-y-3">
          {wasteBag.map((item) => {
            const pricing = { type: item.type, pricePerKg: item.pricePerKg };
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <WasteIcon type={item.type} size="sm" />
                <div className="flex-1">
                  <p className="font-medium capitalize">{item.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.estimatedWeight !== null 
                      ? `${item.estimatedWeight} kg × ₹${item.pricePerKg}`
                      : t("Weight TBD", "वजन बाद में")
                    }
                  </p>
                </div>
                {item.estimatedAmount !== null && (
                  <AmountDisplay amount={item.estimatedAmount} size="sm" />
                )}
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => removeFromWasteBag(item.id)}
                >
                  <Icons.close className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Totals & Minimum Info */}
        <div className="border-t border-border pt-4 space-y-3">
          {hasUnknownWeight ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icons.info className="h-4 w-4" />
              {t("Final amount decided after weighing", "अंतिम राशि तौलने के बाद तय होगी")}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("Total Weight", "कुल वजन")}</span>
                <span className="font-heading font-bold">{totalWeight} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("Estimated Amount", "अनुमानित राशि")}</span>
                <AmountDisplay amount={totalAmount!} size="lg" />
              </div>
              
              {/* Minimum weight info */}
              {!isFreePickup && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 text-warning rounded-lg text-sm">
                  <Icons.info className="h-4 w-4 shrink-0" />
                  <span>
                    {t(
                      `Add ${(adminSettings.minFreePickupWeight - totalWeight!).toFixed(1)} kg more for free pickup (₹${adminSettings.convenienceFee} fee applies)`,
                      `मुफ्त पिकअप के लिए ${(adminSettings.minFreePickupWeight - totalWeight!).toFixed(1)} किलो और जोड़ें (₹${adminSettings.convenienceFee} शुल्क लागू)`
                    )}
                  </span>
                </div>
              )}
              
              {isFreePickup && (
                <div className="flex items-center gap-2 p-3 bg-success/10 text-success rounded-lg text-sm">
                  <Icons.check className="h-4 w-4 shrink-0" />
                  <span>{t("Free pickup! No convenience fee.", "मुफ्त पिकअप! कोई शुल्क नहीं।")}</span>
                </div>
              )}
            </>
          )}
        </div>

        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          onClick={() => navigate("/customer/schedule", { state: { fromWasteBag: true } })}
        >
          {t("Schedule Pickup", "पिकअप शेड्यूल करें")}
          <Icons.chevronRight className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
