"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Gauge, Globe, Shield, FileText, ArrowRight, CheckCircle, Loader2, Ban, ExternalLink, Clock, Code2 } from "lucide-react"
import { api } from "@/lib/api"

const STEP_META = [
  { icon: Search, color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/20" },
  { icon: Gauge, color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/20" },
  { icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/20" },
  { icon: Shield, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/20" },
  { icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20" },
]

const SCENARIOS = [
  { id: "normal", label: "Normal" },
  { id: "suspicious", label: "Suspicious" },
  { id: "sanctioned", label: "Sanctioned" },
]

export function PlaygroundSection() {
  const [txHash, setTxHash] = useState("")
  const [scenario, setScenario] = useState("normal")
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState<any[]>([])
  const [decision, setDecision] = useState<string | null>(null)
  const [explorerUrl, setExplorerUrl] = useState("")
  const [paymentTx, setPaymentTx] = useState("")
  const [totalTime, setTotalTime] = useState(0)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  async function run() {
    setRunning(true)
    setError("")
    setDecision(null)
    setExplorerUrl("")
    setPaymentTx("")
    setDone(false)
    setSteps([])

    try {
      const data = await api.complianceCheck(scenario, { txHash: txHash.trim() || undefined })
      const revealed: any[] = []
      for (let i = 0; i < data.agent_steps.length; i++) {
        revealed.push(data.agent_steps[i])
        setSteps([...revealed])
        const displayMs = Math.max(data.agent_steps[i].duration * 1000, 350)
        await new Promise((r) => setTimeout(r, 550 + Math.random() * displayMs * 1.2))
      }
      setDecision(data.final_decision)
      setExplorerUrl(data.explorer_url || "")
      setPaymentTx(data.nanopayment?.nanopayment_tx_hash || "")
      setTotalTime(data.total_time_s || 0)
      setDone(true)
    } catch (e: any) {
      setError(e?.message || "Verification failed — try again")
    } finally {
      setRunning(false)
    }
  }

  const decisionStyle =
    decision === "APPROVE" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.08]" :
    decision === "HOLD_FOR_REVIEW" ? "text-amber-400 border-amber-500/30 bg-amber-500/[0.08]" :
    decision === "BLOCK" ? "text-red-400 border-red-500/30 bg-red-500/[0.08]" :
    "border-white/10 text-slate-300"

  return (
    <section
      id="playground"
      className="relative py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0f2420 0%, #0d1f1c 55%, #071a1a 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 20% 30%, rgba(56,189,248,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p className="text-xs font-mono text-sky-400/70 tracking-[0.2em] uppercase mb-5">/ API Playground</p>
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">Verify Any Transaction</h2>
          <p className="text-white/40 text-sm mt-4 max-w-lg mx-auto">
            Paste a hash, pick a scenario, and watch the live pipeline screen it in real time.
            Each check settles <span className="text-sky-400">$0.001 USDC</span> on-chain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="bg-black/30 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-500/40 transition-colors">
              <Code2 className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                disabled={running}
                placeholder="Paste Arc transaction hash (optional)..."
                className="flex-1 bg-transparent outline-none text-sm font-mono text-white/80 placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-black/20 rounded-xl border border-white/8">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  disabled={running}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    scenario === s.id ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" : "text-white/30 hover:text-white/60 border border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={run}
              disabled={running}
              className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/25"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {running ? "Screening..." : "Verify"}
            </button>
          </div>

          {txHash.trim() && (
            <p className="text-[10px] font-mono text-slate-600 mb-4">
              Using hash: <span className="text-sky-400/60">{txHash.trim()}</span>
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-4">
              {error}
            </div>
          )}

          {steps.length === 0 && !running && !error && (
            <div className="flex flex-col items-center justify-center py-14">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-sky-400" />
              </div>
              <p className="text-white/50 text-sm">Waiting for a transaction to verify</p>
              <p className="text-white/25 text-xs mt-1">5 agents · $0.001 USDC · on-chain settlement</p>
            </div>
          )}

          {running && steps.length === 0 && (
            <div className="flex items-center justify-center gap-3 py-14">
              <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
              <p className="text-white/50 text-sm">Submitting transaction to the agents...</p>
            </div>
          )}

          {steps.length > 0 && (
            <div className="space-y-2.5">
              {steps.map((step, i) => {
                const meta = STEP_META[i]
                return (
                  <motion.div
                    key={step.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className={`w-9 h-9 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center shrink-0`}>
                      <meta.icon className={`w-4 h-4 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 font-medium">{step.name}</p>
                      <p className="text-xs text-white/40 font-mono truncate">{step.output}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{step.duration}s</span>
                    <CheckCircle className={`w-4 h-4 ${meta.color} shrink-0`} />
                  </motion.div>
                )
              })}
            </div>
          )}

          {steps.length > 0 && steps.length < 5 && !done && (
            <div className="flex items-center gap-2 mt-4 text-xs text-sky-400/70">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              Agents still screening...
            </div>
          )}

          {done && decision && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className={`mt-6 rounded-2xl border-2 p-5 ${decisionStyle}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {decision === "APPROVE" ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Ban className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className="text-xs text-white/40">Final Decision</p>
                    <p className="font-black text-xl">{decision}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-white/30">Total time</p>
                    <p className="text-sm font-mono text-white/70">{totalTime}s</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/30">Fee settled</p>
                    <p className="text-sm font-mono text-white/70">$0.001 USDC</p>
                  </div>
                </div>
              </div>

              {explorerUrl && paymentTx && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl px-4 py-3 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" alt="USDC" className="w-4 h-4" />
                    <span className="text-xs text-white/70">
                      $0.001 USDC nanopayment <span className="text-white/40">· on-chain confirmed</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-sky-400 group-hover:text-sky-300 font-mono">
                    {paymentTx.slice(0, 10)}...{paymentTx.slice(-6)} <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              )}

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[10px] text-white/25">
                  Every verification writes a real, verifiable payment to Arc — try it again
                </p>
                <button
                  onClick={run}
                  disabled={running}
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/20 px-5 py-2 rounded-full transition-all disabled:opacity-50"
                >
                  Verify Another <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
