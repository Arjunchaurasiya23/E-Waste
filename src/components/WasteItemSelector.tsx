import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { WasteIcon } from "@/components/WasteIcon";
import { AmountDisplay } from "@/components/AmountDisplay";
import { WasteType } from "@/types";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WasteItemSelectorProps {
  onItemAdd?: () => void;
  className?: string;
}

export function WasteItemSelector({ onItemAdd, className }: WasteItemSelectorProps) {
  const { wastePricing, addToWasteBag, t } = useApp();
  const [selectedType, setSelectedType] = useState<WasteType | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [unknownWeight, setUnknownWeight] = useState(false);

  const selectedPricing = wastePricing.find(w => w.type === selectedType);
  const estimatedAmount = selectedPricing && !unknownWeight ? parseFloat(quantity || "0") * selectedPricing.pricePerKg : null;

  const handleAdd = () => {
    if (!selectedType || !selectedPricing) return;
    
    if (!unknownWeight && (!quantity || parseFloat(quantity) <= 0)) {
      toast.error(t("Please enter a valid quantity", "कृपया एक वैध मात्रा दर्ज करें"));
      return;
    }

    addToWasteBag({
      type: selectedType,
      estimatedWeight: unknownWeight ? null : parseFloat(quantity),
      pricePerKg: selectedPricing.pricePerKg,
      estimatedAmount: unknownWeight ? null : estimatedAmount,
    });

    toast.success(t("Added to waste bag!", "कबाड़ बैग में जोड़ा गया!"));
    
    // Reset form
    setSelectedType(null);
    setQuantity("");
    setUnknownWeight(false);
    onItemAdd?.();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Waste Type Selection */}
      <div className="grid grid-cols-3 gap-3">
        {wastePricing.map((item) => (
          <button
            key={item.type}
            onClick={() => setSelectedType(item.type)}
            className={cn(
              "p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center",
              selectedType === item.type 
                ? "border-primary bg-primary-light" 
                : "border-border hover:border-primary/50"
            )}
          >
            <WasteIcon type={item.type} size="sm" />
            <p className="text-xs font-medium mt-2 line-clamp-1">
              {t(item.label.en, item.label.hi)}
            </p>
            <p className="text-xs text-muted-foreground">₹{item.pricePerKg}/kg</p>
          </button>
        ))}
      </div>

      {/* Quantity Input */}
      {selectedType && selectedPricing && (
        <Card variant="bordered" className="animate-fade-in">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WasteIcon type={selectedType} size="sm" />
                <span className="font-medium">{t(selectedPricing.label.en, selectedPricing.label.hi)}</span>
              </div>
              <AmountDisplay amount={selectedPricing.pricePerKg} size="sm" prefix="/kg" />
            </div>

            {/* Unknown Weight Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Icons.info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t("I don't know the weight", "मुझे वजन नहीं पता")}</span>
              </div>
              <Switch 
                checked={unknownWeight} 
                onCheckedChange={setUnknownWeight}
              />
            </div>

            {/* Weight Input */}
            {!unknownWeight && (
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="text-center text-2xl h-14 font-heading"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    kg
                  </span>
                </div>
                
                {/* Quick Select */}
                <div className="flex gap-2 justify-center">
                  {[2, 5, 10, 20].map((val) => (
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
            )}

            {unknownWeight && (
              <div className="text-center py-4 text-muted-foreground">
                <Icons.info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("Final amount decided after weighing", "अंतिम राशि तौलने के बाद तय होगी")}</p>
              </div>
            )}

            {/* Estimated Amount */}
            {!unknownWeight && parseFloat(quantity) > 0 && (
              <div className="flex items-center justify-between p-3 bg-primary-light rounded-lg">
                <span className="text-sm font-medium">{t("Subtotal", "उप-योग")}</span>
                <AmountDisplay amount={estimatedAmount!} size="md" animated />
              </div>
            )}

            {/* Add Button */}
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleAdd}
              disabled={!unknownWeight && (!quantity || parseFloat(quantity) <= 0)}
            >
              <Icons.plus className="h-5 w-5" />
              {t("Add to Bag", "बैग में जोड़ें")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
