"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center text-gray-900 overflow-hidden px-6 stock-doodle-bg">

      {/* Glow Overlays */}
      <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-green-300 opacity-30 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-blue-300 opacity-30 blur-[180px] rounded-full -z-10" />

      {/* Floating Chart Line Behind Hero */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none -z-10"
      >
        <svg
          width="900"
          height="200"
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="3"
          opacity=".25"
        >
          <path d="M0 150 L80 100 L160 130 L240 60 L320 120 L400 20 L480 80 L560 40 L640 140 L720 90 L800 150" />
        </svg>
      </motion.div>

      {/* Hero Text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center max-w-3xl drop-shadow-sm"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
        >
          Khabri
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-2xl mt-5 font-light text-gray-700"
        >
          Smarter investing. Better insights. Real-time stock intelligence at your fingertips.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          className="flex gap-5 justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >

          <motion.button
            onClick={() => (window.location.href = "/create-account")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="px-10 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 shadow-xl"
          >
            Create Account
          </motion.button>

          <motion.button
            onClick={() => (window.location.href = "/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="px-10 py-3 rounded-xl text-lg font-semibold border border-gray-400 hover:border-gray-800 bg-white transition"
          >
            Login
          </motion.button>

        </motion.div>
      </motion.div>
    </main>
  );
}
