'use client'

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Grid3x3, ShieldAlert } from "lucide-react"
import { api } from "@/lib/api"

interface HeatmapEntry {
  address: string
  name: string
  risk_score: number
  category: string
  flags: string[]
  jurisdiction: string
  tx_count: number
}

interface HeatmapData {
  entries: HeatmapEntry[]
  summary: {
    total: number
    clean: number
    elevated: number
    high_risk: number
    sanctioned: number
  }
}

function cellStyle(category: string): string {
  switch (category) {
    case "sanctioned":
      return "bg-red-600/40 border-red-500/60 shadow-red-500/20"
    case "high_risk":
      return "bg-orange-500/30 border-orange-500/40 shadow-orange-500/10"
    case "elevated":
      return "bg-amber-400/20 border-amber-400/30"
    default:
      return "bg-emerald-400/10 border-emerald-400/20"
  }
}

export function SanctionsHeatmap() {
  const [data, setData] = useState<HeatmapData | null>(null)
  const [hovered, setHovered] = useState<HeatmapEntry | null>(null)

  useEffect(() => {
    const load = () => api.getSanctionsHeatmap().then(setData).catch(() => {})
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  const entries = useMemo(() => data?.entries || [], [data])
  const summary = data?.summary

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Grid3x3 className="w-4.5 h-4.5 text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">OFAC Sanctions Heatmap</h2>
            <p className="text-xs text-slate-500 mt-0.5">Exposure density across screened counterparties</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-red-400/70 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          {summary?.sanctioned || 0} sanctioned
        </div>
      </div>

      <div className="flex gap-2">
        <div className="grid grid-cols-8 gap-2 w-full">
          {entries.map((entry, idx) => {
            const flagged = entry.category === "sanctioned" || entry.category === "high_risk"
            return (
              <div
                key={entry.address}
                onMouseEnter={() => setHovered(entry)}
                onMouseLeave={() => setHovered(null)}
                className={`aspect-square rounded-md border flex items-center justify-center transition-all duration-200 ${cellStyle(entry.category)} ${
                  flagged ? "animate-pulse" : "hover:scale-110"
                } cursor-pointer relative group`}
              >
                <span className={`text-[9px] font-mono ${flagged ? "text-red-200" : "text-slate-400"}`}>
                  {entry.risk_score}
                </span>
                {entry.category === "sanctioned" && (
                  <ShieldAlert className="absolute -top-1.5 -right-1.5 w-3 h-3 text-red-400 drop-shadow" />
                )}
              </div>
            )
          })}
        </div>

        <div className="w-56 shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          {hovered ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Counterparty</span>
                <span className="text-[10px] font-bold text-slate-400">{hovered.risk_score}/100</span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">{hovered.name}</p>
              <p className="text-[10px] font-mono text-slate-500 mb-2">
                {hovered.address.slice(0, 12)}...{hovered.address.slice(-6)}
              </p>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">{hovered.jurisdiction}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">{hovered.tx_count} txs</span>
              </div>
              {hovered.flags.length > 0 ? (
                <div className="space-y-1">
                  {hovered.flags.slice(0, 2).map((flag) => (
                    <p key={flag} className="text-[10px] text-red-300/80">⚠ {flag}</p>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-emerald-300/70">✓ No sanctions matches</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Grid3x3 className="w-5 h-5 text-slate-600 mb-2" />
              <p className="text-[10px] text-slate-600">Hover a cell to inspect</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-400/20 border border-emerald-400/30" /> Clean
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-400/20 border border-amber-400/30" /> Elevated
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-orange-500/30 border border-orange-500/40" /> High risk
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-red-600/40 border border-red-500/50" /> Sanctioned
        </div>
        <span className="ml-auto">OFAC SDN · EU · UN consolidated lists</span>
      </div>
    </motion.div>
  )
}