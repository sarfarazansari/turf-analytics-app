"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Role = "ADMIN" | "STAFF";

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
}) {
  const { role, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (!loading && role && !allowedRoles.includes(role)) {
      router.replace("/dashboard");
    }
  }, [loading, user, role, allowedRoles, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return null;

  if (role && !allowedRoles.includes(role)) return null;

  return <>{children}</>;
}