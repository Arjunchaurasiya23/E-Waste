import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { WasteIcon } from "@/components/WasteIcon";
import { AmountDisplay } from "@/components/AmountDisplay";
import { WasteType, Address } from "@/types";
import { TIME_SLOTS } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "type" | "quantity" | "schedule" | "address" | "confirm";

export default function SchedulePickup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, wastePricing, addPickup, t } = useApp();

  const [step, setStep] = useState<Step>(location.state?.wasteType ? "quantity" : "type");
  const [selectedType, setSelectedType] = useState<WasteType | null>(location.state?.wasteType || null);
  const [quantity, setQuantity] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>(user?.address || {
    line1: "",
    city: "Delhi",
    state: "Delhi",
    pincode: user?.pincode || "",
  });

  const selectedPricing = wastePricing.find(w => w.type === selectedType);
  const estimatedAmount = selectedPricing ? parseFloat(quantity || "0") * selectedPricing.pricePerKg : 0;

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const handleNext = () => {
    const steps: Step[] = ["type", "quantity", "schedule", "address", "confirm"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["type", "quantity", "schedule", "address", "confirm"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = () => {
    if (!selectedType || !selectedDate || !selectedSlot || !user) return;

    const slot = TIME_SLOTS.find(s => s.id === selectedSlot)!;

    addPickup({
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      address,
      wasteType: selectedType,
      estimatedWeight: parseFloat(quantity),
      estimatedAmount,
      status: "requested",
      scheduledDate: selectedDate,
      scheduledSlot: slot,
    });

    toast.success(t("Pickup scheduled successfully!", "पिकअप सफलतापूर्वक शेड्यूल हो गया!"));
    navigate("/customer/pickups");
  };

  const isStepValid = () => {
    switch (step) {
      case "type":
        return !!selectedType;
      case "quantity":
        return parseFloat(quantity) >= (selectedPricing?.minQuantity || 0);
      case "schedule":
        return !!selectedDate && !!selectedSlot;
      case "address":
        return address.line1.length > 5 && address.pincode.length === 6;
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  return (
    <CustomerLayout title={t("Schedule Pickup", "पिकअप शेड्यूल करें")} showBack>
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          {["type", "quantity", "schedule", "address", "confirm"].map((s, i) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                step === s ? "w-6 bg-primary" : 
                ["type", "quantity", "schedule", "address", "confirm"].indexOf(step) > i 
                  ? "bg-primary" 
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step: Select Type */}
        {step === "type" && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold text-center">
              {t("What do you want to sell?", "आप क्या बेचना चाहते हैं?")}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {wastePricing.map((item) => (
                <Card
                  key={item.type}
                  variant={selectedType === item.type ? "elevated" : "bordered"}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedType === item.type && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedType(item.type)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <WasteIcon type={item.type} size="md" />
                    <p className="font-medium mt-3 mb-1">
                      {t(item.label.en, item.label.hi)}
                    </p>
                    <AmountDisplay amount={item.pricePerKg} size="sm" prefix={t("/kg", "/किलो")} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step: Quantity */}
        {step === "quantity" && selectedPricing && (
          <div className="space-y-6">
            <div className="text-center">
              <WasteIcon type={selectedType!} size="lg" className="mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold">
                {t("How much do you have?", "आपके पास कितना है?")}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {t(`Minimum ${selectedPricing.minQuantity} kg`, `कम से कम ${selectedPricing.minQuantity} किलो`)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-center text-3xl h-16 font-heading"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  kg
                </span>
              </div>

              {/* Quick Select */}
              <div className="flex gap-2 justify-center">
                {[5, 10, 20, 50].map((val) => (
                  <Button
                    key={val}
                    variant={quantity === val.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuantity(val.toString())}
                  >
                    {val} kg
                  </Button>
                ))}
              </div>
            </div>

            {parseFloat(quantity) > 0 && (
              <Card variant="elevated" className="bg-primary-light">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("Estimated Earnings", "अनुमानित कमाई")}
                  </p>
                  <AmountDisplay amount={estimatedAmount} size="xl" animated />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step: Schedule */}
        {step === "schedule" && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold text-center">
              {t("When should we come?", "हम कब आएं?")}
            </h2>

            {/* Date Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {t("Select Date", "तारीख चुनें")}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((date) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
                  const dayNum = date.getDate();
                  const month = date.toLocaleDateString("en-IN", { month: "short" });
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex flex-col items-center p-3 rounded-xl border-2 min-w-[70px] transition-all",
                        isSelected 
                          ? "border-primary bg-primary-light" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-xs text-muted-foreground">{dayName}</span>
                      <span className={cn("text-xl font-heading font-bold", isSelected && "text-primary")}>
                        {dayNum}
                      </span>
                      <span className="text-xs text-muted-foreground">{month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {t("Select Time", "समय चुनें")}
              </p>
              <div className="space-y-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                        isSelected 
                          ? "border-primary bg-primary-light" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Icons.clock className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("font-medium", isSelected && "text-primary")}>
                        {t(slot.label.en, slot.label.hi)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step: Address */}
        {step === "address" && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold text-center">
              {t("Pickup Address", "पिकअप का पता")}
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Address Line 1", "पता पंक्ति 1")}
                </label>
                <Input
                  placeholder={t("House/Flat No., Building Name", "घर/फ्लैट नंबर, बिल्डिंग का नाम")}
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Landmark (Optional)", "लैंडमार्क (वैकल्पिक)")}
                </label>
                <Input
                  placeholder={t("Near temple, school, etc.", "मंदिर, स्कूल के पास, आदि")}
                  value={address.landmark || ""}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Pincode", "पिनकोड")}
                  </label>
                  <Input
                    placeholder="110016"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    maxLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("City", "शहर")}
                  </label>
                  <Input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && selectedPricing && selectedDate && selectedSlot && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold text-center">
              {t("Confirm Pickup", "पिकअप की पुष्टि करें")}
            </h2>

            <Card variant="elevated">
              <CardContent className="p-5 space-y-4">
                {/* Waste Type */}
                <div className="flex items-center gap-4">
                  <WasteIcon type={selectedType!} size="md" />
                  <div>
                    <p className="font-medium">{t(selectedPricing.label.en, selectedPricing.label.hi)}</p>
                    <p className="text-sm text-muted-foreground">{quantity} kg × ₹{selectedPricing.pricePerKg}/kg</p>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Schedule */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary-light flex items-center justify-center">
                    <Icons.calendar className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(TIME_SLOTS.find(s => s.id === selectedSlot)!.label.en, TIME_SLOTS.find(s => s.id === selectedSlot)!.label.hi)}
                    </p>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
                    <Icons.location className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{t("Pickup Address", "पिकअप का पता")}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.line1}
                      {address.landmark && `, ${address.landmark}`}
                      <br />
                      {address.city} - {address.pincode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Amount */}
            <Card variant="elevated" className="bg-primary-light">
              <CardContent className="p-4 flex items-center justify-between">
                <p className="font-medium">{t("Estimated Earnings", "अनुमानित कमाई")}</p>
                <AmountDisplay amount={estimatedAmount} size="lg" />
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center">
              {t(
                "Final amount may vary based on actual weight",
                "वास्तविक वजन के आधार पर अंतिम राशि भिन्न हो सकती है"
              )}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>
            <Icons.back className="h-5 w-5" />
            {t("Back", "वापस")}
          </Button>
          
          {step === "confirm" ? (
            <Button 
              variant="hero" 
              size="lg" 
              className="flex-1"
              onClick={handleSubmit}
            >
              {t("Confirm", "पुष्टि करें")}
              <Icons.check className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="hero" 
              size="lg" 
              className="flex-1"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {t("Next", "आगे")}
              <Icons.chevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
