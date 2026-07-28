'use client'

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Ban, ArrowRight, Loader2, Shield, ExternalLink, AlertTriangle, Play } from "lucide-react"
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
  { id: "normal", label: "Normal ($5K USDC)", color: "emerald" },
  { id: "suspicious", label: "Suspicious ($150K)", color: "amber" },
  { id: "sanctioned", label: "Sanctioned (OFAC)", color: "red" },
] as const

export function LiveComplianceCheck() {
  const [scenario, setScenario] = useState<string>("normal")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<ComplianceCheckResponse | null>(null)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [decisionVisible, setDecisionVisible] = useState(false)

  const runCheck = useCallback(async () => {
    setRunning(true)
    setResult(null)
    setVisibleSteps(0)
    setDecisionVisible(false)

    try {
      const data = await api.complianceCheck(scenario)
      setResult(data)

      for (let i = 0; i < data.agent_steps.length; i++) {
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
        setVisibleSteps(i + 1)
      }

      await new Promise((r) => setTimeout(r, 500))
      setDecisionVisible(true)
    } catch {
      setRunning(false)
    } finally {
      setRunning(false)
    }
  }, [scenario])

  const decisionColors: Record<string, string> = {
    APPROVE: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    HOLD_FOR_REVIEW: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    BLOCK: "text-red-400 border-red-500/20 bg-red-500/10",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center border border-sky-500/20">
            <Play className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Compliance Check</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Run agents on a real transaction — pays $0.001 USDC on-chain
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
                  ? `bg-${s.color}-500/20 border-${s.color}-500/40 text-${s.color}-300`
                  : "border-white/[0.08] text-slate-500 hover:text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center py-8 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01] mb-6">
        {!result && !running ? (
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-4">
              Select a scenario and run a live compliance check
            </p>
            <button
              onClick={runCheck}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/20"
            >
              <Play className="w-4 h-4" />
              Run Live Compliance Check
            </button>
          </div>
        ) : running && !result ? (
          <div className="flex items-center gap-3 text-sky-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Running agents on-chain...</span>
          </div>
        ) : null}
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <span className="font-mono">
              Tx: {result.transaction.hash.slice(0, 12)}...
            </span>
            <span className="font-mono">
              ${result.transaction.value.toFixed(2)} USDC
            </span>
          </div>

          {result.agent_steps.map((step, i) => (
            <motion.div
              key={step.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: i < visibleSteps ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
                i < visibleSteps
                  ? "border-white/[0.08] bg-white/[0.02]"
                  : "border-white/[0.04] bg-transparent"
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04]">
                {i < visibleSteps ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{step.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      i < visibleSteps ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                <AnimatePresence>
                  {i < visibleSteps && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-slate-400 mt-1 font-mono"
                    >
                      {step.output}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="shrink-0 text-right">
                {i < visibleSteps && (
                  <span className="text-[10px] text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded">
                    {step.duration}s
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {decisionVisible && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 pt-4 border-t border-white/[0.06]"
              >
                <div className={`rounded-xl border p-4 ${decisionColors[result.final_decision] || "border-white/[0.08]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className={`w-6 h-6 ${
                        result.final_decision === "APPROVE" ? "text-emerald-400" :
                        result.final_decision === "HOLD_FOR_REVIEW" ? "text-amber-400" : "text-red-400"
                      }`} />
                      <div>
                        <span className="font-bold text-white">Final Decision:</span>
                        <span className={`font-black text-lg ml-2 ${
                          result.final_decision === "APPROVE" ? "text-emerald-400" :
                          result.final_decision === "HOLD_FOR_REVIEW" ? "text-amber-400" : "text-red-400"
                        }`}>
                          {result.final_decision}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{result.total_time_s}s</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.nanopayment.nanopayment_tx_hash && (
                      <a
                        href={result.explorer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-lg px-3 py-2 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          ${result.nanopayment.amount.toFixed(3)} USDC on-chain
                        </span>
                      </a>
                    )}
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Fee charged: ${result.nanopayment.amount.toFixed(3)} USDC
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
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
      )}
    </motion.div>
  )
}
