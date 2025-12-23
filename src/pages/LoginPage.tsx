import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/Icons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, t } = useApp();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [isLoading, setIsLoading] = useState(false);

  const roles: { role: UserRole; label: { en: string; hi: string }; icon: keyof typeof Icons; description: { en: string; hi: string } }[] = [
    { 
      role: "customer", 
      label: { en: "Customer", hi: "ग्राहक" }, 
      icon: "user",
      description: { en: "Sell your scrap", hi: "अपना कबाड़ बेचें" }
    },
    { 
      role: "collector", 
      label: { en: "Collector", hi: "संग्राहक" }, 
      icon: "truck",
      description: { en: "Collect scrap", hi: "कबाड़ उठाएं" }
    },
    { 
      role: "admin", 
      label: { en: "Admin", hi: "एडमिन" }, 
      icon: "settings",
      description: { en: "Manage platform", hi: "प्लेटफॉर्म प्रबंधन" }
    },
  ];

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      toast.error(t("Enter valid 10 digit number", "10 अंकों का सही नंबर डालें"));
      return;
    }
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast.success(t("OTP sent to +91 " + phone, "OTP भेजा गया +91 " + phone));
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      toast.error(t("Enter 4 digit OTP", "4 अंकों का OTP डालें"));
      return;
    }
    setIsLoading(true);
    // Simulate OTP verification (demo: any 4 digit works)
    setTimeout(() => {
      setIsLoading(false);
      login(phone, selectedRole);
      toast.success(t("Login successful!", "लॉगिन सफल!"));
      
      // Navigate based on role
      if (selectedRole === "customer") {
        navigate("/customer");
      } else if (selectedRole === "collector") {
        navigate("/collector");
      } else {
        navigate("/admin");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Icons.recycle className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">KabadiWala</span>
        </div>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              {t("Sell Scrap, Earn Cash", "कबाड़ बेचो, पैसे कमाओ")}
            </h1>
            <p className="text-muted-foreground">
              {t("Best prices, doorstep pickup, instant payment", "सबसे अच्छे दाम, घर से पिकअप, तुरंत भुगतान")}
            </p>
          </div>

          <Card variant="elevated" className="w-full">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">
                {step === "phone" 
                  ? t("Login / Sign Up", "लॉगिन / साइन अप") 
                  : t("Enter OTP", "OTP दर्ज करें")}
              </CardTitle>
              <CardDescription>
                {step === "phone"
                  ? t("Select your role and enter phone number", "अपनी भूमिका चुनें और फोन नंबर डालें")
                  : t("We sent a code to +91 " + phone, "हमने +91 " + phone + " पर कोड भेजा")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === "phone" ? (
                <>
                  {/* Role Selection */}
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map(({ role, label, icon, description }) => {
                      const Icon = Icons[icon];
                      const isSelected = selectedRole === role;
                      return (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                            isSelected 
                              ? "border-primary bg-primary-light" 
                              : "border-border hover:border-primary/50 hover:bg-muted"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {t(label.en, label.hi)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t("Phone Number", "फोन नंबर")}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center px-4 bg-muted rounded-lg border-2 border-input text-muted-foreground font-medium">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="flex-1 text-lg tracking-wider"
                      />
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleSendOtp}
                    disabled={isLoading || phone.length !== 10}
                  >
                    {isLoading ? (
                      <span className="animate-pulse">{t("Sending...", "भेज रहे हैं...")}</span>
                    ) : (
                      <>
                        {t("Get OTP", "OTP प्राप्त करें")}
                        <Icons.chevronRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t("Enter 4-digit OTP", "4 अंकों का OTP दर्ज करें")}
                    </label>
                    <Input
                      type="tel"
                      placeholder="• • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="text-center text-2xl tracking-[0.5em] font-mono"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {t("Demo: Enter any 4 digits", "डेमो: कोई भी 4 अंक डालें")}
                    </p>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 4}
                  >
                    {isLoading ? (
                      <span className="animate-pulse">{t("Verifying...", "जांच रहे हैं...")}</span>
                    ) : (
                      <>
                        {t("Verify & Login", "सत्यापित करें")}
                        <Icons.check className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <button 
                    onClick={() => setStep("phone")}
                    className="w-full text-sm text-primary hover:underline"
                  >
                    {t("← Change number", "← नंबर बदलें")}
                  </button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Icons.check className="h-4 w-4 text-success" />
              {t("Verified Partners", "सत्यापित पार्टनर")}
            </div>
            <div className="flex items-center gap-2">
              <Icons.check className="h-4 w-4 text-success" />
              {t("Instant Payment", "तुरंत भुगतान")}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
