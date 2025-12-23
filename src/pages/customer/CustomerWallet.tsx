import { useState } from "react";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { AmountDisplay } from "@/components/AmountDisplay";
import { toast } from "sonner";

export default function CustomerWallet() {
  const { user, walletBalance, transactions, addTransaction, t } = useApp();
  const [showPayout, setShowPayout] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");

  const userTransactions = transactions.filter(txn => txn.userId === user?.id);

  const handlePayout = () => {
    if (!upiId.includes("@")) {
      toast.error(t("Enter valid UPI ID", "सही UPI ID दर्ज करें"));
      return;
    }
    
    const payoutAmount = parseFloat(amount);
    if (payoutAmount < 10) {
      toast.error(t("Minimum payout is ₹10", "न्यूनतम भुगतान ₹10 है"));
      return;
    }
    
    if (payoutAmount > walletBalance) {
      toast.error(t("Insufficient balance", "अपर्याप्त बैलेंस"));
      return;
    }

    addTransaction({
      userId: user!.id,
      type: "payout",
      amount: payoutAmount,
      description: `UPI Payout to ${upiId}`,
      status: "completed",
      upiId,
    });

    toast.success(t(`₹${payoutAmount} sent to ${upiId}`, `₹${payoutAmount} ${upiId} को भेजा गया`));
    setShowPayout(false);
    setUpiId("");
    setAmount("");
  };

  return (
    <CustomerLayout title={t("Wallet", "वॉलेट")} showBack>
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Balance Card */}
        <Card variant="elevated" className="bg-gradient-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-6 relative">
            <p className="text-sm opacity-90 mb-2">
              {t("Available Balance", "उपलब्ध बैलेंस")}
            </p>
            <AmountDisplay amount={walletBalance} size="xl" className="text-primary-foreground mb-6" />
            
            <Button 
              variant="glass" 
              size="lg"
              className="w-full bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
              onClick={() => setShowPayout(true)}
              disabled={walletBalance < 10}
            >
              <Icons.rupee className="h-5 w-5" />
              {t("Withdraw to UPI", "UPI में निकालें")}
            </Button>
          </CardContent>
        </Card>

        {/* Payout Form */}
        {showPayout && (
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold">
                  {t("Withdraw Money", "पैसे निकालें")}
                </h3>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowPayout(false)}>
                  <Icons.close className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("UPI ID", "UPI ID")}
                </label>
                <Input
                  placeholder="9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Amount", "राशि")}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  {[50, 100, walletBalance].filter(v => v <= walletBalance && v >= 10).map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(val.toString())}
                    >
                      ₹{val}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handlePayout}
              >
                {t("Confirm Withdrawal", "निकासी की पुष्टि करें")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
            {t("Transaction History", "लेनदेन इतिहास")}
          </h2>

          {userTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Icons.history className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {t("No transactions yet", "अभी तक कोई लेनदेन नहीं")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userTransactions.map((txn) => (
                <Card key={txn.id} variant="bordered">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        txn.type === "credit" 
                          ? "bg-success/15 text-success" 
                          : "bg-destructive/15 text-destructive"
                      }`}>
                        {txn.type === "credit" ? (
                          <Icons.plus className="h-6 w-6" />
                        ) : (
                          <Icons.rupee className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {txn.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className={`font-heading font-semibold ${
                        txn.type === "credit" ? "text-success" : "text-foreground"
                      }`}>
                        {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </CustomerLayout>
  );
}
