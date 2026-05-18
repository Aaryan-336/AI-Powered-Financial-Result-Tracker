"use client";

import StockCard from "./StockCard";
import { stockData } from "./data";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stockData.map((stock, index) => (
        <StockCard key={index} stock={stock} />
      ))}
    </div>
  );
}
