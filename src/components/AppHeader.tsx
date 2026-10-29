"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { NAVIGATION } from "@/config/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";

export default function AppHeader() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) return null;

  const navItems = NAVIGATION.filter(
    (item) => role && item.roles.includes(role)
  );

  const isActive = (href: string, exact?: boolean) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <header className="flex items-center justify-between border-b px-4 py-4">
      <div className="flex items-center gap-6">
        <Sheet>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          >
            <Menu size={22} />
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Navigate to the main sections of Turf Analytics.
                </SheetDescription>
              </VisuallyHidden>
            </SheetHeader>

            <nav aria-label="Mobile navigation" className="mt-6 flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      isActive(item.href, item.exact)
                        ? "rounded-md py-1 font-semibold"
                        : "rounded-md py-1"
                    }
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" aria-label="Turf Analytics dashboard">
          <Image
            src="/logo.png"
            alt="Turf Analytics"
            width={34}
            height={34}
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden gap-5 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href, item.exact) ? "font-semibold" : ""
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open user menu"
              className="flex h-9 shrink-0 cursor-pointer items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <Image
                  src="/avatars/avatar-12.png"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown size={16} className="hidden h-4 w-4 sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end" className="w-48 sm:w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-medium">{user?.email}</span>
              <span className="text-xs text-muted-foreground">{role}</span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
