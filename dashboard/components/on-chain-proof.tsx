'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, ShieldCheck, Wallet } from "lucide-react"
import { api } from "@/lib/api"

interface Proof {
  nanopayment_tx_hash: string | null
  amount: number
  from: string
  block_number: number | null
  explorer_url: string
  friendly_time?: string
  timestamp?: string
  source: string
}

function timeAgo(ts?: string): string {
  if (!ts) return ""
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  if (diff < 10) return "just now"
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function OnChainProof() {
  const [proofs, setProofs] = useState<Proof[]>([])
  const [error, setError] = useState(false)
  const [agentLabels, setAgentLabels] = useState<Record<string, string>>({})

  useEffect(() => {
    api.getAgentWallets().then((d) => {
      const labels: Record<string, string> = {}
      ;(d.wallets || []).forEach((w: any) => { labels[w.address.toLowerCase()] = w.display_name })
      setAgentLabels(labels)
    }).catch(() => {})

    const load = () => {
      api.getNanopaymentProof(8).then((d) => {
        if (d.proofs) {
          setProofs(d.proofs)
          setError(false)
        }
      }).catch(() => setError(true))
    }
    load()
    const interval = setInterval(load, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">On-Chain Proof</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real USDC nanopayments settled on Arc</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {proofs.length} settled
        </div>
      </div>

      {error && proofs.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">Proof feed unavailable — run a compliance check.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {proofs.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Waiting for on-chain nanopayments...</p>
          ) : (
            proofs.map((p, idx) => (
              <motion.div
                key={p.nanopayment_tx_hash || idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <img
                      src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg"
                      alt="USDC"
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="min-w-0">
                    {p.nanopayment_tx_hash ? (
                      <a
                        href={p.explorer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/30 truncate"
                      >
                        {p.nanopayment_tx_hash.slice(0, 18)}...{p.nanopayment_tx_hash.slice(-6)}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-slate-500">pending confirmation</span>
                    )}
                    <p className="text-[10px] text-slate-600 mt-0.5 truncate">
                      {agentLabels[p.from?.toLowerCase()] ? (
                        <span className="text-sky-400/80 font-medium">{agentLabels[p.from?.toLowerCase()]}</span>
                      ) : (
                        p.from ? `${p.from.slice(0, 8)}...${p.from.slice(-6)}` : ""
                      )}
                      {" → Cipher Gateway"}
                      {p.block_number ? ` · block ${p.block_number.toLocaleString()}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-xs font-bold text-slate-200">
                    ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} USDC
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(p.timestamp)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-slate-600">
        <Wallet className="w-3 h-3" />
        Fetched live from Arc RPC via USDC Transfer logs — every fee is verifiable on Arcscan
      </div>
    </motion.div>
  )
}
