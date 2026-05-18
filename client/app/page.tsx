"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Search, Heart, BarChart3, Newspaper, LineChart, Calculator, Sparkles, Shield, Zap, Brain, Bell } from 'lucide-react';

export default function KhabriHomepage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Search,
      title: "Market Explorer",
      description: "Browse and search through comprehensive stock listings with real-time pricing and instant wishlist management",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Smart Wishlist",
      description: "Curate your portfolio watchlist with automated analysis and background processing for each stock you track",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Unified Dashboard",
      description: "Get a holistic view with bias indicators, confidence scores, and actionable insights all in one place",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Newspaper,
      title: "News Intelligence",
      description: "AI-powered summaries of BSE announcements and market news, distilled into digestible bullet points",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: LineChart,
      title: "Pattern Recognition",
      description: "Advanced chart pattern detection using computer vision to identify Cup & Handle, Head & Shoulders, and more",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Calculator,
      title: "Financial Ratios",
      description: "Deep dive into ROE, ROCE, Debt/Equity, margins, and liquidity ratios with visual analytics",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Brain,
      title: "AI Agent Signals",
      description: "Multi-step reasoning engine that synthesizes all data points into clear BUY/SELL/HOLD recommendations",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Background Processing",
      description: "Add stocks rapidly while heavy computations run asynchronously—no waiting, just results",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Khabri
            </span>
          </motion.div>
          
          <div className="flex gap-3">
            <motion.a
              href="/#features"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-slate-700 font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles size={16} />
            <span>AI-Powered Stock Analysis</span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Make Smarter Trades
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              With Intelligence
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Khabri combines AI-powered analysis, real-time pattern recognition, and financial intelligence 
            to give you institutional-grade insights for every stock you track
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow flex items-center gap-2"
            >
              <Sparkles size={20} />
              Start Analyzing
            </motion.a>
            
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-2"
            >
              <Shield size={20} />
              Enter Platform
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Market Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <span>Lightning Fast</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1 - Real-time Analysis */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6"
              >
                <TrendingUp className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Real-Time Insights
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Get instant analysis on stock movements with AI-powered pattern detection and sentiment scoring
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-blue-600 font-semibold">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Live Processing
              </div>
            </motion.div>

            {/* Card 2 - Multi-Source Data */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              <motion.div
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6"
              >
                <Brain className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                AI-Driven Signals
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Multi-step reasoning engine synthesizes news, charts, and ratios into actionable recommendations
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-purple-600 font-semibold">
                <Sparkles size={16} />
                Smart Analysis
              </div>
            </motion.div>

            {/* Card 3 - Background Processing */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6"
              >
                <Zap className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Zero Wait Time
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Add stocks instantly while heavy computations run in the background—results ready when you are
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-orange-600 font-semibold">
                <Zap size={16} />
                Lightning Fast
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Trade Smart
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to give you an edge in the market
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              />
              
              <motion.div
                animate={{
                  scale: hoveredFeature === index ? 1.1 : 1,
                  rotate: hoveredFeature === index ? 5 : 0
                }}
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 relative`}
              >
                <feature.icon className="text-white" size={28} />
              </motion.div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hoveredFeature === index ? "100%" : "0%" }}
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Stocks Tracked" },
              { value: "99.9%", label: "Uptime" },
              { value: "<100ms", label: "Response Time" },
              { value: "24/7", label: "Market Monitoring" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of traders who make data-driven decisions with Khabri
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
            >
              Get Started Free
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900">Khabri</span>
            </div>
            
            <div className="text-slate-600 text-sm">
              © 2025 Khabri. All rights reserved.
            </div>
            
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}