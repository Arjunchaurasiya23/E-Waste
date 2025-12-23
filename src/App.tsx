import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RequireAuth } from "@/components/guards/RequireAuth";
import { RequireRole } from "@/components/guards/RequireRole";

import LoginPage from "./pages/LoginPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SchedulePickup from "./pages/customer/SchedulePickup";
import CustomerPickups from "./pages/customer/CustomerPickups";
import CustomerWallet from "./pages/customer/CustomerWallet";
import CustomerProfile from "./pages/customer/CustomerProfile";
import WasteBagPage from "./pages/customer/WasteBagPage";
import CollectorDashboard from "./pages/collector/CollectorDashboard";
import CollectorEarnings from "./pages/collector/CollectorEarnings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminCollectors from "./pages/admin/AdminCollectors";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              
              {/* Customer Routes - Protected */}
              <Route
                path="/customer"
                element={
                  <RequireRole allowedRoles={["customer"]}>
                    <CustomerDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="/customer/schedule"
                element={
                  <RequireRole allowedRoles={["customer"]}>
                    <SchedulePickup />
                  </RequireRole>
                }
              />
              <Route
                path="/customer/pickups"
                element={
                  <RequireRole allowedRoles={["customer"]}>
                    <CustomerPickups />
                  </RequireRole>
                }
              />
              <Route
                path="/customer/wallet"
                element={
                  <RequireRole allowedRoles={["customer"]}>
                    <CustomerWallet />
                  </RequireRole>
                }
              />
              <Route
                path="/customer/profile"
                element={
                  <RequireRole allowedRoles={["customer"]}>
                    <CustomerProfile />
                  </RequireRole>
                }
              />
              <Route
                path="/customer/waste-bag"
                element={
                  <RequireRole allowedRoles={["customer"]}>
                    <WasteBagPage />
                  </RequireRole>
                }
              />
              
              {/* Collector Routes - Protected */}
              <Route
                path="/collector"
                element={
                  <RequireRole allowedRoles={["collector"]}>
                    <CollectorDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="/collector/earnings"
                element={
                  <RequireRole allowedRoles={["collector"]}>
                    <CollectorEarnings />
                  </RequireRole>
                }
              />
              
              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <RequireRole allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/pricing"
                element={
                  <RequireRole allowedRoles={["admin"]}>
                    <AdminPricing />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/collectors"
                element={
                  <RequireRole allowedRoles={["admin"]}>
                    <AdminCollectors />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <RequireRole allowedRoles={["admin"]}>
                    <AdminSettings />
                  </RequireRole>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
