"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Search, Gauge, Globe, Shield, FileText, ArrowRight, CheckCircle, Loader2 } from "lucide-react"

const steps = [
  {
    id: 0,
    icon: Search,
    label: "Monitor",
    title: "Transaction Monitor",
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    border: "border-sky-500/20",
    lines: [
      "Parse transaction: 12,500 USDC",
      "Check amount thresholds",
      "Flag: none — within normal range",
    ],
    duration: "0.12s",
  },
  {
    id: 1,
    icon: Gauge,
    label: "Risk",
    title: "Risk Scorer",
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/20",
    lines: [
      "Score: 8/100 (low risk)",
      "Known counterparty, business hours",
      "No anomalous patterns detected",
    ],
    duration: "0.08s",
  },
  {
    id: 2,
    icon: Globe,
    label: "Cross-Chain",
    title: "Cross-Chain Intel",
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/20",
    lines: [
      "Check wallet activity across chains",
      "No cross-chain risk detected",
      "Single-chain wallet — clean",
    ],
    duration: "0.15s",
  },
  {
    id: 3,
    icon: Shield,
    label: "Sanctions",
    title: "Sanctions Screener",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/20",
    lines: [
      "OFAC SDN list: no match",
      "EU/UN sanctions: no match",
      "PEP status: not a politically exposed person",
    ],
    duration: "0.05s",
  },
  {
    id: 4,
    icon: FileText,
    label: "Report",
    title: "Reporting Agent",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/20",
    lines: [
      "Risk below SAR threshold",
      "No suspicious activity report needed",
      "Transaction recorded to audit log",
    ],
    duration: "0.03s",
  },
]

export function DemoSection() {
  const [activeStep, setActiveStep] = useState(-1)
  const [showFinal, setShowFinal] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-200px" })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!inView) return
    if (activeStep >= steps.length) return

    const delay = activeStep === -1 ? 600 : 900 + Math.random() * 400
    timerRef.current = setTimeout(() => {
      const next = activeStep + 1
      if (next < steps.length) {
        setActiveStep(next)
      } else {
        setShowFinal(true)
      }
    }, delay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeStep, inView])

  function reset() {
    setActiveStep(-1)
    setShowFinal(false)
  }

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #2a5248 0%, #1a3530 50%, #0f2420 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(52,211,153,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-sky-400/70 tracking-[0.2em] uppercase mb-5">
            / Pipeline Demo
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            5-Agent Compliance Pipeline
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto">
            Watch each AI agent process a transaction in sequence — from monitoring to reporting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-lg mx-auto"
        >
          <div className="flex gap-2 mb-6 p-1.5 bg-black/20 rounded-2xl border border-white/8">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { reset(); setTimeout(() => setActiveStep(i), 100) }}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  activeStep >= i
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {i < activeStep && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            ))}
          </div>

          <div className="h-0.5 bg-white/8 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-sky-400 rounded-full"
              animate={{ width: `${(Math.max(activeStep, 0) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="relative bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm min-h-[340px]">
            {activeStep >= 0 && activeStep < steps.length && (() => {
              const s = steps[activeStep]
              return (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.border} border`}>
                      {activeStep > -1 ? (
                        <CheckCircle className={`w-5 h-5 ${s.color}`} />
                      ) : (
                        <Loader2 className={`w-5 h-5 ${s.color} animate-spin`} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{s.title}</h3>
                      <p className={`text-[10px] ${s.color} mt-0.5 font-mono`}>{s.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {s.lines.map((line, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.15, ease: "easeOut" }}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <CheckCircle className={`w-3.5 h-3.5 ${s.color} shrink-0`} />
                        <span className="text-white/70">{line}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-3 border-t border-white/8">
                    <div className="flex-1">
                      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${s.bg}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono ${s.color}`}>DONE</span>
                  </div>
                </motion.div>
              )
            })()}

            {activeStep === -1 && !showFinal && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                  <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                </div>
                <p className="text-white/50 text-sm">Pipeline starting...</p>
              </div>
            )}
          </div>

          {showFinal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-1">Transaction Approved</p>
              <p className="text-white/50 text-xs mb-4">
                All 5 agents completed in 0.43s — compliance fee: $0.001 USDC
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-lg shadow-sky-500/20"
              >
                Try Live on Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {!showFinal && activeStep >= 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={reset}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Restart Demo
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
