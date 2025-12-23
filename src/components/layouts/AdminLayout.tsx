// import { ReactNode } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useApp } from "@/context/AppContext";
// import { Icons } from "@/components/Icons";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// export function AdminLayout({ children, title }: { children: ReactNode; title?: string }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { logout } = useApp();

//   const navItems = [
//     { path: "/admin", icon: Icons.analytics, label: "Dashboard" },
//     { path: "/admin/pricing", icon: Icons.rupee, label: "Pricing" },
//     { path: "/admin/collectors", icon: Icons.users, label: "Collectors" },
//   ];

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <header className="sticky top-0 z-50 glass border-b border-border/50">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center">
//               <Icons.settings className="h-5 w-5 text-accent-foreground" />
//             </div>
//             <h1 className="font-heading font-semibold">{title || "Admin Panel"}</h1>
//           </div>
//           <Button variant="ghost" size="icon-sm" onClick={() => { logout(); navigate("/"); }}>
//             <Icons.logout className="h-5 w-5" />
//           </Button>
//         </div>
//       </header>
//       <main className="flex-1 pb-20">{children}</main>
//       <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
//         <div className="flex items-center justify-around py-2">
//           {navItems.map(({ path, icon: Icon, label }) => (
//             <button key={path} onClick={() => navigate(path)} className={cn("flex flex-col items-center gap-1 px-4 py-2", location.pathname === path ? "text-accent" : "text-muted-foreground")}>
//               <Icon className="h-6 w-6" />
//               <span className="text-xs font-medium">{label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>
//     </div>
//   );
// }




import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminLayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();

  const navItems = [
    { path: "/admin", icon: Icons.analytics, label: "Dashboard" },
    { path: "/admin/pricing", icon: Icons.rupee, label: "Pricing" },
    { path: "/admin/collectors", icon: Icons.users, label: "Collectors" },
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
            <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Icons.settings className="h-5 w-5 text-accent-foreground" />
            </div>
            <h1 className="font-heading font-semibold">
              {title || "Admin Panel"}
            </h1>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
            <Icons.logout className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2",
                isActive(path)
                  ? "text-accent"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
