"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, LogOut } from "lucide-react";

export default function Header() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      // Glass effect removed. Solid white background with a subtle border.
      className="sticky top-0 z-50 border-b-6 shadow-2xl border-slate-100 bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LEFT — LOGO + BRAND */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
            <BarChart3 size={20} className="text-white relative z-10" strokeWidth={2.5} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
            Khabri
          </span>
        </Link>

        {/* RIGHT — NAV LINKS */}
        <div className="flex items-center gap-2">
          
          <NavLink href="/market-overview">Market Overview</NavLink>
          <NavLink href="/watchlist">Watchlist</NavLink>

          <div className="mx-2 h-6 w-px bg-slate-200" /> 

          <button
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-5 py-2 text-[14px] font-medium text-white shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95"
          >
            <span>Logout</span>
            <LogOut size={14} className="opacity-70 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

// NavLink Helper
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative rounded-xl px-4 py-2 text-[14px] font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}