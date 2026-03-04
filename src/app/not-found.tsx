"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="text-muted-foreground text-lg">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/dashboard"
        className="rounded-lg bg-primary px-6 py-3 text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}