'use client'

import { motion } from "framer-motion"
import { GitBranch } from "lucide-react"
import { Sankey } from "recharts"

const NODES = [
  { name: "Incoming\nTransaction", fill: "#38bdf8" },
  { name: "Transaction\nMonitor", fill: "#38bdf8" },
  { name: "Risk\nScorer", fill: "#a78bfa" },
  { name: "Cross-Chain\nIntel", fill: "#22d3ee" },
  { name: "Sanctions\nScreener", fill: "#fbbf24" },
  { name: "Reporting\nAgent", fill: "#34d399" },
  { name: "APPROVED", fill: "#34d399" },
  { name: "HOLD FOR\nREVIEW", fill: "#fbbf24" },
  { name: "BLOCKED", fill: "#f87171" },
]

const LINKS = [
  { source: 0, target: 1, value: 100 },
  { source: 1, target: 2, value: 100 },
  { source: 2, target: 3, value: 100 },
  { source: 3, target: 4, value: 100 },
  { source: 4, target: 5, value: 100 },
  { source: 5, target: 6, value: 75 },
  { source: 5, target: 7, value: 12 },
  { source: 5, target: 8, value: 13 },
]

export function PipelineSankey() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <GitBranch className="w-4.5 h-4.5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Agent Flow</h2>
            <p className="text-xs text-slate-500 mt-0.5">Every transaction flows through 5 autonomous agents</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-sky-400/60 bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          Live pipeline
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <Sankey
          data={{ nodes: NODES, links: LINKS }}
          width={1000}
          height={320}
          nodeWidth={12}
          nodePadding={26}
          margin={{ top: 8, right: 130, bottom: 8, left: 90 }}
          link={{ stroke: "rgba(56, 189, 248, 0.16)", strokeWidth: 2 }}
          node={{ stroke: "rgba(255,255,255,0.06)" }}
        />
      </div>

      <div className="mt-2 grid grid-cols-3 gap-3">
        {[
          { label: "APPROVED", value: "75%", color: "text-emerald-400", dot: "bg-emerald-400" },
          { label: "HOLD FOR REVIEW", value: "12%", color: "text-amber-400", dot: "bg-amber-400" },
          { label: "BLOCKED", value: "13%", color: "text-red-400", dot: "bg-red-400" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</span>
            </div>
            <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
