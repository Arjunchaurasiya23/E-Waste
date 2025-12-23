import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/Icons";
import { WasteIcon } from "@/components/WasteIcon";
import { AmountDisplay } from "@/components/AmountDisplay";
import { StatusBadge } from "@/components/StatusBadge";
import { WasteBagWidget } from "@/components/WasteBagWidget";
import { PickupTimeline } from "@/components/PickupTimeline";
import { PriceLockIndicator } from "@/components/PriceLockIndicator";
import { EmptyState } from "@/components/EmptyState";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, wastePricing, pickups, walletBalance, t } = useApp();
  
  // Simulate loading state for UX demonstration (remove when real API calls are added)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);
  
  useEffect(() => {
    // Simulate initial data load
    const timer1 = setTimeout(() => setIsLoadingWallet(false), 800);
    const timer2 = setTimeout(() => setIsLoadingPricing(false), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const userPickups = pickups.filter(p => p.customerId === user?.id);
  const pendingPickup = userPickups.find(p => ["requested", "assigned", "on_the_way", "weighing"].includes(p.status));
  const lastCompletedPickup = userPickups.find(p => p.status === "paid");

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Wallet Card */}
        <Card variant="elevated" className="bg-gradient-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-5">
            {isLoadingWallet ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
                <Skeleton className="h-10 w-32 bg-primary-foreground/20" />
                <div className="flex justify-end mt-2">
                  <Skeleton className="h-9 w-20 bg-primary-foreground/20 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">{t("Wallet Balance", "वॉलेट बैलेंस")}</p>
                  <AmountDisplay amount={walletBalance} size="xl" className="text-primary-foreground" />
                </div>
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={() => navigate("/customer/wallet")}
                  className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
                >
                  {t("Withdraw", "निकालें")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Pickup with Timeline */}
        {pendingPickup && (
          <Card variant="elevated" className="border-primary/30">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold">{t("Active Pickup", "सक्रिय पिकअप")}</h3>
                {pendingPickup.priceLockExpiresAt && (
                  <PriceLockIndicator expiresAt={new Date(pendingPickup.priceLockExpiresAt)} />
                )}
              </div>
              <PickupTimeline status={pendingPickup.status} />
              <div className="flex items-center gap-3 pt-2">
                <WasteIcon type={pendingPickup.wasteType} size="sm" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {pendingPickup.items?.length || 1} {t("items", "आइटम")} • {pendingPickup.totalEstimatedWeight || pendingPickup.estimatedWeight} kg
                  </p>
                </div>
                <AmountDisplay amount={pendingPickup.totalEstimatedAmount || pendingPickup.estimatedAmount} size="md" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="hero" 
            size="lg" 
            className="h-auto py-4 flex-col gap-2 font-semibold" 
            onClick={() => navigate("/customer/schedule")}
          >
            <Icons.plus className="h-6 w-6" />
            {t("New Pickup", "नया पिकअप")}
          </Button>
          {lastCompletedPickup ? (
            <Button 
              variant="outline" 
              size="lg" 
              className="h-auto py-4 flex-col gap-2" 
              onClick={() => navigate("/customer/schedule", { state: { repeatPickup: lastCompletedPickup.id } })}
            >
              <Icons.refresh className="h-6 w-6" />
              {t("Repeat Last", "दोहराएं")}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="lg" 
              className="h-auto py-4 flex-col gap-2" 
              onClick={() => navigate("/customer/wallet")}
            >
              <Icons.wallet className="h-6 w-6" />
              {t("View Wallet", "वॉलेट देखें")}
            </Button>
          )}
        </div>

        {/* Waste Bag Widget */}
        <WasteBagWidget variant="compact" />

        {/* Pricing Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">{t("Today's Rates", "आज के रेट")}</h2>
            <span className="text-xs text-muted-foreground">{t("Per kg", "प्रति किलो")}</span>
          </div>
          {isLoadingPricing ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} variant="bordered">
                  <CardContent className="p-4 flex flex-col items-center space-y-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {wastePricing.map((item) => (
                <Card 
                  key={item.type} 
                  variant="bordered" 
                  className="card-hover cursor-pointer transition-all hover:shadow-md"
                  onClick={() => navigate("/customer/schedule", { state: { wasteType: item.type } })}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <WasteIcon type={item.type} size="sm" />
                    <p className="text-xs text-muted-foreground mt-2 mb-1">{t(item.label.en, item.label.hi)}</p>
                    <AmountDisplay amount={item.pricePerKg} size="sm" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recent Pickups */}
        <section>
          {userPickups.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">{t("Recent Pickups", "हाल के पिकअप")}</h2>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => navigate("/customer/pickups")}
                  className="text-primary hover:text-primary/80"
                >
                  {t("View All", "सब देखें")}
                  <Icons.chevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {userPickups.slice(0, 3).map((pickup) => (
                  <Card key={pickup.id} variant="bordered" className="card-hover transition-all hover:shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <WasteIcon type={pickup.wasteType} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{pickup.items?.length || 1} {t("items", "आइटम")}</p>
                          <p className="text-sm text-muted-foreground">
                            {pickup.totalEstimatedWeight || pickup.estimatedWeight} kg • {new Date(pickup.scheduledDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={pickup.status} size="sm" />
                          <AmountDisplay amount={pickup.actualAmount || pickup.estimatedAmount} size="sm" className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
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
          )}
        </section>
      </div>
    </CustomerLayout>
  );
}
