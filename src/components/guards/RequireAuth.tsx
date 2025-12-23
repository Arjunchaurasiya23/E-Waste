/**
 * RequireAuth Guard
 * 
 * Protects routes that require authentication.
 * Checks Context API for user (non-breaking approach).
 * Redirects to login if not authenticated.
 */

import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * RequireAuth component - protects routes requiring authentication
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      // Store intended destination for post-login redirect
      const returnTo = location.pathname + location.search;
      navigate("/", {
        replace: true,
        state: { returnTo },
      });
    }
  }, [isAuthenticated, navigate, location]);

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

