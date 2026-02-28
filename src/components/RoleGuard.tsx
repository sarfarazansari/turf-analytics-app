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
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role && !allowedRoles.includes(role)) {
      router.replace("/dashboard");
    }
  }, [role, loading, allowedRoles, router]);

  if (loading || !role) return null;

  if (!allowedRoles.includes(role)) return null;

  return <>{children}</>;
}