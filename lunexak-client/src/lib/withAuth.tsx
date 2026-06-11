"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type Role = "admin" | "employee" | "customer";

interface WithAuthOptions {
  allowedRoles?: Role[];
  redirectTo?: string;
}

/**
 * withAuth HOC — wraps a page component and redirects if the user
 * is not logged in or does not have the required role.
 *
 * Usage:
 *   export default withAuth(MyPage, { allowedRoles: ["admin"] });
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { allowedRoles, redirectTo = "/login" } = options;

  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;
      if (!user) {
        router.replace(redirectTo);
        return;
      }
      if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
        router.replace("/"); // Redirect unauthorized roles to home
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
        </div>
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
      return null;
    }

    return <Component {...props} />;
  };
}
