"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Header from "../components/Header";

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

// Hardcoded stock data
const hardcodedStocks: StockCache[] = [
  {
    symbol: "RELIANCE.NS",
    base_symbol: "RELIANCE",
    tv_symbol: "NSE:RELIANCE",
    bse_identifier: "RELIANCE",
    chart_pattern: {
      pattern_found: true,
      pattern_name: "Ascending Triangle",
      confidence: "High",
      explanation: "Price forming higher lows with resistance at 2,950"
    },
    ratios: {
      "ROE": 12.5,
      "ROCE": 14.2,
      "Net Profit Margin": 8.9,
      "Debt/Equity": 0.45,
      "P/E Ratio": 24.5,
      "ROA": 6.8
    },
    signal: {
      ticker: "RELIANCE",
      bias: "Bullish",
      confidence: 78,
      reasons: [
        "Strong fundamentals with diversified business model",
        "Consistent cash flow from energy sector",
        "Digital and retail segments showing growth"
      ],
      risks: [
        "Global energy price volatility",
        "High debt levels from expansion projects"
      ],
      note: "AI-generated signal based on technical and fundamental analysis"
    },
    bse_summaries: {
      stock: "RELIANCE",
      scripcode: "500325",
      news: [
        {
          index: 1,
          heading: "Board Meeting Intimation for Quarterly Results",
          date: "Nov 15, 2024",
          summary: "The Board of Directors will meet on December 10, 2024 to consider and approve the unaudited financial results for Q3 FY2024-25.",
          pdf_url: "#"
        },
        {
          index: 2,
          heading: "Outcome of Board Meeting - Retail Expansion Plans",
          date: "Nov 02, 2024",
          summary: "Board approved expansion of retail footprint with 200 new stores across tier-2 and tier-3 cities. Total capex of ₹5,000 crores allocated.",
          pdf_url: "#"
        }
      ]
    }
  },
  {
    symbol: "TCS.NS",
    base_symbol: "TCS",
    tv_symbol: "NSE:TCS",
    bse_identifier: "TCS",
    chart_pattern: {
      pattern_found: true,
      pattern_name: "Bullish Flag",
      confidence: "Medium",
      explanation: "Consolidation after strong rally, potential continuation pattern"
    },
    ratios: {
      "ROE": 45.8,
      "ROCE": 52.3,
      "Net Profit Margin": 19.2,
      "Debt/Equity": 0.02,
      "P/E Ratio": 28.4,
      "ROA": 32.5
    },
    signal: {
      ticker: "TCS",
      bias: "Bullish",
      confidence: 82,
      reasons: [
        "Industry-leading margins and ROE",
        "Strong deal pipeline across sectors",
        "Minimal debt and strong cash reserves"
      ],
      risks: [
        "Currency headwinds from rupee appreciation",
        "Increasing competition in cloud services"
      ],
      note: "One of the strongest fundamentals in IT sector"
    },
    bse_summaries: {
      stock: "TCS",
      scripcode: "532540",
      news: [
        {
          index: 1,
          heading: "TCS Announces Strategic Partnership with Major Bank",
          date: "Nov 18, 2024",
          summary: "Company secured a 5-year deal worth $2.1 billion for digital transformation and cloud migration services.",
          pdf_url: "#"
        }
      ]
    }
  },
  {
    symbol: "WIPRO.NS",
    base_symbol: "WIPRO",
    tv_symbol: "NSE:WIPRO",
    bse_identifier: "WIPRO",
    chart_pattern: {
      pattern_found: false,
      pattern_name: "",
      confidence: "",
      explanation: "Trading in a range without clear directional pattern"
    },
    ratios: {
      "ROE": 16.2,
      "ROCE": 20.1,
      "Net Profit Margin": 10.5,
      "Debt/Equity": 0.08,
      "P/E Ratio": 22.1,
      "ROA": 12.3
    },
    signal: {
      ticker: "WIPRO",
      bias: "Neutral",
      confidence: 55,
      reasons: [
        "Stable fundamentals with low debt",
        "Recent client wins in BFSI sector",
        "Cost optimization initiatives underway"
      ],
      risks: [
        "Lagging peers in revenue growth",
        "Employee attrition concerns",
        "Margin pressure from wage inflation"
      ],
      note: "Sideways movement expected until clear catalysts emerge"
    },
    bse_summaries: {
      stock: "WIPRO",
      scripcode: "507685",
      news: [
        {
          index: 1,
          heading: "Quarterly Results - Q2 FY2024-25",
          date: "Oct 25, 2024",
          summary: "Revenue declined 2% QoQ but margins improved by 40 bps. Management maintains cautious outlook for H2.",
          pdf_url: "#"
        }
      ]
    }
  },
  {
    symbol: "SENCO.NS",
    base_symbol: "SENCO",
    tv_symbol: "NSE:SENCO",
    bse_identifier: "SENCO GOLD",
    chart_pattern: {
      pattern_found: true,
      pattern_name: "Head and Shoulders",
      confidence: "Medium",
      explanation: "Potential reversal pattern forming, watch for neckline break"
    },
    ratios: {
      "ROE": 18.5,
      "ROCE": 22.8,
      "Net Profit Margin": 6.2,
      "Debt/Equity": 0.65,
      "P/E Ratio": 35.2,
      "ROA": 8.9
    },
    signal: {
      ticker: "SENCO",
      bias: "Bearish",
      confidence: 62,
      reasons: [
        "High valuations compared to peers",
        "Gold price volatility affecting margins",
        "Increased debt from expansion"
      ],
      risks: [
        "Further decline if neckline breaks",
        "Consumer discretionary spending slowdown",
        "Competition from organized players"
      ],
      note: "Monitor gold price trends and same-store sales growth"
    },
    bse_summaries: {
      stock: "SENCO GOLD",
      scripcode: "543179",
      news: [
        {
          index: 1,
          heading: "Fund Raising - QIP Issue Opens",
          date: "Nov 20, 2024",
          summary: "Company announced Qualified Institutional Placement to raise up to ₹500 crores for working capital and store expansion.",
          pdf_url: "#"
        },
        {
          index: 2,
          heading: "New Store Openings in Festive Season",
          date: "Oct 30, 2024",
          summary: "Opened 15 new showrooms during festive season. Same-store sales growth of 8% reported for the quarter.",
          pdf_url: "#"
        }
      ]
    }
  }
];

export default function WatchlistPage() {
  const [stocks] = useState<StockCache[]>(hardcodedStocks);
  const [selected, setSelected] = useState<StockCache | null>(null);

  const aggregatedNews = stocks
    .flatMap((s) => {
      const stockName = s.base_symbol || s.bse_identifier || s.symbol || "Unknown";
      const newsList = s.bse_summaries?.news || [];
      return newsList.map((n) => ({ stock: stockName, item: n }));
    })
    .slice(0, 4);

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
    if (b === "bullish") return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (b === "bearish") return "text-rose-700 bg-rose-50 border-rose-300";
    if (b === "neutral") return "text-slate-700 bg-slate-50 border-slate-300";
    return "text-slate-700 bg-slate-50 border-slate-300";
  };

  return (
    <>
    {/* <Header /> */}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm tracking-wide text-slate-600 uppercase font-medium">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
              Your watchlist at a glance
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">
              Get a quick read on chart patterns, fundamentals, and AI
              insights for the stocks you care about.
            </p>
          </div>
          <div className="text-xs md:text-sm text-slate-600 font-medium">
            {stocks.length} stock{stocks.length === 1 ? "" : "s"} in watchlist
          </div>
        </div>

        {/* Layout: left cards + right news */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] gap-8 items-start">
          {/* LEFT: stock cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {stocks.map((stock) => {
              const title = stock.base_symbol || stock.bse_identifier || stock.symbol;
              const pattern = stock.chart_pattern;
              const ratios = stock.ratios || {};
              const signal = stock.signal;
              const keyRatios = ["ROE", "ROCE", "Net Profit Margin", "Debt/Equity"];

              return (
                <motion.div
                  key={stock.symbol}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 18,
                  }}
                  className="relative rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          {title}
                        </h2>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {stock.symbol}
                          {stock.tv_symbol ? ` · ${stock.tv_symbol}` : ""}
                        </p>
                      </div>
                      {signal && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${biasColor(
                            signal.bias
                          )}`}
                        >
                          {formatBias(signal.bias)} · {signal.confidence ?? "--"}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700">
                      {pattern?.pattern_found ? (
                        <>
                          <span className="text-slate-600">Chart pattern:</span>{" "}
                          <span className="font-semibold text-slate-900">
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

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-700">
                      {keyRatios.map((r) => {
                        if (ratios[r] == null) return null;
                        const val = ratios[r];
                        const isPercent =
                          r.includes("Margin") || r === "ROE" || r === "ROCE" || r === "ROA";
                        const formatted = isPercent
                          ? `${val.toFixed(1)}%`
                          : val.toFixed(2);
                        return (
                          <span key={r}>
                            <span className="text-slate-500">{r}:</span>{" "}
                            <span className="font-semibold text-slate-900">
                              {formatted}
                            </span>
                          </span>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setSelected(stock)}
                        className="w-full text-xs font-bold tracking-wide rounded-xl bg-blue-600 text-white hover:bg-blue-700 py-2.5 transition shadow-sm"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: news column */}
          <div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 shadow-lg p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                Latest watchlist news
                <span className="text-[11px] text-indigo-700 font-medium">
                  {aggregatedNews.length} item{aggregatedNews.length === 1 ? "" : "s"}
                </span>
              </h2>
              {aggregatedNews.length === 0 ? (
                <p className="text-xs text-slate-700">
                  No recent summarized announcements yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {aggregatedNews.map(({ stock, item }, idx) => (
                    <div
                      key={`${stock}-${item.index}-${idx}`}
                      className="rounded-xl bg-white border border-indigo-200 px-3 py-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-indigo-900">
                          {stock}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {item.date}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-900 line-clamp-2 font-medium">
                        {item.heading}
                      </p>
                      {item.summary && (
                        <p className="mt-1 text-[11px] text-slate-700 line-clamp-3 whitespace-pre-line">
                          {item.summary}
                        </p>
                      )}
                      {item.pdf_url && (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-[10px] text-blue-600 underline font-medium"
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
            className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
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
                <X className="w-5 h-5 text-slate-700" />
              </button>

              {/* HEADER */}
              <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selected.base_symbol || selected.bse_identifier || selected.symbol}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {selected.symbol}
                    {selected.tv_symbol ? ` · ${selected.tv_symbol}` : ""}
                  </p>
                </div>
                {selected.signal && (
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${biasColor(
                        selected.signal.bias
                      )}`}
                    >
                      {formatBias(selected.signal.bias)} · {selected.signal.confidence ?? "--"}%
                    </span>
                    <span className="text-[10px] text-slate-500">
                      AI-generated view – not financial advice
                    </span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT: pattern */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-bold text-slate-900 mb-2">
                      Pattern detection
                    </h3>
                    {selected.chart_pattern ? (
                      <>
                        <p className="text-sm text-slate-900">
                          {selected.chart_pattern.pattern_found ? (
                            <>
                              Pattern:{" "}
                              <span className="font-bold">
                                {selected.chart_pattern.pattern_name}
                              </span>{" "}
                              <span className="text-slate-600">
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
                    <h3 className="text-xs font-bold text-slate-900 mb-2">
                      Financial ratios
                    </h3>
                    {selected.ratios ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(selected.ratios).map(([key, value]) => {
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
                              <span className="text-slate-600 truncate">{key}</span>
                              <span className="font-bold text-slate-900">{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No ratio data cached.</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-bold text-slate-900 mb-2">
                      AI signal (agentic view)
                    </h3>
                    {selected.signal ? (
                      <div className="space-y-2 text-xs text-slate-800">
                        {selected.signal.reasons && (
                          <div>
                            <p className="font-bold mb-1 text-slate-900">Reasons</p>
                            <ul className="list-disc list-inside space-y-1">
                              {selected.signal.reasons.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selected.signal.risks && (
                          <div className="mt-2">
                            <p className="font-bold mb-1 text-slate-900">Risks</p>
                            <ul className="list-disc list-inside space-y-1">
                              {selected.signal.risks.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selected.signal.note && (
                          <p className="mt-2 text-[11px] text-slate-600">
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

              {/* NEWS */}
              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h3 className="text-xs font-bold text-slate-900 mb-3">
                  Recent announcements
                </h3>
                {selected.bse_summaries?.news && selected.bse_summaries.news.length > 0 ? (
                  <div className="space-y-3">
                    {selected.bse_summaries.news.map((n) => (
                      <div
                        key={n.index}
                        className="rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {n.heading}
                          </span>
                          <span className="text-[10px] text-slate-600">{n.date}</span>
                        </div>
                        {n.summary && (
                          <p className="mt-1 text-[11px] text-slate-700 whitespace-pre-line">
                            {n.summary}
                          </p>
                        )}
                        {n.pdf_url && (
                          <a
                            href={n.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-[10px] text-blue-600 underline font-medium"
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
    </>
  );
}