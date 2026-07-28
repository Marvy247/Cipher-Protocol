'use client'

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Ban, ArrowRight, Loader2, Shield, ExternalLink, Play, ScanSearch, Search, Gauge, Globe, FileText } from "lucide-react"
import { api } from "@/lib/api"

interface AgentStepResult {
  name: string
  icon: string
  duration: number
  output: string
}

interface ComplianceCheckResponse {
  transaction: {
    hash: string
    from: string
    to: string
    value: number
    type: string
  }
  agent_steps: AgentStepResult[]
  final_decision: string
  total_time_s: number
  nanopayment: {
    success: boolean
    amount: number
    nanopayment_tx_hash: string | null
    gateway_used: boolean
  }
  explorer_url: string
}

const SCENARIOS = [
  { id: "normal", label: "Normal ($5K USDC)" },
  { id: "suspicious", label: "Suspicious ($150K)" },
  { id: "sanctioned", label: "Sanctioned (OFAC)" },
] as const

const STEP_META = [
  { icon: Search, label: "Transaction Monitor", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { icon: Gauge, label: "Risk Scorer", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { icon: Globe, label: "Cross-Chain Intel", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { icon: Shield, label: "Sanctions Screener", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: FileText, label: "Reporting Agent", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
]

export function LiveComplianceCheck() {
  const [scenario, setScenario] = useState<string>("normal")
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ComplianceCheckResponse | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [decisionVisible, setDecisionVisible] = useState(false)

  const runCheck = useCallback(async () => {
    setRunning(true)
    setLoading(true)
    setResult(null)
    setCurrentStep(-1)
    setCompletedSteps([])
    setDecisionVisible(false)

    try {
      const data = await api.complianceCheck(scenario)
      setResult(data)
      setLoading(false)

      for (let i = 0; i < data.agent_steps.length; i++) {
        setCurrentStep(i)
        const displayMs = Math.max(data.agent_steps[i].duration * 1000, 400)
        const pause = 600 + Math.random() * displayMs * 1.5
        await new Promise((r) => setTimeout(r, pause))
        setCompletedSteps((prev) => [...prev, i])
      }

      setCurrentStep(-1)
      await new Promise((r) => setTimeout(r, 800))
      setDecisionVisible(true)
    } catch {
      setRunning(false)
      setLoading(false)
    } finally {
      setRunning(false)
    }
  }, [scenario])

  const decisionColors: Record<string, string> = {
    APPROVE: "text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.08]",
    HOLD_FOR_REVIEW: "text-amber-400 border-amber-500/30 bg-amber-500/[0.08]",
    BLOCK: "text-red-400 border-red-500/30 bg-red-500/[0.08]",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 overflow-hidden relative"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center border border-sky-500/20">
            <Play className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Compliance Check</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real agents process a transaction — pays $0.001 USDC on-chain
            </p>
          </div>
          <div className="ml-4 flex items-center gap-1.5 text-[10px] text-sky-400/60 bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-1">
            <img
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg"
              alt="USDC"
              className="w-3 h-3"
            />
            Powered by Circle
          </div>
        </div>
        <div className="flex items-center gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              disabled={running}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                scenario === s.id
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "border-white/[0.08] text-slate-500 hover:text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border transition-all duration-500 ${
        !result && !running
          ? "border-dashed border-white/[0.06] bg-white/[0.01]"
          : running
          ? "border-white/[0.08] bg-white/[0.02]"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}>
        {!result && !running && !loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/15 to-blue-500/15 flex items-center justify-center mb-5 border border-sky-500/20">
              <ScanSearch className="w-7 h-7 text-sky-400" />
            </div>
            <p className="text-slate-500 text-sm mb-1">Choose a scenario and run a live compliance check</p>
            <p className="text-xs text-slate-600 mb-6">5 AI agents will screen the transaction and send $0.001 USDC on-chain</p>
            <button
              onClick={runCheck}
              className="inline-flex items-center gap-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-10 py-4 rounded-xl transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40"
            >
              <Play className="w-4 h-4" />
              Run Live Compliance Check
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
              <div className="absolute inset-0 bg-sky-400/20 blur-xl rounded-full animate-pulse" />
            </div>
            <span className="text-sm text-sky-400">Connecting to agents & submitting transaction...</span>
          </div>
        ) : result ? (
          <div className="p-5 space-y-0">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-5 px-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-600">Tx:</span>
                <span className="font-mono text-slate-400">{result.transaction.hash.slice(0, 16)}...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Amount:</span>
                <span className="font-mono text-slate-300 font-medium">
                  ${result.transaction.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDC
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.06]" />

              <div className="space-y-3 relative">
                {result.agent_steps.map((step, i) => {
                  const meta = STEP_META[i]
                  const isCurrent = currentStep === i
                  const isDone = completedSteps.includes(i)
                  const isPending = !isDone && !isCurrent

                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${
                        isCurrent
                          ? `${meta.border} ${meta.bg}`
                          : isDone
                          ? "border-white/[0.08] bg-white/[0.02]"
                          : "border-white/[0.04] bg-transparent"
                      }`}
                    >
                      <div className="relative z-10 shrink-0 mt-0.5">
                        {isCurrent ? (
                          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.06]">
                            <Loader2 className={`w-5 h-5 animate-spin ${meta.color}`} />
                            <div className={`absolute inset-0 rounded-xl blur-md animate-pulse ${meta.bg}`} />
                          </div>
                        ) : isDone ? (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                            <CheckCircle className={`w-5 h-5 ${meta.color}`} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03]">
                            <meta.icon className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-sm font-medium ${
                            isCurrent ? "text-white" : isDone ? "text-slate-200" : "text-slate-500"
                          }`}>
                            {step.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-full animate-pulse">
                              Processing
                            </span>
                          )}
                        </div>
                        <AnimatePresence>
                          {isDone && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-slate-400 mt-1.5 font-mono leading-relaxed"
                            >
                              {step.output}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5 pt-1">
                        {isDone && (
                          <span className="text-[10px] text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded font-mono">
                            {step.duration}s
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <AnimatePresence>
              {decisionVisible && result.nanopayment.nanopayment_tx_hash && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="mt-6 pt-5 border-t border-white/[0.06]"
                >
                  <div className={`rounded-2xl border-2 p-5 ${decisionColors[result.final_decision] || "border-white/[0.08]"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className={`w-7 h-7 ${
                          result.final_decision === "APPROVE" ? "text-emerald-400" :
                          result.final_decision === "HOLD_FOR_REVIEW" ? "text-amber-400" : "text-red-400"
                        }`} />
                        <div>
                          <span className="text-sm text-white/60">Final Decision</span>
                          <p className={`font-black text-2xl ${
                            result.final_decision === "APPROVE" ? "text-emerald-400" :
                            result.final_decision === "HOLD_FOR_REVIEW" ? "text-amber-400" : "text-red-400"
                          }`}>
                            {result.final_decision}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-600">Total time</span>
                        <p className="text-sm font-mono text-slate-400">{result.total_time_s}s</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-white/[0.03] rounded-xl px-4 py-2.5 border border-white/[0.06]">
                      <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" alt="" className="w-4 h-4 shrink-0" />
                      <span>
                        <span className="text-slate-400">${result.nanopayment.amount.toFixed(3)} USDC</span>
                        <span className="text-slate-600"> compliance fee charged</span>
                      </span>
                    </div>

                    <a
                      href={result.explorer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between w-full bg-gradient-to-r from-sky-500/15 to-blue-500/15 hover:from-sky-500/25 hover:to-blue-500/25 border border-sky-500/30 hover:border-sky-500/50 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center group-hover:bg-sky-500/25 transition-colors">
                          <ExternalLink className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-sky-300 group-hover:text-sky-200 transition-colors">
                            View Transaction on Arcscan
                          </p>
                          <p className="text-xs font-mono text-sky-400/60 group-hover:text-sky-400/80 transition-colors mt-0.5">
                            {result.nanopayment.nanopayment_tx_hash.slice(0, 20)}...{result.nanopayment.nanopayment_tx_hash.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="relative w-5 h-5 text-sky-400/60 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
                    </a>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" alt="" className="w-3 h-3" />
                        Settled on Arc via Circle USDC
                      </div>
                      <button
                        onClick={runCheck}
                        disabled={running}
                        className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full transition-all disabled:opacity-50"
                      >
                        Run Again
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
