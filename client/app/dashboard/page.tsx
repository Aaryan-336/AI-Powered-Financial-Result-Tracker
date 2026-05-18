"use client";

import { useState } from "react";
import StockCard from "../components/StockCard";
import { Search } from "lucide-react";

const dummyStocks = [
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3921, change: "+1.3%" },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2564, change: "-0.8%" },
  { symbol: "INFY", name: "Infosys", price: 1487, change: "+0.4%" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1541, change: "+2.1%" },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const filtered = dummyStocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] stock-doodle-bg px-10 py-10 text-[#0d1117]">
      <h1 className="text-5xl font-extrabold mb-2 text-center">Market Overview</h1>
      <p className="text-gray-600 mb-10 text-center text-lg">
        Discover top-performing stocks and build your portfolio
      </p>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-3xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search stock symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-green-500"
        />
        <Search size={22} className="absolute left-4 top-3.5 text-gray-500" />
      </div>

      {/* STOCK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
        {filtered.map((stock, i) => (
          <StockCard key={i} stock={stock} />
        ))}
      </div>
    </main>
  );
}
