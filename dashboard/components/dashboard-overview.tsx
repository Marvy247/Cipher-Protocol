'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, Wallet, TrendingUp, Zap, CheckCircle, LayoutDashboard, AlertTriangle, Ban, Clock } from "lucide-react"
import { CircleProductUsage } from "@/components/circle-product-usage"
import { AgentPipelineDemo } from "@/components/agent-pipeline-demo"
import { useRealtime } from "@/hooks/use-realtime"
import { api } from "@/lib/api"

export function DashboardOverview() {
  const { connected, transactions, alerts } = useRealtime()
  const [stats, setStats] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    api.getOverviewStats().then(setStats)
    api.getAgentsStatus().then((data) => setAgents(data.agents || []))
  }, [])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Compliance Monitor
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time AML/KYC transaction monitoring on Arc</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-slate-400">{connected ? 'Connected to Arc' : 'Disconnected'}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.12] via-sky-500/[0.06] to-transparent backdrop-blur-xl p-7"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-xs text-sky-400/80 font-semibold uppercase tracking-wider">Transactions</p>
            </div>
            <p className="text-5xl font-black text-white mt-2 tracking-tight">
              {stats?.total_transactions || 0}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-sky-400/70 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                {stats?.transactions_today || 0} today
              </span>
              <span className="w-1 h-1 rounded-full bg-sky-500/30" />
              <span className="text-xs text-sky-400/50">Monitored</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 hover:border-amber-500/20 hover:bg-white/[0.06] transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Flagged</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{stats?.flagged_count || 0}</p>
          <p className="text-xs text-slate-600 mt-2">Flagged for review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 hover:border-red-500/20 hover:bg-white/[0.06] transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Ban className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Blocked</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tight text-red-400">{stats?.blocked_count || 0}</p>
          <p className="text-xs text-slate-600 mt-2">Sanctioned/High risk</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 hover:border-emerald-500/20 hover:bg-white/[0.06] transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Processing</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{stats?.processing_time_ms || 0}ms</p>
          <p className="text-xs text-slate-600 mt-2">Avg. compliance check</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Live Transactions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time Arc transaction monitor</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Waiting for transactions...
              </div>
            ) : (
              transactions.slice(0, 10).map((tx: any, idx: number) => (
                <motion.div
                  key={tx.tx_hash || idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-xl ${
                      tx.result?.decision === 'BLOCK' ? 'bg-red-500/15 border-red-500/20' :
                      tx.result?.decision === 'HOLD_FOR_REVIEW' ? 'bg-amber-500/15 border-amber-500/20' :
                      'bg-emerald-500/15 border-emerald-500/20'
                    } border`}>
                      {tx.result?.decision === 'BLOCK' ? <Ban className="w-4 h-4 text-red-400" /> :
                       tx.result?.decision === 'HOLD_FOR_REVIEW' ? <Clock className="w-4 h-4 text-amber-400" /> :
                       <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-mono text-slate-200">{tx.tx_hash?.slice(0, 16)}...</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tx.from?.slice(0, 8)}... → {tx.to?.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-200">${tx.value?.toFixed(2) || '0.00'}</p>
                    <p className={`text-xs font-medium ${
                      tx.result?.risk_score > 80 ? 'text-red-400' :
                      tx.result?.risk_score > 50 ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      Risk: {tx.result?.risk_score || 0}/100
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Agent Status</h2>
              <p className="text-xs text-slate-500">5 compliance agents active</p>
            </div>
          </div>

          <div className="space-y-5">
            {agents.map((agent: any, idx: number) => (
              <div key={agent.name} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-slate-300">{agent.name}</span>
                </div>
                <span className="text-xs text-slate-500">{agent.uptime}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06]">
            <p className="text-xs text-emerald-400 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All agents operational
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Compliance Pipeline</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: 1, title: "Transaction Monitor", desc: "Initial validation & parsing", status: "active" },
            { step: 2, title: "Risk Scorer", desc: "ML-based risk assessment", status: "active" },
            { step: 3, title: "Cross-Chain Intel", desc: "Multi-chain risk intelligence", status: "active" },
            { step: 4, title: "Sanctions Screener", desc: "OFAC/EU/UN list check", status: "active" },
            { step: 5, title: "Reporting Agent", desc: "Auto SAR generation", status: "active" },
          ].map(({ step, title, desc, status }) => (
            <div
              key={step}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-sky-500/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-sky-400">{step}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm text-slate-300 mb-1">{title}</h3>
              <p className="text-xs text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <AgentPipelineDemo />

      <CircleProductUsage />
    </div>
  )
}
