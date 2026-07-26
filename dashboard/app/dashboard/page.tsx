'use client'

import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"

function DashboardContent() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="dark min-h-screen bg-dashboard flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading dashboard...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}