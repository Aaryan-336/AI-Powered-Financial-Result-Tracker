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

  const handleAdd = () => {
    addToWatchlist(stock);
  };

  return (
    <div className="bg-white border border-gray-300 p-5 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{stock.symbol}</h2>
        <button
          onClick={handleAdd}
          className="p-2 rounded-full border border-gray-300 hover:bg-green-500 hover:text-white transition"
        >
          <Plus size={18} />
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-1">{stock.name}</p>
      <p className="text-2xl font-bold mb-2">₹{stock.price}</p>
      <p className="text-sm text-green-600 font-semibold mb-3">{stock.change}</p>

      <div className="h-10 bg-gray-200 rounded-lg mb-3 animate-pulse" />
      <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-600">
        Latest news: TCS launches new AI cloud services…
      </div>
    </div>
  );
}
