import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { WasteBagWidget } from "@/components/WasteBagWidget";
import { WasteItemSelector } from "@/components/WasteItemSelector";
import { useApp } from "@/context/AppContext";

export default function WasteBagPage() {
  const { t } = useApp();

  return (
    <CustomerLayout title={t("Waste Bag", "कबाड़ बैग")} showBack>
      <div className="p-4 space-y-6 animate-fade-in">
        <WasteBagWidget variant="full" />
        <div>
          <h3 className="font-heading font-semibold mb-4">{t("Add More Items", "और आइटम जोड़ें")}</h3>
          <WasteItemSelector />
        </div>
      </div>
    </CustomerLayout>
  );
}
