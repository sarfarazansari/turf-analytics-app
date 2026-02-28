"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const { user, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <div className="font-semibold text-lg">
          Turf Analytics
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 text-sm">
          {role === "ADMIN" && (
            <>
              <Link
                href="/dashboard"
                className={isActive("/dashboard") ? "font-semibold" : ""}
              >
                Dashboard
              </Link>

              <Link
                href="/bookings"
                className={isActive("/bookings") && !isActive("/bookings/new") ? "font-semibold" : ""}
              >
                Bookings
              </Link>
            </>
          )}

          {/* Both ADMIN & STAFF can create booking */}
          {(role === "ADMIN" || role === "STAFF") && (
            <Link
              href="/bookings/new"
              className={isActive("/bookings/new") ? "font-semibold" : ""}
            >
              New Booking
            </Link>
          )}
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <p>{user?.email}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-black text-white rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}