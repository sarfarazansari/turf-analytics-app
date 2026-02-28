"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && role === "STAFF") {
      if (window.location.pathname === "/dashboard") {
        router.replace("/bookings/new");
      }
    }
  }, [role, loading, router]);

  if (loading) return null;

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="p-6">{children}</main>
    </div>
  );
}
