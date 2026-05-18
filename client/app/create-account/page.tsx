"use client";

import { motion } from "framer-motion";

export default function CreateAccountPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 bg-[#f8fafc] stock-doodle-bg overflow-hidden">
      
      {/* Glow Overlays */}
      <div className="absolute top-[-150px] left-[-150px] w-[450px] h-[450px] bg-green-300 opacity-30 blur-[200px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] bg-blue-300 opacity-30 blur-[200px] rounded-full -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="backdrop-blur-xl bg-white/60 border border-gray-200 shadow-2xl rounded-3xl p-10 w-full max-w-lg"
      >
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Create your Khabri Account
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Start your journey to smarter investing.
        </p>

        <form className="flex flex-col gap-5">

          {/* FULL NAME */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3 mt-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 shadow-lg hover:opacity-90 transition"
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium underline hover:text-green-800">
            Login
          </a>
        </p>

      </motion.div>
    </main>
  );
}
