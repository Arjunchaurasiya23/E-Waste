import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/Icons";
import { WasteIcon } from "@/components/WasteIcon";
import { AmountDisplay } from "@/components/AmountDisplay";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

export default function CustomerPickups() {
  const navigate = useNavigate();
  const { user, pickups, wastePricing, t } = useApp();

  // Simulate loading state for UX demonstration (remove when real API calls are added)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get user's pickups
  const userPickups = pickups.filter(p => p.customerId === user?.id);
  const activePickups = userPickups.filter(p => p.status !== "paid");
  const completedPickups = userPickups.filter(p => p.status === "paid");

  // Skeleton loader for active pickup card
  const ActivePickupSkeleton = () => (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Skeleton loader for completed pickup card
  const CompletedPickupSkeleton = () => (
    <Card variant="bordered">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-5 w-16 rounded-full ml-auto" />
            <Skeleton className="h-5 w-20 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <CustomerLayout title={t("My Pickups", "मेरे पिकअप")} showBack>
      <div className="p-4 space-y-6 animate-fade-in">
        {isLoading ? (
          <>
            {/* Loading Skeletons */}
            <section>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <ActivePickupSkeleton />
                <ActivePickupSkeleton />
              </div>
            </section>
            <section>
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                <CompletedPickupSkeleton />
                <CompletedPickupSkeleton />
                <CompletedPickupSkeleton />
              </div>
            </section>
          </>
        ) : userPickups.length === 0 ? (
          <EmptyState
            icon={Icons.package}
            title={t("No pickups yet", "अभी तक कोई पिकअप नहीं")}
            description={t("Schedule your first pickup to start earning cash", "पैसे कमाना शुरू करने के लिए अपना पहला पिकअप शेड्यूल करें")}
            action={{
              label: t("Schedule Pickup", "पिकअप शेड्यूल करें"),
              onClick: () => navigate("/customer/schedule"),
              variant: "hero",
            }}
            iconSize="md"
          />
        ) : (
          <>
            {/* Active Pickups */}
            {activePickups.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    {t("Active Pickups", "सक्रिय पिकअप")}
                  </h2>
                  <span className="text-sm text-muted-foreground font-medium">
                    {activePickups.length} {activePickups.length === 1 ? t("pickup", "पिकअप") : t("pickups", "पिकअप")}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {activePickups.map((pickup) => {
                    const wasteInfo = wastePricing.find(w => w.type === pickup.wasteType);
                    return (
                      <Card 
                        key={pickup.id} 
                        variant="elevated" 
                        className="overflow-hidden border-primary/20 transition-all hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <WasteIcon type={pickup.wasteType} size="md" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold text-foreground">
                                  {wasteInfo && t(wasteInfo.label.en, wasteInfo.label.hi)}
                                </p>
                                <StatusBadge status={pickup.status} />
                              </div>
                              
                              <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-2">
                                  <Icons.calendar className="h-4 w-4 shrink-0" />
                                  <span>
                                    {new Date(pickup.scheduledDate).toLocaleDateString("en-IN", { 
                                      weekday: "short", 
                                      day: "numeric", 
                                      month: "short" 
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icons.clock className="h-4 w-4 shrink-0" />
                                  <span>{t(pickup.scheduledSlot.label.en, pickup.scheduledSlot.label.hi)}</span>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-border flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {pickup.estimatedWeight} kg
                                </span>
                                <AmountDisplay amount={pickup.estimatedAmount} size="md" />
                              </div>

                              {pickup.collectorName && (
                                <div className="mt-3 pt-2 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
                                  <Icons.user className="h-4 w-4 shrink-0" />
                                  <span>
                                    {t("Collector:", "संग्राहक:")} <span className="font-medium text-foreground">{pickup.collectorName}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Completed Pickups */}
            {completedPickups.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    {t("Completed", "पूर्ण")}
                  </h2>
                  <span className="text-sm text-muted-foreground font-medium">
                    {completedPickups.length} {completedPickups.length === 1 ? t("pickup", "पिकअप") : t("pickups", "पिकअप")}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {completedPickups.map((pickup) => {
                    const wasteInfo = wastePricing.find(w => w.type === pickup.wasteType);
                    return (
                      <Card 
                        key={pickup.id} 
                        variant="bordered" 
                        className="transition-all hover:shadow-sm hover:border-border/80"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <WasteIcon type={pickup.wasteType} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground mb-1">
                                {wasteInfo && t(wasteInfo.label.en, wasteInfo.label.hi)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {pickup.actualWeight || pickup.estimatedWeight} kg • {new Date(pickup.completedAt!).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <StatusBadge status={pickup.status} size="sm" />
                              <AmountDisplay 
                                amount={pickup.actualAmount || pickup.estimatedAmount} 
                                size="md"
                                className="mt-1" 
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
