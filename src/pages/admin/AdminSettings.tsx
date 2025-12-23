import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/Icons";
import { toast } from "sonner";

export default function AdminSettings() {
  const { adminSettings, updateAdminSettings, t } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleSave = (field: string) => {
    const value = parseFloat(tempValue);
    if (value > 0) {
      updateAdminSettings({ [field]: value });
      toast.success("Setting updated!");
    }
    setEditing(null);
  };

  return (
    <AdminLayout title="Settings">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Minimum Weight Rules */}
        <Card variant="bordered">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <Icons.weight className="h-5 w-5" />
              Minimum Weight Rules
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Free Pickup Threshold</p>
                <p className="text-sm text-muted-foreground">Min weight for free pickup</p>
              </div>
              {editing === "minFreePickupWeight" ? (
                <div className="flex items-center gap-2">
                  <Input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-20" />
                  <span>kg</span>
                  <Button size="icon-sm" onClick={() => handleSave("minFreePickupWeight")}><Icons.check className="h-4 w-4" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold">{adminSettings.minFreePickupWeight} kg</span>
                  <Button size="icon-sm" variant="ghost" onClick={() => { setEditing("minFreePickupWeight"); setTempValue(adminSettings.minFreePickupWeight.toString()); }}>
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Convenience Fee</p>
                <p className="text-sm text-muted-foreground">Fee for small pickups</p>
              </div>
              {editing === "convenienceFee" ? (
                <div className="flex items-center gap-2">
                  <span>₹</span>
                  <Input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-20" />
                  <Button size="icon-sm" onClick={() => handleSave("convenienceFee")}><Icons.check className="h-4 w-4" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{adminSettings.convenienceFee}</span>
                  <Button size="icon-sm" variant="ghost" onClick={() => { setEditing("convenienceFee"); setTempValue(adminSettings.convenienceFee.toString()); }}>
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Price Lock Duration</p>
                <p className="text-sm text-muted-foreground">Hours to lock pricing</p>
              </div>
              <span className="font-bold">{adminSettings.priceLockHours}h</span>
            </div>
          </CardContent>
        </Card>

        {/* Area Coverage */}
        <Card variant="bordered">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <Icons.location className="h-5 w-5" />
              Area Coverage
            </h3>
            
            {adminSettings.areaCoverage.map((area) => (
              <div key={area.pincode} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{area.pincode}</p>
                  <p className="text-sm text-muted-foreground">{area.collectorsCount} collectors</p>
                </div>
                <Switch checked={area.enabled} onCheckedChange={(checked) => {
                  updateAdminSettings({
                    areaCoverage: adminSettings.areaCoverage.map(a => 
                      a.pincode === area.pincode ? { ...a, enabled: checked } : a
                    )
                  });
                }} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
