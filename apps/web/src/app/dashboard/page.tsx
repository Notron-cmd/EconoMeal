"use client"

import { useState } from "react"
import {
  Bell,
  Bot,
  UtensilsCrossed,
  Refrigerator,
  Plus,
  X,
  Loader2,
  Flame,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"
import { useDailyBudget, useDailyNutrition, useDailySpending, useLogExpense, useWeeklySpending, useStreak } from "@/hooks/useData"

export default function DashboardPage() {
  const router = useRouter()
  const [showLogModal, setShowLogModal] = useState(false)
  const [logAmount, setLogAmount] = useState("")
  const logExpense = useLogExpense()
  const { data: daily, isLoading: budgetLoading, isError: budgetErr } = useDailyBudget()
  const { data: nutrition } = useDailyNutrition()
  const { data: spending } = useDailySpending()
  const { data: weeklyData } = useWeeklySpending()
  const { data: streakData } = useStreak()

  const dailyBudget = daily?.daily_budget ?? 0
  const anggaranMakan = daily?.anggaran_makan ?? 0
  const totalSpent = spending?.total_spent ?? 0
  const sisa = Math.max(0, dailyBudget - totalSpent)
  const pct = dailyBudget > 0 ? Math.min(totalSpent / dailyBudget, 1) * 100 : 0
  const barColor = pct < 70 ? "bg-[#22C55E]" : pct < 100 ? "bg-[#fd933d]" : "bg-destructive"
  const nutrisi = nutrition ?? { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0 }
  const days: { date: string; total_spent: number }[] = weeklyData?.days ?? []
  const maxSpend = Math.max(...days.map((d: { total_spent: number }) => d.total_spent), 1)
  const streak = streakData?.streak ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-secondary/5 pb-32">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <header className="w-full top-0 sticky z-40 bg-background flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuIx_OsMtlqvBxsZGXb77BX8FLapb1NkUGfhBdE_Qs_l_tmgMebOktxVzN1_Pu5si9rWM_6AqV-cIyWKIgh7pZvC1UPg9Dxk_d2I7tL9q9zwXVycEQaX7AveAFLuxAxxTpM3xdTo21WbkryT70QOfIolOEv5EK0oEaI7L2YoQvSAiTaunPLOaUAuynXvJjewk8HiXBypNWFgMT_TuHusVkeaPtJKVF1KYPIsMuYFAZGuMFT3qjwgk_Hg"
              alt="User avatar"
            />
          </div>
          <h1 className="text-[28px] leading-[34px] tracking-tight font-bold">
            <span className="text-[#fd933d]">Econo</span><span className="text-primary">Meal</span>
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="px-5 space-y-6 pt-2">
        <section className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6">
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1 text-center uppercase">
            Budget Makan Harian
          </p>
          {budgetLoading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="h-[48px] w-48 bg-surface-container-high rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse" />
            </div>
          ) : budgetErr ? (
            <p className="text-destructive text-center text-sm py-4">Gagal memuat budget. <button onClick={() => location.reload()} className="underline">Muat ulang</button></p>
          ) : (
            <>
              <h2 className="text-[48px] leading-[56px] tracking-tight font-bold text-primary text-center">
                Rp {dailyBudget.toLocaleString("id-ID")}
              </h2>
              <p className="text-center text-sm text-on-surface-variant mt-2">
                Dari Rp {anggaranMakan.toLocaleString("id-ID")} / bulan
              </p>
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Terpakai</span>
                  <span className="font-semibold">Rp {totalSpent.toLocaleString("id-ID")}</span>
                </div>
                <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Sisa</span>
                  <span className={`font-semibold ${sisa === 0 ? "text-destructive" : "text-primary"}`}>
                    Rp {sisa.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Catat Pengeluaran
              </button>
            </>
          )}
        </section>

        <section className="relative py-4">
          <button
            onClick={() => router.push("/ai-loading")}
            className="w-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E] shadow-[0_0_20px_rgba(74,222,128,0.3)] p-6 rounded-[1rem] flex items-center justify-between text-white active:scale-95 transition-transform"
          >
            <div className="text-left">
              <h3 className="text-[20px] leading-[28px] font-semibold leading-tight">Rekomendasi AI</h3>
              <p className="text-white/80 text-[15px] leading-[22px] mt-1">&ldquo;Apa yang bisa aku masak dengan budget Rp {dailyBudget.toLocaleString("id-ID")} hari ini?&rdquo;</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Bot className="w-8 h-8" />
            </div>
          </button>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-4 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-xs tracking-[0.05em] font-bold text-on-surface-variant uppercase">Kalori</p>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#f4f4f5" strokeWidth="6" />
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#006d36" strokeDasharray="175" strokeDashoffset={175 - Math.min(nutrisi.kalori / 2150, 1) * 175} strokeWidth="6" />
              </svg>
              <span className="absolute text-sm font-bold">{nutrisi.kalori > 0 ? nutrisi.kalori.toLocaleString("id-ID") : "—"}</span>
            </div>
              <p className="text-xs text-on-surface-variant">{nutrisi.kalori > 0 ? `${Math.round(nutrisi.kalori / 2150 * 100)}%` : "—"}</p>
          </div>
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px rgba(28,25,23,0.04)] p-4 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-xs tracking-[0.05em] font-bold text-on-surface-variant uppercase">Protein</p>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#f4f4f5" strokeWidth="6" />
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#fd933d" strokeDasharray="175" strokeDashoffset={175 - Math.min(nutrisi.protein / 65, 1) * 175} strokeWidth="6" />
              </svg>
              <span className="absolute text-sm font-bold">{nutrisi.protein > 0 ? `${nutrisi.protein}g` : "—"}</span>
            </div>
            <p className="text-xs text-on-surface-variant">{nutrisi.protein > 0 ? "Target 65g" : "—"}</p>
          </div>
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px rgba(28,25,23,0.04)] p-4 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-xs tracking-[0.05em] font-bold text-on-surface-variant uppercase">Karbo</p>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#f4f4f5" strokeWidth="6" />
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#fd933d" strokeDasharray="175" strokeDashoffset={175 - Math.min(nutrisi.karbohidrat / 300, 1) * 175} strokeWidth="6" />
              </svg>
              <span className="absolute text-sm font-bold">{nutrisi.karbohidrat > 0 ? `${nutrisi.karbohidrat}g` : "—"}</span>
            </div>
            <p className="text-xs text-on-surface-variant">{nutrisi.karbohidrat > 0 ? "Target 300g" : "—"}</p>
          </div>
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px rgba(28,25,23,0.04)] p-4 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-xs tracking-[0.05em] font-bold text-on-surface-variant uppercase">Lemak</p>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#f4f4f5" strokeWidth="6" />
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#3b82f6" strokeDasharray="175" strokeDashoffset={175 - Math.min(nutrisi.lemak / 65, 1) * 175} strokeWidth="6" />
              </svg>
              <span className="absolute text-sm font-bold">{nutrisi.lemak > 0 ? `${nutrisi.lemak}g` : "—"}</span>
            </div>
            <p className="text-xs text-on-surface-variant">{nutrisi.lemak > 0 ? "Target 65g" : "—"}</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface px-2">Quick Actions</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <button
              onClick={() => router.push("/fridge-saver")}
              className="min-w-[140px] bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-4 flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              <div className="bg-[#4ade80]/20 p-2 rounded-lg text-primary">
                <Refrigerator className="w-6 h-6" />
              </div>
              <p className="text-[17px] leading-[24px] font-semibold text-on-surface">Fridge Saver</p>
            </button>
            <button
              onClick={() => router.push("/recipes")}
              className="min-w-[140px] bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-4 flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              <div className="bg-[#fd933d]/20 p-2 rounded-lg text-secondary">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <p className="text-[17px] leading-[24px] font-semibold text-on-surface">Resep</p>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5 flex flex-col items-center text-center">
            <Flame className="w-6 h-6 text-[#fd933d] mb-2" />
            <p className="text-[28px] font-bold text-foreground">{streak}</p>
            <p className="text-xs text-on-surface-variant">hari berturut-turut</p>
            <p className="text-[10px] text-on-surface-variant">dalam budget</p>
          </div>
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5 flex flex-col items-center text-center">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <p className="text-[28px] font-bold text-foreground">
              {pct < 100 ? "✅" : "❌"}
            </p>
            <p className="text-xs text-on-surface-variant">Hari ini</p>
            <p className="text-[10px] text-on-surface-variant">{pct < 100 ? "Masih aman" : "Overspend"}</p>
          </div>
        </section>

        <section className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5">
          <h4 className="text-[15px] font-semibold text-on-surface mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Pengeluaran 7 Hari
          </h4>

          {/* Budget threshold line area */}
          <div className="relative">
            {/* Budget line reference */}
            {dailyBudget > 0 && (
              <div
                className="absolute left-0 right-0 border-t border-dashed border-[#fd933d]/50 z-10"
                style={{ bottom: `${Math.min((dailyBudget / maxSpend) * 100, 100)}%` }}
              >
                <span className="absolute -top-3 right-0 text-[9px] text-[#fd933d] font-medium">
                  Budget Rp{(dailyBudget / 1000).toFixed(0)}k
                </span>
              </div>
            )}

            <div className="flex items-end gap-2 h-36 pt-4">
              {days.map((d) => {
                const dayLabel = new Date(d.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short" })
                const isToday = d.date === new Date().toISOString().split("T")[0]
                const pctHeight = (d.total_spent / maxSpend) * 100
                const over = d.total_spent > dailyBudget && dailyBudget > 0
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className={`text-[10px] font-semibold ${over ? "text-destructive" : "text-primary"}`}>
                      {d.total_spent > 0 ? `Rp${(d.total_spent / 1000).toFixed(0)}k` : (isToday ? "Rp0" : "")}
                    </span>
                    <div className="w-full flex-1 flex items-end justify-center">
                      <div
                        className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 ${
                          over ? "bg-gradient-to-t from-destructive/80 to-destructive" : "bg-gradient-to-t from-primary/60 to-primary"
                        }`}
                        style={{ height: `${Math.max(pctHeight, 4)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] ${isToday ? "text-foreground font-semibold" : "text-on-surface-variant"}`}>
                      {dayLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {dailyBudget > 0 && (
            <p className="text-[10px] text-on-surface-variant text-center mt-4">
              Batas budget harian: Rp {dailyBudget.toLocaleString("id-ID")}
            </p>
          )}
        </section>
      </main>

      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogModal(false)} />
          <div className="relative w-full max-w-sm bg-background rounded-2xl p-6 shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Catat Pengeluaran</h3>
              <button onClick={() => setShowLogModal(false)} className="p-1 rounded-full hover:bg-surface-container-low active:scale-90 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Rp 0"
              value={logAmount}
              onChange={(e) => setLogAmount(e.target.value)}
              className="w-full text-center text-3xl font-bold py-4 rounded-xl bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-on-surface-variant text-center mt-2">Masukkan nominal pengeluaran hari ini</p>
            <button
              onClick={async () => {
                const amount = Number(logAmount)
                if (amount <= 0) return
                await logExpense.mutateAsync(amount)
                setLogAmount("")
                setShowLogModal(false)
              }}
              disabled={logExpense.isPending || !logAmount || Number(logAmount) <= 0}
              className="mt-5 w-full bg-primary text-white rounded-xl py-3.5 font-bold text-base active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {logExpense.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Simpan"}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
