'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DollarSign, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"

interface DailyFee {
  day: string
  count: number
  fees: number
}

interface RevenueProfile {
  fee_per_check: number
  total_collected_onchain: number
  today_fees: number
  daily: DailyFee[]
  checks_per_day: number
  projected_annual_revenue: number
  savings_multiple: number
  legacy_cost_per_year_min: number
  legacy_cost_per_year_max: number
  cipher_cost_per_year: number
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueProfile | null>(null)

  useEffect(() => {
    const load = () => api.getNanopaymentRevenue().then(setData).catch(() => {})
    load()
    const interval = setInterval(load, 8000)
    return () => clearInterval(interval)
  }, [])

  const last = data?.daily?.[data.daily.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <DollarSign className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Compliance Fee Revenue</h2>
            <p className="text-xs text-slate-500 mt-0.5">$0.001 USDC per check · 30-day stream</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
          <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" alt="USDC" className="w-3 h-3" />
          {data?.total_collected_onchain?.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) ?? "—"} on-chain
        </div>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.daily || []} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} interval={4} />
            <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: "rgba(10,20,25,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: any) => [`$${Number(value).toFixed(4)} USDC`, "fees"]}
            />
            <Area type="monotone" dataKey="fees" stroke="#34d399" strokeWidth={2} fill="url(#feeGrad)" isAnimationActive activeDot={{ r: 4, fill: "#34d399" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
          <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1">Projected annual revenue</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-lg font-black text-emerald-400">
              ${data?.projected_annual_revenue?.toLocaleString() ?? "—"}
            </span>
          </div>
          <p className="text-[10px] text-emerald-400/40 mt-1">
            {data?.checks_per_day ?? "—"} checks/day at ${data?.fee_per_check ?? 0.001}/check
          </p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3">
          <p className="text-[10px] text-sky-400/60 uppercase tracking-wider mb-1">vs legacy compliance</p>
          <span className="text-lg font-black text-sky-400">${data?.savings_multiple ?? 49}x cheaper</span>
          <p className="text-[10px] text-sky-400/40 mt-1">
            $2–5M/yr → &lt;${(data?.cipher_cost_per_year ?? 50000) / 1000}k/yr autonomous
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {last ? `Today: ${last.count} checks · $${last.fees.toFixed(4)} USDC — updated live` : "Streaming live fee data"}
      </div>
    </motion.div>
  )
}
