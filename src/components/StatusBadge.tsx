import { PickupStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";

interface StatusBadgeProps {
  status: PickupStatus;
  size?: "sm" | "default" | "lg";
}

const statusLabels: Record<PickupStatus, { en: string; hi: string }> = {
  requested: { en: "Requested", hi: "अनुरोधित" },
  assigned: { en: "Assigned", hi: "सौंपा गया" },
  on_the_way: { en: "On the way", hi: "रास्ते में" },
  weighing: { en: "Weighing", hi: "तौल रहे हैं" },
  picked: { en: "Picked", hi: "उठाया गया" },
  paid: { en: "Paid", hi: "भुगतान किया" },
};

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const { t } = useApp();
  const label = statusLabels[status];

  return (
    <Badge variant={status} size={size}>
      {t(label.en, label.hi)}
    </Badge>
  );
}
