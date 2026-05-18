"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Watchlist", path: "/watchlist" },
    { name: "Compare", path: "/compare" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="w-full h-16 flex items-center justify-between px-10 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <Link href="/dashboard" className="text-2xl font-bold tracking-wide text-green-400">
        Khabri
      </Link>

      <div className="flex gap-8 text-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`transition font-medium ${
                isActive
                  ? "text-green-400 border-b-2 border-green-400 pb-1"
                  : "text-gray-300 hover:text-green-400"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
