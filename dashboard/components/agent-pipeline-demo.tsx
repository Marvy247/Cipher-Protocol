'use client'

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Clock, Ban, ArrowRight, Loader2, Shield } from "lucide-react"

interface AgentStep {
  name: string
  icon: string
  status: "waiting" | "processing" | "done" | "error"
  output: string
  duration: string
}

const AGENTS: Omit<AgentStep, "status" | "output" | "duration">[] = [
  { name: "Transaction Monitor", icon: "🔍" },
  { name: "Risk Scorer", icon: "📊" },
  { name: "Cross-Chain Intel", icon: "🌐" },
  { name: "Sanctions Screener", icon: "🛡️" },
  { name: "Reporting Agent", icon: "📄" },
]

const SCENARIOS = [
  {
    label: "Normal ($5K USDC)",
    outputs: [
      { output: "Validated. Amount: $5,000. No flags raised.", duration: "0.12s" },
      { output: "Score: 8/100 (low). Known counterparty, business hours.", duration: "0.08s" },
      { output: "No cross-chain risk. Single-chain wallet.", duration: "0.15s" },
      { output: "No sanctions match (OFAC/EU/UN clear).", duration: "0.05s" },
      { output: "No SAR needed. Risk below threshold.", duration: "0.03s" },
    ],
    decision: "APPROVE",
    decisionColor: "text-emerald-400",
  },
  {
    label: "Suspicious ($150K @ 3AM)",
    outputs: [
      { output: "Validated. Flags: large_amount, out_of_hours.", duration: "0.11s" },
      { output: "Score: 92/100 (critical). High amount, round structuring.", duration: "0.09s" },
      { output: "⚠ Bridge from mixer detected. High fan-out: 40 recipients.", duration: "0.18s" },
      { output: "No sanctions match. Address not on any list.", duration: "0.04s" },
      { output: "SAR filed: SAR-20260727-091423.", duration: "0.06s" },
    ],
    decision: "HOLD_FOR_REVIEW",
    decisionColor: "text-amber-400",
  },
  {
    label: "Sanctioned (OFAC match)",
    outputs: [
      { output: "Validated. Amount: $10,000. No amount flags.", duration: "0.10s" },
      { output: "Score: 30/100 (medium). Moderate amount.", duration: "0.07s" },
      { output: "No cross-chain flags detected.", duration: "0.12s" },
      { output: "🚫 BLOCKED — OFAC SDN list match (recipient).", duration: "0.04s" },
      { output: "SAR filed: SAR-20260727-091424.", duration: "0.05s" },
    ],
    decision: "BLOCK",
    decisionColor: "text-red-400",
  },
]

export function AgentPipelineDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [steps, setSteps] = useState<AgentStep[]>(
    AGENTS.map((a) => ({ ...a, status: "waiting", output: "", duration: "" }))
  )
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle")
  const [decision, setDecision] = useState("")

  const runScenario = useCallback(async (idx: number) => {
    const scenario = SCENARIOS[idx]
    setPhase("running")
    setDecision("")
    setSteps(AGENTS.map((a) => ({ ...a, status: "waiting", output: "", duration: "" })))

    for (let i = 0; i < AGENTS.length; i++) {
      setSteps((prev) =>
        prev.map((s, j) => (j === i ? { ...s, status: "processing" } : j < i ? { ...s, status: "done" } : s))
      )
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
      setSteps((prev) =>
        prev.map((s, j) =>
          j === i
            ? { ...s, status: "done", output: scenario.outputs[i].output, duration: scenario.outputs[i].duration }
            : s
        )
      )
    }

    setDecision(scenario.decision)
    setPhase("done")
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => runScenario(0), 500)
    return () => clearTimeout(timer)
  }, [runScenario])

  function nextScenario() {
    const next = (scenarioIdx + 1) % SCENARIOS.length
    setScenarioIdx(next)
    runScenario(next)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Agent Pipeline Demo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Watch all 5 agents process a transaction in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setScenarioIdx(i); runScenario(i) }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                i === scenarioIdx
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "border-white/[0.08] text-slate-500 hover:text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
              step.status === "processing"
                ? "border-sky-500/30 bg-sky-500/[0.06]"
                : step.status === "done"
                ? "border-white/[0.08] bg-white/[0.02]"
                : "border-white/[0.04] bg-transparent"
            }`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04]">
              {step.status === "processing" ? (
                <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
              ) : step.status === "done" ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-sm text-slate-600">{i + 1}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm">{step.icon}</span>
                <span className={`text-sm font-medium ${
                  step.status === "processing" ? "text-sky-300" :
                  step.status === "done" ? "text-slate-200" : "text-slate-500"
                }`}>
                  {step.name}
                </span>
              </div>
              <AnimatePresence>
                {step.output && (
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
              {step.duration && (
                <span className="text-[10px] text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded">
                  {step.duration}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {decision && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${
                decision === "APPROVE" ? "text-emerald-400" :
                decision === "HOLD_FOR_REVIEW" ? "text-amber-400" : "text-red-400"
              }`} />
              <span className="font-bold text-white">Final Decision:</span>
              <span className={`font-black text-lg ${SCENARIOS[scenarioIdx].decisionColor}`}>
                {decision}
              </span>
            </div>
            <button
              onClick={nextScenario}
              className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full transition-all"
            >
              {SCENARIOS[(scenarioIdx + 1) % SCENARIOS.length].label}
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
