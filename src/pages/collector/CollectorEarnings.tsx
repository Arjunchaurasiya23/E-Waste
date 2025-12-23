import { CollectorLayout } from "@/components/layouts/CollectorLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { AmountDisplay } from "@/components/AmountDisplay";
import { Icons } from "@/components/Icons";

export default function CollectorEarnings() {
  const { pickups, t } = useApp();
  const completedPickups = pickups.filter(p => p.status === "paid");
  const totalEarnings = completedPickups.reduce((sum, p) => sum + (p.actualAmount || 0) * 0.15, 0);

  return (
    <CollectorLayout title={t("Earnings", "कमाई")}>
      <div className="p-4 space-y-6 animate-fade-in">
        <Card variant="elevated" className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <p className="text-sm opacity-90 mb-2">{t("Total Earnings", "कुल कमाई")}</p>
            <AmountDisplay amount={Math.round(totalEarnings)} size="xl" className="text-primary-foreground" />
            <p className="text-sm opacity-75 mt-2">{completedPickups.length} {t("pickups completed", "पिकअप पूर्ण")}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card variant="bordered">
            <CardContent className="p-4 text-center">
              <Icons.package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{completedPickups.length}</p>
              <p className="text-sm text-muted-foreground">{t("Completed", "पूर्ण")}</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardContent className="p-4 text-center">
              <Icons.rupee className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">15%</p>
              <p className="text-sm text-muted-foreground">{t("Commission", "कमीशन")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CollectorLayout>
  );
}
