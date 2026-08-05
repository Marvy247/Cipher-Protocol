'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Blocks, ExternalLink, Radio } from "lucide-react"
import { api } from "@/lib/api"

interface BlockSummary {
  block: number
  timestamp: number
  tx_count: number
  txs: string[]
}

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 5) return "just now"
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function RealArcActivity() {
  const [blocks, setBlocks] = useState<BlockSummary[]>([])
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const load = () => {
      api.getArcActivity().then((d) => {
        if (d.blocks) {
          setBlocks(d.blocks)
          setOffline(false)
        }
      }).catch(() => setOffline(true))
    }
    load()
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [])

  const latest = blocks[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Blocks className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Real Arc Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live blocks streamed from the Arc Testnet RPC</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {latest && (
            <span className="text-xs font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5">
              #{latest.block.toLocaleString()}
            </span>
          )}
          <div className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 border ${
            offline
              ? "text-red-400 border-red-500/20 bg-red-500/10"
              : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${offline ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
            {offline ? "RPC offline" : "Streaming"}
          </div>
        </div>
      </div>

      <div className="relative space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            <p className="text-sm text-slate-500">Listening for new Arc blocks...</p>
            <p className="text-[10px] text-slate-600">Arc Testnet produces a new block every few seconds</p>
          </div>
        ) : (
          blocks.map((b, idx) => (
            <motion.div
              key={b.block}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                idx === 0
                  ? "border-cyan-500/25 bg-cyan-500/[0.06]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                idx === 0 ? "bg-cyan-500/15 border border-cyan-500/25" : "bg-white/[0.04]"
              }`}>
                <Blocks className={`w-4 h-4 ${idx === 0 ? "text-cyan-400" : "text-slate-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <a
                    href={`https://testnet.arcscan.app/block/${b.block}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-mono font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-2 decoration-cyan-500/30"
                  >
                    Block #{b.block.toLocaleString()}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {idx === 0 && (
                    <span className="text-[9px] text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full animate-pulse">NEW</span>
                  )}
                  <span className="text-[10px] text-slate-600">{timeAgo(b.timestamp)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {b.txs.slice(0, 4).map((tx) => (
                    <a
                      key={tx}
                      href={`https://testnet.arcscan.app/tx/0x${tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-slate-500 hover:text-sky-400 bg-white/[0.03] hover:bg-sky-500/10 border border-white/[0.06] hover:border-sky-500/25 rounded px-2 py-0.5 transition-all"
                    >
                      0x{tx.slice(0, 10)}...
                    </a>
                  ))}
                  {b.tx_count > 4 && (
                    <span className="text-[10px] text-slate-600 px-1 py-0.5">+{b.tx_count - 4} more</span>
                  )}
                  {b.tx_count === 0 && (
                    <span className="text-[10px] text-slate-600">empty block</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-600 shrink-0">{b.tx_count} txs</span>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-slate-600">
        <Radio className="w-3 h-3 text-cyan-400" />
        Raw Arc Testnet block stream — every hash is verifiable on Arcscan. Demo pipeline runs on USDC traffic; native transfers appear here.
      </div>
    </motion.div>
  )
}
