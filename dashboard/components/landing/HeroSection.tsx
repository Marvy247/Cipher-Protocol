"use client"

import Link from "next/link"
import { ArrowRight, Shield, Zap, DollarSign, TrendingDown, CheckCircle, ExternalLink } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative z-10 min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#071a1a]/95 via-[#0a2420]/90 to-[#0d2d2d]/95"
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-1 { animation: fadeUp 0.75s ease-out 0.10s both; }
        .hero-fade-2 { animation: fadeUp 0.75s ease-out 0.25s both; }
        .hero-fade-3 { animation: fadeUp 0.75s ease-out 0.42s both; }
        .hero-fade-4 { animation: fadeUp 0.75s ease-out 0.58s both; }
        .hero-fade-5 { animation: fadeUp 0.75s ease-out 0.75s both; }
        .hero-fade-6 { animation: fadeUp 0.75s ease-out 0.90s both; }
        .hero-fade-7 { animation: fadeUp 0.75s ease-out 1.10s both; }
        @keyframes bounceDot {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
        .bounce-dot { animation: bounceDot 1.5s ease-in-out infinite; }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(52,211,153,0.10) 0%, transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-20 sm:pb-24 max-w-6xl">
        <div className="hero-fade-1 flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/15 rounded-full px-3.5 py-1.5 text-xs sm:text-sm text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Agentic Economy
          </div>
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 text-[10px] sm:text-xs text-sky-400/70">
            <img
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg"
              alt="USDC"
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
            />
            Powered by Circle
          </div>
        </div>

        <h1
          className="hero-fade-2 font-light text-white leading-[1.05] tracking-tight mb-6 sm:mb-8 max-w-4xl"
          style={{ fontSize: "clamp(2.6rem, 9vw, 8rem)" }}
        >
          Autonomous AML Compliance
          <br />
          <span className="font-extralight text-white/65">for the Arc blockchain.</span>
        </h1>

        <p className="hero-fade-3 text-white/55 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
          AI agents screen transactions, verify identities, and enforce regulations in real time.
          Each compliance check costs <span className="text-sky-400 font-medium">$0.001 USDC</span> — settled on-chain via Circle.
        </p>

        <div className="hero-fade-4 flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-sky-500/20"
          >
            Run Live Check
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/80 font-medium text-sm px-7 py-3.5 rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-200"
          >
            Launch Dashboard
          </Link>
        </div>

        <div className="hero-fade-5 flex flex-wrap items-center gap-4 sm:gap-8 mb-12">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-white/70">$0.001</span>
            <span>per compliance check</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="text-white/70">5 AI agents</span>
            <span>per transaction</span>
          </div>
          <a
            href="https://testnet.arcscan.app/tx/0x896392d8d78c7dfa71542116829e7ec91680464148d3e6f6129b6c1a9d07c69c"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-sky-400/60 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/30"
          >
            View on-chain proof
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="hero-fade-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Traditional Cost</p>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-2xl font-bold text-white">$2-5M</span>
            </div>
            <p className="text-xs text-white/30 mt-1">per year for mid-size fintech</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">With Cipher Protocol</p>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-bold text-white">&lt;$50K</span>
            </div>
            <p className="text-xs text-white/30 mt-1">autonomous, per-tx pricing</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
            <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-2">ROI</p>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-bold text-emerald-400">49x</span>
            </div>
            <p className="text-xs text-emerald-400/40 mt-1">cost reduction vs. legacy</p>
          </div>
        </div>
      </div>

      <div className="hero-fade-7 absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-xs text-white/35 tracking-widest uppercase font-medium">
          Scroll to explore
        </span>
        <div className="bounce-dot w-1.5 h-1.5 rounded-full bg-sky-400/60" />
      </div>
    </section>
  )
}
