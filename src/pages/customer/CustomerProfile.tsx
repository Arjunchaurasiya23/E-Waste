import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, logout, t } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <CustomerLayout title={t("Profile", "प्रोफ़ाइल")} showBack>
      <div className="p-4 space-y-6 animate-fade-in">
        {/* User Info */}
        <Card variant="elevated">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl font-heading font-bold text-primary-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">+91 {user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        {user?.address && (
          <Card variant="bordered">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <Icons.location className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{t("Saved Address", "सहेजा गया पता")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.address.line1}
                    {user.address.landmark && `, ${user.address.landmark}`}
                    <br />
                    {user.address.city}, {user.address.state} - {user.address.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {[
            { icon: Icons.history, label: { en: "Pickup History", hi: "पिकअप इतिहास" }, path: "/customer/pickups" },
            { icon: Icons.wallet, label: { en: "Wallet & Payouts", hi: "वॉलेट और भुगतान" }, path: "/customer/wallet" },
            { icon: Icons.phone, label: { en: "Help & Support", hi: "सहायता और समर्थन" }, path: "#" },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium flex-1 text-left">{t(label.en, label.hi)}</span>
              <Icons.chevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <Icons.logout className="h-5 w-5" />
          {t("Logout", "लॉग आउट")}
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>KabadiWala v1.0.0</p>
          <p>{t("Made with ♻️ in India", "भारत में ♻️ के साथ बनाया गया")}</p>
        </div>
      </div>
    </CustomerLayout>
  );
}
