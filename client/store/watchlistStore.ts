"use client";

import { create } from "zustand";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: string;
}

interface WatchlistState {
  watchlist: Stock[];
  addToWatchlist: (stock: Stock) => void;
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  watchlist: [],
  addToWatchlist: (stock: Stock) =>
    set((state) => {
      if (state.watchlist.some((s) => s.symbol === stock.symbol)) {
        return state; // prevent duplicates
      }
      return { watchlist: [...state.watchlist, stock] };
    }),
}));
