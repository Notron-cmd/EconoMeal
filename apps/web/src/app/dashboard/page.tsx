"use client"

import {
  Bell,
  Bot,
  UtensilsCrossed,
  Receipt,
  Refrigerator,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"
import { useDailyBudget, useMonthlyBudget, useSaverTips } from "@/hooks/useData"

export default function DashboardPage() {
  const router = useRouter()
  const { data: daily } = useDailyBudget()
  const { data: monthly } = useMonthlyBudget()
  const { data: tips } = useSaverTips()

  const dailyBudget = daily?.daily_budget ?? 0
  const dailyRemaining = daily?.remaining ?? 0
  const dailyPercentage = daily?.percentage ?? 0
  const savingProgress = monthly?.percentage ?? 0
  const savingsAmount = monthly ? (monthly.total_spent > 0 ? monthly.monthly_budget - monthly.total_spent : monthly.monthly_budget) : 0
  const tip = tips?.[0]

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
          <h1 className="text-[28px] leading-[34px] tracking-tight font-bold text-primary">EconoMeal</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="px-5 space-y-6 pt-2">
        <section className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">TODAY&apos;S FOOD BUDGET</p>
              <h2 className="text-[40px] leading-[48px] tracking-tight font-bold text-primary">
                Rp {dailyBudget.toLocaleString("id-ID")}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">REMAINING</p>
              <h2 className="text-[32px] leading-[40px] tracking-tight font-bold text-primary">
                Rp {dailyRemaining.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[15px] leading-[22px] text-on-surface-variant italic">You&apos;re in control.</span>
              <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-primary">SAVINGS PROGRESS</span>
            </div>
            <div className="bg-[#f4f4f5] rounded-full h-[18px] overflow-hidden">
              <div className="h-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E] rounded-full" style={{ width: `${Math.min(savingProgress, 100)}%` }}></div>
            </div>
            <p className="text-center text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mt-1">
              {monthly ? `Spent Rp ${monthly.total_spent.toLocaleString("id-ID")} of Rp ${monthly.monthly_budget.toLocaleString("id-ID")}` : ""}
            </p>
          </div>
        </section>

        <section className="relative py-4">
          <button
            onClick={() => router.push("/ai-loading")}
            className="w-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E] shadow-[0_0_20px_rgba(74,222,128,0.3)] p-6 rounded-[1rem] flex items-center justify-between text-white active:scale-95 transition-transform"
          >
            <div className="text-left">
              <h3 className="text-[20px] leading-[28px] font-semibold leading-tight">Ask AI for Recommendation</h3>
              <p className="text-white/80 text-[15px] leading-[22px] mt-1">&ldquo;What can I cook with the eggs and spinach in my fridge?&rdquo;</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Bot className="w-8 h-8" />
            </div>
          </button>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-4 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">Calories</p>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#f4f4f5" strokeWidth="6" />
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#006d36" strokeDasharray="175" strokeDashoffset="45" strokeWidth="6" />
              </svg>
              <span className="absolute text-[20px] leading-[28px] font-semibold">1.2k</span>
            </div>
            <p className="text-[15px] leading-[22px] text-on-surface-variant">60% of goal</p>
          </div>
          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-4 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">Protein</p>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#f4f4f5" strokeWidth="6" />
                <circle cx="32" cy="32" fill="transparent" r="28" stroke="#fd933d" strokeDasharray="175" strokeDashoffset="100" strokeWidth="6" />
              </svg>
              <span className="absolute text-[20px] leading-[28px] font-semibold">45g</span>
            </div>
            <p className="text-[15px] leading-[22px] text-on-surface-variant">Target: 80g</p>
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
              <p className="text-[17px] leading-[24px] font-semibold text-on-surface">View Recipes</p>
            </button>
            <button
              onClick={() => router.push("/expense-log")}
              className="min-w-[140px] bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-4 flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              <div className="bg-[#dde5da] p-2 rounded-lg text-on-surface-variant">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-[17px] leading-[24px] font-semibold text-on-surface">Expense Log</p>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden flex flex-col">
          <div
            className="h-32 bg-cover bg-center"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoflnyFCln-FY0fWabwJVivE_mKRSC7yE1p1F-rRDnqKuG5ZnyUX3jzkVwJ0Vj1j31-BJuHYPxzTXJLbDM3BMI9k0Xyu45bPCPuFiuB6z8HFOkm8yH3MRlst3dOHKhpibEtotZ29Hn-gU-pbO-VpJmPcbaywST-K6okCJSZNou6yHtV5-uyFft1rdruh927pLvYki8HrclCbOKwb5cyRv3hZ528fMvkkemQV6VnMD2JJ4NPICikX5ETA')" }}
          ></div>
          <div className="p-6">
            <h4 className="text-[20px] leading-[28px] font-semibold text-on-surface">Smart Saver Tip</h4>
            <p className="text-[15px] leading-[22px] text-on-surface-variant mt-2">{tip?.tip_text ?? "Track your spending to discover saving opportunities."}</p>
            <button className="mt-4 text-primary text-[20px] leading-[28px] font-semibold flex items-center gap-1">
              Show me more <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
