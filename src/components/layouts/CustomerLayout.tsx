// import { ReactNode } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useApp } from "@/context/AppContext";
// import { Icons } from "@/components/Icons";
// import { LanguageToggle } from "@/components/LanguageToggle";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface CustomerLayoutProps {
//   children: ReactNode;
//   title?: string;
//   showBack?: boolean;
// }

// export function CustomerLayout({ children, title, showBack }: CustomerLayoutProps) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout, t } = useApp();

//   const navItems = [
//     { path: "/customer", icon: Icons.home, label: { en: "Home", hi: "होम" } },
//     { path: "/customer/pickups", icon: Icons.package, label: { en: "Pickups", hi: "पिकअप" } },
//     { path: "/customer/wallet", icon: Icons.wallet, label: { en: "Wallet", hi: "वॉलेट" } },
//     { path: "/customer/profile", icon: Icons.user, label: { en: "Profile", hi: "प्रोफ़ाइल" } },
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       {/* Header */}
//       <header className="sticky top-0 z-50 glass border-b border-border/50">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-3">
//             {showBack ? (
//               <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
//                 <Icons.back className="h-5 w-5" />
//               </Button>
//             ) : (
//               <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
//                 <Icons.recycle className="h-5 w-5 text-primary-foreground" />
//               </div>
//             )}
//             <div>
//               <h1 className="font-heading font-semibold text-foreground">
//                 {title || "KabadiWala"}
//               </h1>
//               {!title && user && (
//                 <p className="text-xs text-muted-foreground">
//                   {t("Hi", "नमस्ते")}, {user.name.split(" ")[0]}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <LanguageToggle />
//             <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
//               <Icons.logout className="h-5 w-5 text-muted-foreground" />
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 pb-20 overflow-auto">
//         {children}
//       </main>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
//         <div className="flex items-center justify-around py-2">
//           {navItems.map(({ path, icon: Icon, label }) => {
//             const isActive = location.pathname === path;
//             return (
//               <button
//                 key={path}
//                 onClick={() => navigate(path)}
//                 className={cn(
//                   "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[70px]",
//                   isActive 
//                     ? "text-primary" 
//                     : "text-muted-foreground hover:text-foreground"
//                 )}
//               >
//                 <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
//                 <span className="text-xs font-medium">{t(label.en, label.hi)}</span>
//               </button>
//             );
//           })}
//         </div>
//       </nav>
//     </div>
//   );
// }




import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Icons } from "@/components/Icons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

export function CustomerLayout({
  children,
  title,
  showBack,
}: CustomerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, t } = useApp();

  const navItems = [
    { path: "/customer", icon: Icons.home, label: { en: "Home", hi: "होम" } },
    {
      path: "/customer/pickups",
      icon: Icons.package,
      label: { en: "Pickups", hi: "पिकअप" },
    },
    {
      path: "/customer/wallet",
      icon: Icons.wallet,
      label: { en: "Wallet", hi: "वॉलेट" },
    },
    {
      path: "/customer/profile",
      icon: Icons.user,
      label: { en: "Profile", hi: "प्रोफ़ाइल" },
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  const firstName = user?.name?.split(" ")?.[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => navigate(-1)}
              >
                <Icons.back className="h-5 w-5" />
              </Button>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Icons.recycle className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="font-heading font-semibold text-foreground">
                {title || "KabadiWala"}
              </h1>
              {!title && firstName && (
                <p className="text-xs text-muted-foreground">
                  {t("Hi", "नमस्ते")}, {firstName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
              <Icons.logout className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-20 overflow-auto">{children}</main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[70px]",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6", active && "text-primary")} />
                <span className="text-xs font-medium">
                  {t(label.en, label.hi)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
