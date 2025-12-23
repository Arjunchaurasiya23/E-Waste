import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { AmountDisplay } from "@/components/AmountDisplay";
import { Icons } from "@/components/Icons";
import { DEMO_ANALYTICS } from "@/data/mockData";

export default function AdminDashboard() {
  const { pickups } = useApp();
  const analytics = DEMO_ANALYTICS;

  return (
    <AdminLayout title="Dashboard">
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <Card variant="elevated" className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-4">
              <Icons.package className="h-6 w-6 opacity-75 mb-2" />
              <p className="text-2xl font-heading font-bold">{analytics.totalPickups}</p>
              <p className="text-sm opacity-75">Today's Pickups</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-gradient-secondary text-secondary-foreground">
            <CardContent className="p-4">
              <Icons.rupee className="h-6 w-6 opacity-75 mb-2" />
              <AmountDisplay amount={analytics.totalRevenue} size="lg" className="text-secondary-foreground" />
              <p className="text-sm opacity-75">Revenue</p>
            </CardContent>
          </Card>
        </div>

        <Card variant="bordered">
          <CardContent className="p-4">
            <h3 className="font-heading font-semibold mb-4">By Waste Type</h3>
            <div className="space-y-3">
              {analytics.byWasteType.map(({ type, weight, revenue }) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <div className="text-right">
                    <span className="text-muted-foreground">{weight} kg</span>
                    <AmountDisplay amount={revenue} size="sm" className="ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-4">
            <h3 className="font-heading font-semibold mb-4">Top Collectors</h3>
            <div className="space-y-3">
              {analytics.topCollectors.map((col, i) => (
                <div key={col.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-light text-primary text-sm flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="flex-1">{col.name}</span>
                  <span className="text-muted-foreground">{col.pickups} pickups</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
