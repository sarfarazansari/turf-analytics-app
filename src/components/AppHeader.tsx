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
  SheetHeader,
  SheetTitle,
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
    <header className="flex items-center justify-between px-4 py-4 border-b">

      {/* LEFT */}
      <div className="flex items-center gap-6">

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu size={22} />
          </SheetTrigger>

          <SheetContent side="left" className="w-64">

            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>

          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Turf Analytics"
            width={34}
            height={34}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-5 text-sm">

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href, item.exact)
                  ? "font-semibold"
                  : ""
              }
            >
              {item.label}
            </Link>
          ))}

        </nav>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 shrink-0">
      <DropdownMenu>

        <DropdownMenuTrigger asChild className="flex items-center gap-2 cursor-pointer">
          <button className="flex items-center gap-2 h-9 px-2 shrink-0">
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

          <ChevronDown size={16} className="hidden sm:block h-4 w-4" />
          </button>

        </DropdownMenuTrigger>

        <DropdownMenuContent
        side="bottom"
        align="end" className="w-48 sm:w-56">

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