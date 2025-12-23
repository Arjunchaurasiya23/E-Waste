import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/Icons";
import { toast } from "sonner";

export default function AdminCollectors() {
  const { collectors, updateCollector } = useApp();

  const handleApprove = (id: string) => {
    updateCollector(id, { status: "approved" });
    toast.success("Collector approved!");
  };

  return (
    <AdminLayout title="Collectors">
      <div className="p-4 space-y-4 animate-fade-in">
        {collectors.map((col) => (
          <Card key={col.id} variant="bordered">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center">
                  <Icons.user className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{col.name}</p>
                    <Badge variant={col.status === "approved" ? "success" : col.status === "pending" ? "warning" : "destructive"} size="sm">
                      {col.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{col.phone}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{col.totalPickups} pickups</span>
                    <span>₹{col.totalEarnings} earned</span>
                    <span>⭐ {col.rating || "N/A"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pincodes: {col.pincodes.join(", ")}</p>
                </div>
                {col.status === "pending" && (
                  <Button size="sm" onClick={() => handleApprove(col.id)}>Approve</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
