"use client"

import { useState } from "react"
import { DollarSign, ShoppingCart, PiggyBank, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function FinancialSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    savingsGoal: "",
  })

  const totalSteps = 2
  const progress = (step / totalSteps) * 100

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleCalculate = () => {
    const income = Number(form.monthlyIncome)
    const expenses = Number(form.monthlyExpenses)
    const savings = Number(form.savingsGoal)

    if (!income || income <= 0) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/preferences")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-8">
        <div className="mb-2">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">
            Step {step} of {totalSteps}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-[1.5rem] bg-surface-container-low flex items-center justify-center shadow-inner">
                <div className="text-5xl">🪴</div>
              </div>
            </div>

            <h2 className="text-[28px] font-bold text-on-surface text-center tracking-tight mb-1">
              Financial Setup
            </h2>
            <p className="text-[15px] text-on-surface-variant text-center leading-[22px] mb-8">
              Let&apos;s build your vitality budget.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-on-surface mb-1.5 block">
                  Monthly Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.monthlyIncome}
                    onChange={handleChange("monthlyIncome")}
                    className="pl-12 text-lg font-semibold h-14"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface mb-1.5 block">
                  Monthly Expenses
                </label>
                <div className="relative">
                  <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.monthlyExpenses}
                    onChange={handleChange("monthlyExpenses")}
                    className="pl-12 text-lg font-semibold h-14"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-1 ml-1">
                  Include rent, groceries, and subscriptions.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface mb-1.5 block">
                  Savings Goal
                </label>
                <div className="relative">
                  <PiggyBank className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.savingsGoal}
                    onChange={handleChange("savingsGoal")}
                    className="pl-12 text-lg font-semibold h-14"
                  />
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-8 text-[17px] font-bold"
              onClick={handleCalculate}
              disabled={loading || !form.monthlyIncome}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Crunching numbers...
                </>
              ) : (
                <>
                  Calculate My Daily Budget
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
