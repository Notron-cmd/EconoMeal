"use client"

import { useState } from "react"
import { ShoppingCart, PiggyBank, Banknote, Loader2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function FinancialSetupPage() {
  const router = useRouter()
  const [step] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    savingsGoal: "",
  })

  const totalSteps = 2
  const progress = (step / totalSteps) * 100

  const formatRupiah = (value: string) => {
    const digits = value.replace(/\D/g, "")
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseRupiah = (value: string) => value.replace(/\./g, "")

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const digits = raw.replace(/\D/g, "")
    const formatted = formatRupiah(digits)
    setForm((prev) => ({ ...prev, [field]: formatted }))
  }

  const handleCalculate = async () => {
    const income = Number(parseRupiah(form.monthlyIncome))
    const expenses = Number(parseRupiah(form.monthlyExpenses))
    const savings = Number(parseRupiah(form.savingsGoal))

    if (!income || income <= 0) return

    setLoading(true)
    try {
      await api.post("/api/finances", {
        uang_bulanan: income,
        pengeluaran_tetap: expenses,
        target_tabungan: savings,
      })
      router.push("/preferences")
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-md mx-auto">
        <header className="w-full px-5 pt-8 pb-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-surface-variant tracking-wider">Step {step} of {totalSteps}</span>
            <span className="text-xs font-bold text-primary tracking-wider">{progress}%</span>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </header>

        <main className="flex-1 px-5 flex flex-col pb-8">
          <section className="mt-6 mb-6">
            <h1 className="text-[28px] font-bold text-on-surface tracking-tight mb-1">Financial Setup</h1>
            <p className="text-[15px] text-on-surface-variant leading-[22px]">
              Let&apos;s build your vitality budget. We&apos;ll help you find the balance between living well and saving smart.
            </p>
          </section>

          <div className="mb-6 aspect-[16/9] rounded-lg overflow-hidden relative bg-white shadow-sm">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-64 h-64 bg-primary-container rounded-full blur-3xl"></div>
              <div className="absolute -bottom-[10%] -right-[5%] w-48 h-48 bg-secondary-container rounded-full blur-3xl"></div>
            </div>
            <div className="w-full h-full flex items-center justify-center p-6">
              <img
                className="w-full h-full object-contain drop-shadow-md"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXgP6ypIZXnoJxWHBamc9YJT_UC85KKkeACiItCmolMhTLSFNHwes8YGIdfg3Vv5YrJKlr0FH_Q13N3Em6Sg1IzZR4i_JHhB6szTpWPnmMrKjSOWKAV2LpGYbqXwWndl-1ujxirNyy5nHL4jaHVFAJj4OC6PaW8GjJjYRtFqmdrBjVD-5zi5DbjUhjG8W6Sx5nfdIIwOlsSpB-naUm4RN34ItVY8Eu-px1ttbYisG4xpw8RZCrEm84Zw"
                alt="A premium 3D minimalist illustration of a student's desk with a small plant, a digital tablet showing a green growth chart, and a stack of coins."
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-on-surface ml-1" htmlFor="monthly-income">
                Monthly Income
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-2xl shadow-sm p-2 border-2 border-transparent transition-all focus-within:[box-shadow:0_0_0_2px_#006d36]">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mr-4 shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    id="monthly-income"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.monthlyIncome}
                    onChange={handleChange("monthlyIncome")}
                    className="w-full bg-transparent outline-none text-lg font-semibold text-on-surface p-0 h-auto placeholder:text-[#bccabb]"
                  />
                </div>
                <span className="text-on-surface-variant text-xs font-semibold tracking-wider px-4 border-l border-surface-container-higher shrink-0">Rp</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-on-surface ml-1" htmlFor="monthly-expenses">
                Monthly Expenses
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-2xl shadow-sm p-2 border-2 border-transparent transition-all focus-within:[box-shadow:0_0_0_2px_#006d36]">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mr-4 shrink-0">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    id="monthly-expenses"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.monthlyExpenses}
                    onChange={handleChange("monthlyExpenses")}
                    className="w-full bg-transparent outline-none text-lg font-semibold text-on-surface p-0 h-auto placeholder:text-[#bccabb]"
                  />
                </div>
                <span className="text-on-surface-variant text-xs font-semibold tracking-wider px-4 border-l border-surface-container-higher shrink-0">Rp</span>
              </div>
              <p className="text-[11px] text-on-surface-variant/70 italic ml-1">Include rent, groceries, and subscriptions.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-on-surface ml-1" htmlFor="savings-goal">
                Savings Goal
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-2xl shadow-sm p-2 border-2 border-transparent transition-all focus-within:[box-shadow:0_0_0_2px_#006d36]">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary mr-4 shrink-0">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    id="savings-goal"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.savingsGoal}
                    onChange={handleChange("savingsGoal")}
                    className="w-full bg-transparent outline-none text-lg font-semibold text-on-surface p-0 h-auto placeholder:text-[#bccabb]"
                  />
                </div>
                <span className="text-on-surface-variant text-xs font-semibold tracking-wider px-4 border-l border-surface-container-higher shrink-0">Rp</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[32px]"></div>

          <div className="mt-auto pt-6">
            <button
              className="w-full h-14 bg-gradient-to-b from-[#4ADE80] to-[#006d36] text-white rounded-full text-lg font-semibold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCalculate}
              disabled={loading || !form.monthlyIncome}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Calculate My Daily Budget</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center mt-4 text-on-surface-variant text-[13px] opacity-60">
              We&apos;ll use this to optimize your recipe suggestions.
            </p>
          </div>
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="w-28 h-28 relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
            <div className="absolute inset-0 rounded-full border-[3px] border-surface-container-highest" />
            <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center animate-bounce">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2 text-center animate-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-lg font-semibold text-on-surface">Calculating your daily budget</h2>
            <p className="text-[15px] text-on-surface-variant/70">Finding the perfect balance for you.</p>
          </div>
        </div>
      )}
    </div>
  )
}
