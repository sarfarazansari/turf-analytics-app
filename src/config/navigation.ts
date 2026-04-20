export type Role = "ADMIN" | "STAFF";

export type NavItem = {
  label: string;
  href: string;
  roles: Role[];
  exact?: boolean;
};

export const NAVIGATION: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["ADMIN"],
  },
  {
    label: "Bookings",
    href: "/bookings",
    roles: ["ADMIN"],
  },
  {
    label: "New",
    href: "/bookings/new",
    roles: ["ADMIN", "STAFF"],
    exact: true,
  },
  {
    label: "Customers",
    href: "/customers",
    roles: ["ADMIN", "STAFF"],
    exact: true,
  },
];