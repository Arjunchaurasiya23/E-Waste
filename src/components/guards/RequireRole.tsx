/**
 * RequireRole Guard
 * 
 * Protects routes that require specific user roles.
 * Wraps RequireAuth and adds role-based access control.
 * Redirects to appropriate dashboard if role mismatch.
 */

import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { RequireAuth } from "./RequireAuth";

interface RequireRoleProps {
  children: ReactNode;
  /**
   * Allowed roles (frontend lowercase format)
   * Maps to backend: "customer" -> "CUSTOMER", "collector" -> "COLLECTOR", "admin" -> "ADMIN"
   */
  allowedRoles: Array<"customer" | "collector" | "admin">;
}

/**
 * Get dashboard route for a role
 */
function getDashboardRoute(role: "customer" | "collector" | "admin"): string {
  switch (role) {
    case "customer":
      return "/customer";
    case "collector":
      return "/collector";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}

/**
 * RequireRole component - protects routes requiring specific roles
 */
export function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role.toLowerCase() as "customer" | "collector" | "admin";
      
      if (!allowedRoles.includes(userRole)) {
        // User has wrong role - redirect to their dashboard
        const dashboardRoute = getDashboardRoute(userRole);
        navigate(dashboardRoute, { replace: true });
      }
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);

  // If authenticated but role check hasn't passed yet, show nothing
  if (isAuthenticated && user) {
    const userRole = user.role.toLowerCase() as "customer" | "collector" | "admin";
    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return (
    <RequireAuth>
      {children}
    </RequireAuth>
  );
}

