"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart } from "lucide-react";
import Header from "../components/Header";


const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

interface Stock {
  id: string;
  bse_scripcode: string;
  issuer_name: string;
  security_name: string;
  nse_symbol: string; // e.g. "NSE:TCS" or "TCS"
  isin: string;
  status: string;
  group: string;
  instrument: string;
}

export default function MarketOverview() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Helper: convert master JSON NSE symbol to the symbol backend expects (Yahoo-style)
  const toYahooSymbol = (nseSymbol: string) => {
    if (!nseSymbol) return "";
    const sym = nseSymbol.trim().toUpperCase();
    // "NSE:TCS" -> "TCS.NS"
    if (sym.startsWith("NSE:")) {
      const base = sym.split("NSE:")[1].trim();
      return `${base}.NS`;
    }
    // "TCS" -> "TCS.NS"
    if (!sym.endsWith(".NS")) {
      return `${sym}.NS`;
    }
    return sym;
  };

  // Load master JSON of all stocks
  useEffect(() => {
    fetch("/data/master-stock.json")
      .then((r) => r.json())
      .then((data: Stock[]) => setStocks(data))
      .catch((err) => console.error("Error loading master-stock.json", err));
  }, []);

  // Load wishlist from backend on mount
  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("idToken")
      : null;

    if (!token) return;

    setLoadingWishlist(true);
    fetch(`${API_BASE}/me/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
        }
      })
      .catch((err) => console.error("Error fetching wishlist", err))
      .finally(() => setLoadingWishlist(false));
  }, []);

  const toggleWatchlist = async (stock: Stock) => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("idToken")
      : null;

    if (!token) {
      alert("Please log in to use watchlist");
      return;
    }

    const yahooSymbol = toYahooSymbol(stock.nse_symbol);
    if (!yahooSymbol) return;

    const isInWishlist = wishlist.includes(yahooSymbol);
    const endpoint = isInWishlist
      ? "/me/wishlist/remove"
      : "/me/wishlist/add";

    // Optimistic update
    setWishlist((prev) =>
      isInWishlist
        ? prev.filter((s) => s !== yahooSymbol)
        : [...prev, yahooSymbol]
    );

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: yahooSymbol }),
      });

      if (!res.ok) {
        // rollback on failure
        setWishlist((prev) =>
          isInWishlist
            ? [...prev, yahooSymbol]
            : prev.filter((s) => s !== yahooSymbol)
        );
        const errData = await res.json().catch(() => ({}));
        console.error("Wishlist update failed", errData);
      } else {
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist); // sync with backend
        }
      }
    } catch (err) {
      console.error("Wishlist request error", err);
      // rollback
      setWishlist((prev) =>
        isInWishlist
          ? [...prev, yahooSymbol]
          : prev.filter((s) => s !== yahooSymbol)
      );
    }
  };

  const filtered = stocks.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.security_name.toLowerCase().includes(q) ||
      s.nse_symbol.toLowerCase().includes(q)
    );
  });

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <h1 className="text-5xl font-bold text-slate-900">
          Market Overview
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Browse India’s major listed companies.
        </p>

        {/* SEARCH BAR */}
        <div className="relative mt-10 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.06)]
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-slate-700 text-lg outline-none transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loadingWishlist && (
            <p className="mt-2 text-xs text-slate-400">
              Syncing your wishlist…
            </p>
          )}
        </div>
      </motion.div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((stock) => {
            const yahooSymbol = toYahooSymbol(stock.nse_symbol);
            const isInWishlist = wishlist.includes(yahooSymbol);

            return (
              <motion.div
                key={stock.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative group p-6 rounded-3xl bg-white/80 backdrop-blur-lg 
                           border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)] 
                           hover:shadow-[0_22px_70px_rgba(37,99,235,0.25)] 
                           hover:border-blue-300 transition-all"
              >
                {/* Hover Glow */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 
                             opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none"
                />

                {/* Top Row */}
                <div className="flex justify-between items-start mb-4 relative">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {stock.security_name}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {stock.nse_symbol}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWatchlist(stock)}
                    className={`p-2 rounded-full border bg-white/90 
                                shadow-sm hover:shadow-md transition cursor-pointer
                                ${
                                  isInWishlist
                                    ? "border-rose-300 bg-rose-50"
                                    : "border-slate-200"
                                }`}
                    title={
                      isInWishlist ? "Remove from watchlist" : "Add to watchlist"
                    }
                  >
                    <Heart
                      size={18}
                      className={
                        isInWishlist
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-600"
                      }
                    />
                  </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                    <p className="text-slate-500 text-xs">BSE Code</p>
                    <p className="font-semibold text-slate-900">
                      {stock.bse_scripcode}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                    <p className="text-slate-500 text-xs">Group</p>
                    <p className="font-semibold text-blue-600">
                      Group {stock.group}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                    <p className="text-slate-500 text-xs">Instrument</p>
                    <p className="font-semibold text-slate-900">
                      {stock.instrument}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                    <p className="text-slate-500 text-xs">Status</p>
                    <p
                      className={`font-semibold ${
                        stock.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stock.status}
                    </p>
                  </div>
                </div>

                {/* ISIN */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate max-w-[70%]">
                    {stock.isin}
                  </p>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    {yahooSymbol}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
