"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

interface ChartPattern {
  pattern_found?: boolean;
  pattern_name?: string;
  confidence?: string;
  explanation?: string;
}

interface Signal {
  ticker?: string;
  bias?: string;
  confidence?: number;
  reasons?: string[];
  risks?: string[];
  latest_headlines?: string[];
  note?: string;
}

interface RatioMap {
  [key: string]: number;
}

interface BseNewsItem {
  index: number;
  heading: string;
  date: string;
  pdf_url?: string | null;
  summary?: string | null;
  attachment_name?: string;
  error?: string;
}

interface BseSummaries {
  stock: string;
  scripcode: string | null;
  news: BseNewsItem[];
  error?: string | null;
}

interface StockCache {
  symbol: string;
  raw_symbol?: string;
  base_symbol?: string;
  tv_symbol?: string;
  bse_identifier?: string;

  chart_image_base64?: string;

  chart_pattern?: ChartPattern;
  bse_summaries?: BseSummaries;
  ratios?: RatioMap;
  signal?: Signal;
  updatedAt?: any;

  bse_error?: string;
  chart_error?: string;
  ratios_error?: string;
  signal_error?: string;
}

interface CacheResponse {
  userID: string;
  wishlist: string[];
  stocks: {
    [symbol: string]: StockCache;
  };
}

export default function WatchlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [stocks, setStocks] = useState<StockCache[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<StockCache | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("idToken")
        : null;

    if (!token) {
      setError("Please log in to view your watchlist.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}/me/cache`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load watchlist.");
        }
        return r.json();
      })
      .then((data: CacheResponse) => {
        setWishlist(data.wishlist || []);
        setStocks(Object.values(data.stocks || {}));
        setError(null);
      })
      .catch((e: any) => {
        console.error(e);
        setError(e.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, []);

  const aggregatedNews = useMemo(() => {
    const all: { stock: string; item: BseNewsItem }[] = [];
    stocks.forEach((s) => {
      const stockName =
        s.base_symbol || s.bse_identifier || s.symbol || "Unknown";
      const newsList = s.bse_summaries?.news || [];
      newsList.forEach((n) => {
        all.push({ stock: stockName, item: n });
      });
    });
    return all.slice(0, 4);
  }, [stocks]);

  const formatBias = (bias?: string) => {
    if (!bias) return "—";
    const b = bias.toLowerCase();
    if (b === "bullish") return "Bullish";
    if (b === "bearish") return "Bearish";
    if (b === "neutral") return "Neutral";
    return bias;
  };

  const biasColor = (bias?: string) => {
    const b = (bias || "").toLowerCase();
    if (b === "bullish") return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (b === "bearish") return "text-rose-700 bg-rose-50 border-rose-200";
    if (b === "neutral") return "text-slate-700 bg-slate-50 border-slate-200";
    return "text-slate-700 bg-slate-50 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-wide text-slate-500 uppercase">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-slate-900">
              Your watchlist at a glance
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">
              Quick snapshot of patterns, fundamentals, and AI signals across
              all the stocks you&#39;re tracking.
            </p>
          </div>
          <div className="text-xs md:text-sm text-slate-500">
            {loading
              ? "Syncing your latest data…"
              : `${wishlist.length} stock${wishlist.length === 1 ? "" : "s"} in watchlist`}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] gap-8 items-start">
          {/* LEFT: stock cards */}
          <div>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : stocks.length === 0 ? (
              <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No cached stocks yet. Add some symbols to your watchlist from
                the Market page.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {stocks.map((stock) => {
                  const title =
                    stock.base_symbol ||
                    stock.bse_identifier ||
                    stock.symbol;
                  const pattern = stock.chart_pattern;
                  const ratios = stock.ratios || {};
                  const signal = stock.signal;

                  const keyRatios = [
                    "ROE",
                    "ROCE",
                    "Net Profit Margin",
                    "Debt/Equity",
                  ];

                  return (
                    <motion.div
                      key={stock.symbol}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 18,
                      }}
                      className="relative rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400" />
                      <div className="p-5 space-y-4">
                        {/* top row */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                              {title}
                            </h2>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {stock.symbol}
                              {stock.tv_symbol ? ` · ${stock.tv_symbol}` : ""}
                            </p>
                          </div>
                          {signal && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] border ${biasColor(
                                signal.bias
                              )}`}
                            >
                              {formatBias(signal.bias)} ·{" "}
                              {signal.confidence ?? "--"}%
                            </span>
                          )}
                        </div>

                        {/* pattern */}
                        <p className="text-xs text-slate-700">
                          {pattern?.pattern_found ? (
                            <>
                              <span className="text-slate-500">
                                Chart pattern:
                              </span>{" "}
                              <span className="font-medium text-slate-900">
                                {pattern.pattern_name}
                              </span>{" "}
                              <span className="text-slate-500">
                                ({pattern.confidence})
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-500">
                              No strong classical pattern detected.
                            </span>
                          )}
                        </p>

                        {/* ratios preview */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-700">
                          {keyRatios.map((r) => {
                            if (ratios[r] == null) return null;
                            const val = ratios[r];
                            const isPercent =
                              r.includes("Margin") ||
                              r === "ROE" ||
                              r === "ROCE" ||
                              r === "ROA";
                            const formatted = isPercent
                              ? `${val.toFixed(1)}%`
                              : val.toFixed(2);
                            return (
                              <span key={r}>
                                <span className="text-slate-500">{r}:</span>{" "}
                                <span className="font-medium text-slate-900">
                                  {formatted}
                                </span>
                              </span>
                            );
                          })}
                        </div>

                        {/* button */}
                        <div className="pt-2">
                          <button
                            onClick={() => setSelected(stock)}
                            className="w-full text-xs font-semibold tracking-wide rounded-xl bg-sky-500 text-white hover:bg-sky-600 py-2.5 transition shadow-sm"
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: news */}
          <div>
            <div className="rounded-2xl bg-gradient-to-b from-indigo-100 to-violet-100 border border-indigo-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
                Latest watchlist news
                <span className="text-[11px] text-indigo-600">
                  {aggregatedNews.length} item
                  {aggregatedNews.length === 1 ? "" : "s"}
                </span>
              </h2>
              {aggregatedNews.length === 0 ? (
                <p className="text-xs text-indigo-700/80">
                  No recent summarized announcements yet. Once your BSE filings
                  are processed, they will appear here.
                </p>
              ) : (
                <div className="space-y-3">
                  {aggregatedNews.map(({ stock, item }, idx) => (
                    <div
                      key={`${stock}-${item.index}-${idx}`}
                      className="rounded-xl bg-white border border-indigo-200 px-3 py-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-indigo-700">
                          {stock}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.date}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-900 line-clamp-2">
                        {item.heading}
                      </p>
                      {item.summary && (
                        <p className="mt-1 text-[11px] text-slate-600 line-clamp-3 whitespace-pre-line">
                          {item.summary}
                        </p>
                      )}
                      {item.pdf_url && (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-[10px] text-indigo-700 underline"
                        >
                          View filing PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              {/* header */}
              <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {selected.base_symbol ||
                      selected.bse_identifier ||
                      selected.symbol}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selected.symbol}
                    {selected.tv_symbol ? ` · ${selected.tv_symbol}` : ""}
                  </p>
                </div>
                {selected.signal && (
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${biasColor(
                        selected.signal.bias
                      )}`}
                    >
                      {formatBias(selected.signal.bias)} ·{" "}
                      {selected.signal.confidence ?? "--"}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      AI-generated view – not financial advice
                    </span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT: chart + pattern */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700">
                      Daily chart
                    </div>
                    <div className="p-3 flex items-center justify-center bg-slate-100">
                      {selected.chart_image_base64 ? (
                        <img
                          src={`data:image/png;base64,${selected.chart_image_base64}`}
                          alt="Chart"
                          className="rounded-xl max-h-64 w-full object-contain"
                        />
                      ) : (
                        <p className="text-xs text-slate-500">
                          No chart image available for this stock in cache.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-semibold text-slate-800 mb-2">
                      Pattern detection
                    </h3>
                    {selected.chart_pattern ? (
                      <>
                        <p className="text-sm text-slate-900">
                          {selected.chart_pattern.pattern_found ? (
                            <>
                              Pattern:{" "}
                              <span className="font-semibold">
                                {selected.chart_pattern.pattern_name}
                              </span>{" "}
                              <span className="text-slate-500">
                                ({selected.chart_pattern.confidence})
                              </span>
                            </>
                          ) : (
                            "No strong classical chart pattern detected."
                          )}
                        </p>
                        {selected.chart_pattern.explanation && (
                          <p className="mt-1 text-xs text-slate-600">
                            {selected.chart_pattern.explanation}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Pattern data not available.
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT: ratios + AI */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-semibold text-slate-800 mb-2">
                      Financial ratios
                    </h3>
                    {selected.ratios ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(selected.ratios).map(
                          ([key, value]) => {
                            const isPercent =
                              key.includes("Margin") ||
                              key === "ROE" ||
                              key === "ROCE" ||
                              key === "ROA";
                            const val = isPercent
                              ? `${value.toFixed(2)}%`
                              : value.toFixed(2);
                            return (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-3"
                              >
                                <span className="text-slate-500 truncate">
                                  {key}
                                </span>
                                <span className="font-semibold text-slate-900">
                                  {val}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        No ratio data cached.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-semibold text-slate-800 mb-2">
                      AI signal (agentic view)
                    </h3>
                    {selected.signal ? (
                      <div className="space-y-2 text-xs text-slate-800">
                        {selected.signal.reasons && (
                          <div>
                            <p className="font-semibold mb-1 text-slate-900">
                              Reasons
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-slate-700">
                              {selected.signal.reasons.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selected.signal.risks && (
                          <div className="mt-2">
                            <p className="font-semibold mb-1 text-slate-900">
                              Risks
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-slate-700">
                              {selected.signal.risks.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selected.signal.note && (
                          <p className="mt-2 text-[11px] text-slate-500">
                            {selected.signal.note}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        AI signal not available for this stock yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* NEWS for this stock */}
              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h3 className="text-xs font-semibold text-slate-800 mb-3">
                  Recent announcements
                </h3>
                {selected.bse_summaries?.news &&
                selected.bse_summaries.news.length > 0 ? (
                  <div className="space-y-3">
                    {selected.bse_summaries.news.map((n) => (
                      <div
                        key={n.index}
                        className="rounded-xl bg-white border border-slate-200 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-900">
                            {n.heading}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {n.date}
                          </span>
                        </div>
                        {n.summary && (
                          <p className="mt-1 text-[11px] text-slate-600 whitespace-pre-line">
                            {n.summary}
                          </p>
                        )}
                        {n.pdf_url && (
                          <a
                            href={n.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-[10px] text-sky-700 underline"
                          >
                            Open filing PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No BSE filings summarized for this stock yet.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
