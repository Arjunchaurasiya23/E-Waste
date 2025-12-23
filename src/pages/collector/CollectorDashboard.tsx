import { useState, useEffect } from "react";
import { CollectorLayout } from "@/components/layouts/CollectorLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/Icons";
import { WasteIcon } from "@/components/WasteIcon";
import { AmountDisplay } from "@/components/AmountDisplay";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CollectorDashboard() {
  const { pickups, updatePickup, wastePricing, t } = useApp();
  
  // Simulate loading state for UX demonstration (remove when real API calls are added)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const pendingPickups = pickups.filter(p => p.status === "requested" || p.status === "assigned");
  
  // Visual priority threshold (high-value pickup = ₹200+)
  const HIGH_VALUE_THRESHOLD = 200;

  const handleAccept = (id: string) => {
    updatePickup(id, { status: "assigned", collectorId: "col-1", collectorName: "Ramesh Kumar" });
    toast.success(t("Pickup accepted!", "पिकअप स्वीकार किया!"));
  };

  const handleComplete = (id: string) => {
    const pickup = pickups.find(p => p.id === id);
    if (pickup) {
      updatePickup(id, { 
        status: "paid", 
        actualWeight: pickup.estimatedWeight, 
        actualAmount: pickup.estimatedAmount,
        completedAt: new Date(),
        paidAt: new Date()
      });
      toast.success(t("Pickup completed!", "पिकअप पूर्ण!"));
    }
  };

  // Skeleton loader for summary card
  const SummarySkeleton = () => (
    <Card variant="elevated" className="bg-gradient-secondary text-secondary-foreground">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-secondary-foreground/20" />
          <Skeleton className="h-9 w-16 bg-secondary-foreground/20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg bg-secondary-foreground/20" />
      </CardContent>
    </Card>
  );

  // Skeleton loader for pickup task card
  const PickupTaskSkeleton = () => (
    <Card variant="elevated">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardContent>
    </Card>
  );

  return (
    <CollectorLayout title={t("Pickups", "पिकअप")}>
      <div className="p-4 space-y-4 animate-fade-in">
        {/* Summary Card */}
        {isLoading ? (
          <SummarySkeleton />
        ) : (
          <Card variant="elevated" className="bg-gradient-secondary text-secondary-foreground">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1 font-medium">{t("Today's Pickups", "आज के पिकअप")}</p>
                <p className="text-3xl font-heading font-bold">{pendingPickups.length}</p>
                {pendingPickups.length > 0 && (
                  <p className="text-xs opacity-75 mt-1">
                    {t("Available now", "अभी उपलब्ध")}
                  </p>
                )}
              </div>
              <Icons.package className="h-12 w-12 opacity-50" />
            </CardContent>
          </Card>
        )}

        {/* Pickup Tasks */}
        {isLoading ? (
          <div className="space-y-4">
            <PickupTaskSkeleton />
            <PickupTaskSkeleton />
          </div>
        ) : pendingPickups.length === 0 ? (
          <EmptyState
            icon={Icons.check}
            title={t("All caught up!", "सब हो गया!")}
            description={t("No pending pickups right now. We'll notify you when new pickups are available.", "अभी कोई लंबित पिकअप नहीं है। नए पिकअप उपलब्ध होने पर हम आपको सूचित करेंगे।")}
            iconSize="lg"
            className="py-16"
          />
        ) : (
          <div className="space-y-4">
            {pendingPickups.map((pickup) => {
              const wasteInfo = wastePricing.find(w => w.type === pickup.wasteType);
              const isHighValue = pickup.estimatedAmount >= HIGH_VALUE_THRESHOLD;
              
              return (
                <Card 
                  key={pickup.id} 
                  variant="elevated"
                  className={cn(
                    "transition-all hover:shadow-md",
                    isHighValue && "border-warning/30 border-2"
                  )}
                >
                  <CardContent className="p-4 space-y-4">
                    {/* Header with waste type, status, and priority badge */}
                    <div className="flex items-start gap-4">
                      <WasteIcon type={pickup.wasteType} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {wasteInfo && t(wasteInfo.label.en, wasteInfo.label.hi)}
                            </p>
                            {isHighValue && (
                              <Badge variant="warning" size="sm" className="shrink-0">
                                {t("High Value", "उच्च मूल्य")}
                              </Badge>
                            )}
                          </div>
                          <StatusBadge status={pickup.status} />
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-muted-foreground font-medium">
                            {pickup.estimatedWeight} kg
                          </p>
                          <AmountDisplay 
                            amount={pickup.estimatedAmount} 
                            size="lg" 
                            className={cn(
                              "font-heading font-bold",
                              isHighValue && "text-warning"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Customer & Location Details */}
                    <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <Icons.user className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium text-foreground">{pickup.customerName}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{pickup.customerPhone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icons.location className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <span className="text-foreground">
                          {pickup.address.line1}, {pickup.address.city} - {pickup.address.pincode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          {t(pickup.scheduledSlot.label.en, pickup.scheduledSlot.label.hi)}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3">
                      {pickup.status === "requested" && (
                        <Button 
                          variant="hero" 
                          size="lg"
                          className="flex-1 font-semibold" 
                          onClick={() => handleAccept(pickup.id)}
                        >
                          <Icons.check className="h-5 w-5" />
                          {t("Accept", "स्वीकार करें")}
                        </Button>
                      )}
                      {pickup.status === "assigned" && (
                        <Button 
                          variant="success" 
                          size="lg"
                          className="flex-1 font-semibold" 
                          onClick={() => handleComplete(pickup.id)}
                        >
                          <Icons.check className="h-5 w-5" />
                          {t("Complete", "पूर्ण करें")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CollectorLayout>
  );
}
