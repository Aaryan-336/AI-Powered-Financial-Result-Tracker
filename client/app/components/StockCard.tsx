"use client";

import { Plus } from "lucide-react";
import { useWatchlistStore } from "../../store/watchlistStore";

interface StockProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: string;
  };
}

export default function StockCard({ stock }: StockProps) {
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);

  return (
    <div className="bg-white border border-gray-300 p-5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">{stock.symbol}</h2>

        <button
          onClick={() => {
          console.log("ADD CLICKED");
          addToWatchlist(stock);
        }}

        >
          <Plus size={18} />
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-2">{stock.name}</p>
      <p className="text-2xl font-bold mb-1">₹{stock.price}</p>
      <p className={`text-sm font-semibold ${
        stock.change.startsWith("-") ? "text-red-600" : "text-green-600"
      }`}>
        {stock.change}
      </p>

      <div className="h-10 bg-gray-200 rounded-lg mt-4 mb-2 animate-pulse" />
      <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-600">
        Latest news: TCS launches new AI cloud services…
      </div>
    </div>
  );
}

