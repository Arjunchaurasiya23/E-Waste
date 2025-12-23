// import { ReactNode } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useApp } from "@/context/AppContext";
// import { Icons } from "@/components/Icons";
// import { LanguageToggle } from "@/components/LanguageToggle";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface CollectorLayoutProps {
//   children: ReactNode;
//   title?: string;
// }

// export function CollectorLayout({ children, title }: CollectorLayoutProps) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout, t } = useApp();

//   const navItems = [
//     { path: "/collector", icon: Icons.home, label: { en: "Home", hi: "होम" } },
//     { path: "/collector/earnings", icon: Icons.wallet, label: { en: "Earnings", hi: "कमाई" } },
//   ];

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <header className="sticky top-0 z-50 glass border-b border-border/50">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg bg-gradient-secondary flex items-center justify-center">
//               <Icons.truck className="h-5 w-5 text-secondary-foreground" />
//             </div>
//             <div>
//               <h1 className="font-heading font-semibold">{title || "Collector"}</h1>
//               {user && <p className="text-xs text-muted-foreground">{user.name}</p>}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <LanguageToggle />
//             <Button variant="ghost" size="icon-sm" onClick={() => { logout(); navigate("/"); }}>
//               <Icons.logout className="h-5 w-5 text-muted-foreground" />
//             </Button>
//           </div>
//         </div>
//       </header>
//       <main className="flex-1 pb-20">{children}</main>
//       <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
//         <div className="flex items-center justify-around py-2">
//           {navItems.map(({ path, icon: Icon, label }) => {
//             const isActive = location.pathname === path;
//             return (
//               <button key={path} onClick={() => navigate(path)} className={cn("flex flex-col items-center gap-1 px-6 py-2 rounded-lg", isActive ? "text-secondary" : "text-muted-foreground")}>
//                 <Icon className="h-6 w-6" />
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

interface CollectorLayoutProps {
  children: ReactNode;
  title?: string;
}

export function CollectorLayout({ children, title }: CollectorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, t } = useApp();

  const navItems = [
    { path: "/collector", icon: Icons.home, label: { en: "Home", hi: "होम" } },
    {
      path: "/collector/earnings",
      icon: Icons.wallet,
      label: { en: "Earnings", hi: "कमाई" },
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-secondary flex items-center justify-center">
              <Icons.truck className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-semibold">
                {title || "Collector"}
              </h1>
              {user?.name && (
                <p className="text-xs text-muted-foreground">{user.name}</p>
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

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-lg",
                  active ? "text-secondary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-6 w-6" />
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
