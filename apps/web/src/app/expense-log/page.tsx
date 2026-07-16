"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle, Coffee, Pizza, ShoppingBasket, Loader2 } from "lucide-react"
import { BottomNav } from "@/components/shared/BottomNav"
import { useExpenses, useCreateExpense, useWeeklyBudget } from "@/hooks/useData"
import type { Expense } from "@/lib/types"

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const
const mealTypeMap: Record<string, string> = {
  Breakfast: "breakfast",
  Lunch: "lunch",
  Dinner: "dinner",
  Snack: "snack",
}
const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
  Dinner: { icon: Pizza, color: "text-secondary" },
  Snack: { icon: Coffee, color: "text-[#895024]" },
  Grocery: { icon: ShoppingBasket, color: "text-primary" },
  Lunch: { icon: Coffee, color: "text-[#895024]" },
  Breakfast: { icon: Coffee, color: "text-[#895024]" },
}
const fallbackIcon = { icon: ShoppingBasket, color: "text-primary" }

export default function ExpenseLogPage() {
  const [amount, setAmount] = useState("")
  const [mealType, setMealType] = useState("Breakfast")
  const [note, setNote] = useState("")

  const { data: expenses, isLoading: expLoading } = useExpenses()
  const { data: weekly } = useWeeklyBudget()
  const createExpense = useCreateExpense()

  const weeklyBudget = weekly?.weekly_budget ?? 0
  const weeklySpent = weekly?.total_spent ?? 0
  const weeklyRemaining = Math.max(0, weeklyBudget - weeklySpent)
  const percentage = weeklyBudget > 0 ? Math.min(100, Math.round((weeklySpent / weeklyBudget) * 100)) : 0

  const handleLog = async () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) return
    try {
      await createExpense.mutateAsync({
        amount: val,
        name: note || undefined,
        meal_type: mealTypeMap[mealType] || "other",
        note: note || undefined,
      })
      setAmount("")
      setNote("")
    } catch {
      // ignore
    }
  }

  const timeAgo = (loggedAt: string) => {
    const d = new Date(loggedAt)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <header className="w-full top-0 sticky bg-background flex items-center justify-between px-5 py-4 z-40">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:opacity-80 transition-opacity active:scale-95" onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[28px] leading-[34px] font-bold tracking-tight text-primary">Log Expense</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#e2ebe0] overflow-hidden">
          <img className="w-full h-full object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXyUcV4zjRtYN2lMk_LeFrdQclDw9_JhbFzm9pngdJg6_mu53Ee4OKsY0ZAkAT-sxYF2TlCLG4eUpnCqKtjyDpOFIDSyaHd849AsRJmpfZ7_9tJR9nesTMoCcrWD9NfhY8iN8rgCcJBXOQ8MUd-a14KUW3gtI8FLHIO9j6aC_bbf5HnzM5SupNARkTv4KxhtxoWmCo0p7THd4HD9tFS_n9zvcl39nQNJGsn6iBvnfMMR5rDHslPwFmQg" />
        </div>
      </header>

      <main className="px-5 max-w-md mx-auto">
        <section className="mt-6 mb-8">
          <div className="bg-card p-6 rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Remaining Budget</span>
              <span className={`text-xl font-semibold ${weeklyRemaining <= 0 ? "text-destructive" : "text-primary"}`}>
                Rp {weeklyRemaining.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="h-4 w-full bg-[#e2ebe0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  weeklyRemaining <= 0
                    ? "bg-gradient-to-r from-[#ffdad6] to-destructive"
                    : "bg-gradient-to-r from-primary-light to-primary"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-muted-foreground text-sm opacity-70">Based on your Rp {weeklyBudget.toLocaleString("id-ID")} weekly limit.</p>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center py-6 gap-2">
          <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">ENTER AMOUNT</label>
          <div className="relative flex items-center">
            <span className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-primary -mr-1">Rp</span>
            <input
              type="number"
              placeholder="0"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-foreground focus:ring-0 w-48 text-center placeholder:opacity-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </section>

        <section className="my-8">
          <div className="bg-[#e2ebe0] p-1 rounded-full flex items-center">
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`flex-1 py-2 px-4 rounded-[2rem] text-xs font-semibold tracking-widest uppercase transition-all active:scale-95 ${
                  mealType === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <input
            type="text"
            placeholder="Merchant name (e.g. Warung Makmur)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#e2ebe0] border-none rounded-[1rem] px-4 py-4 focus:ring-2 focus:ring-primary text-[15px] leading-[22px] placeholder:text-muted-foreground/50"
          />
        </section>

        <button
          onClick={handleLog}
          disabled={!amount || parseFloat(amount) <= 0 || createExpense.isPending}
          className="w-full h-14 bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white text-xl font-semibold rounded-full shadow-[0px_10px_30px_rgba(28,25,23,0.04)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createExpense.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Log Expense
            </>
          )}
        </button>

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-foreground">Recent Purchases</h3>
          </div>
          <div className="flex flex-col gap-2">
            {expLoading && <p className="text-center text-muted-foreground">Loading...</p>}
            {expenses?.length === 0 && !expLoading && (
              <p className="text-center text-muted-foreground">No expenses yet</p>
            )}
            {expenses?.map((purchase: Expense) => {
              const iconData = typeIcons[purchase.meal_type] ?? typeIcons[purchase.meal_type.charAt(0).toUpperCase() + purchase.meal_type.slice(1)] ?? fallbackIcon
              const Icon = iconData.icon
              return (
                <div
                  key={purchase.id}
                  className="bg-card p-4 rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex items-center justify-between group transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#e2ebe0] flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${iconData.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-sm text-foreground">{purchase.name || purchase.meal_type}</p>
                      <p className="text-xs text-muted-foreground">{purchase.meal_type} &bull; {timeAgo(purchase.logged_at)}</p>
                    </div>
                  </div>
                  <span className="text-xl font-semibold text-foreground">-Rp{purchase.amount.toLocaleString("id-ID")}</span>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
