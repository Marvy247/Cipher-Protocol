'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"

const PRODUCT_META: Record<string, { label: string; icon: string }> = {
  CircleAppKits: { label: "App Kits", icon: "🔗" },
  NanopaymentsManager: { label: "Nanopayments", icon: "⚡" },
  AgentStackManager: { label: "Agent Stack", icon: "👛" },
  ArcConnector: { label: "Arc RPC", icon: "⛓️" },
}

const METHOD_PRODUCT: Record<string, string> = {
  get_unified_balance: "Unified Balance",
  get_bridge_history: "Bridge Kit",
  get_swap_history: "Swap Kit",
  track_send_patterns: "Send Kit",
  detect_cross_chain_risk: "Cross-Chain Risk",
  charge_compliance_fee: "Nanopayments",
  get_total_fees_collected: "Fee Collection",
  get_agent_wallet: "Agent Wallet",
  fund_agent_wallet: "Wallet Funding",
  get_latest_block: "Block Monitoring",
  get_block_transactions: "TX Fetching",
  get_transaction_receipt: "TX Receipt",
}

export function CircleProductUsage() {
  const [summary, setSummary] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    api.getIntegrationSummary().then(setSummary)
    api.getIntegrationUsage(50).then((d) => setRecords(d.records || []))
    const interval = setInterval(() => {
      api.getIntegrationSummary().then(setSummary)
      api.getIntegrationUsage(50).then((d) => setRecords(d.records || []))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const byService = summary?.by_service || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Circle Product Usage</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time integration call tracking</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {summary?.total_calls || 0} calls
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {Object.entries(PRODUCT_META).map(([key, meta]) => {
          const svc = byService[key]
          return (
            <div
              key={key}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-sky-500/20 transition-all"
            >
              <div className="text-lg mb-1">{meta.icon}</div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{meta.label}</p>
              <p className="text-2xl font-black text-white">{svc?.calls || 0}</p>
              <p className="text-[10px] text-slate-600 mt-1">
                {svc?.successful || 0} ok · {svc?.failed || 0} err
              </p>
            </div>
          )
        })}
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {records.length === 0 ? (
          <p className="text-center py-6 text-slate-500 text-sm">No integration calls yet. Run the demo.</p>
        ) : (
          records.toReversed().slice(0, 20).map((r: any, i: number) => {
            const productLabel = METHOD_PRODUCT[r.method] || r.method
            const icon = PRODUCT_META[r.service]?.icon || "🔹"
            return (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-300 truncate">{productLabel}</p>
                    <p className="text-[10px] text-slate-600 truncate">{r.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500">{r.duration_ms}ms</span>
                  <span className={r.success ? "text-emerald-400 text-xs" : "text-red-400 text-xs"}>
                    {r.success ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}
