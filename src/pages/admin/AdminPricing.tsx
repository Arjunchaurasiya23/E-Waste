import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WasteIcon } from "@/components/WasteIcon";
import { Icons } from "@/components/Icons";
import { toast } from "sonner";

export default function AdminPricing() {
  const { wastePricing, updatePricing, t } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");

  const handleSave = (type: string) => {
    const price = parseFloat(newPrice);
    if (price > 0) {
      updatePricing(type, price);
      toast.success("Price updated!");
    }
    setEditing(null);
    setNewPrice("");
  };

  return (
    <AdminLayout title="Pricing Control">
      <div className="p-4 space-y-4 animate-fade-in">
        {wastePricing.map((item) => (
          <Card key={item.type} variant="bordered">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <WasteIcon type={item.type} size="md" />
                <div className="flex-1">
                  <p className="font-medium">{t(item.label.en, item.label.hi)}</p>
                  <p className="text-sm text-muted-foreground">Min: {item.minQuantity} kg</p>
                </div>
                {editing === item.type ? (
                  <div className="flex items-center gap-2">
                    <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-20 h-10" placeholder={item.pricePerKg.toString()} />
                    <Button size="icon-sm" onClick={() => handleSave(item.type)}><Icons.check className="h-4 w-4" /></Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setEditing(null)}><Icons.close className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-heading font-bold">₹{item.pricePerKg}/kg</span>
                    <Button size="icon-sm" variant="ghost" onClick={() => { setEditing(item.type); setNewPrice(item.pricePerKg.toString()); }}>
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
