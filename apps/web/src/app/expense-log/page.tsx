"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle, Coffee, Pizza, ShoppingBasket } from "lucide-react"
import { BottomNav } from "@/components/shared/BottomNav"

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const

const recentPurchases = [
  { name: "Artisan Pizza Co.", amount: 12.4, type: "Dinner", time: "Today, 6:30 PM", icon: Pizza, iconClass: "text-secondary" },
  { name: "Campus Brew", amount: 4.2, type: "Snack", time: "Yesterday, 10:15 AM", icon: Coffee, iconClass: "text-[#895024]" },
  { name: "Fresh Market", amount: 38.15, type: "Grocery", time: "Jan 14, 2:00 PM", icon: ShoppingBasket, iconClass: "text-primary" },
]

export default function ExpenseLogPage() {
  const [amount, setAmount] = useState("")
  const [mealType, setMealType] = useState("Breakfast")
  const [note, setNote] = useState("")

  const initialBudget = 142.5
  const weeklyLimit = 250
  const val = parseFloat(amount) || 0
  const remaining = Math.max(0, initialBudget - val)
  const usedBudget = weeklyLimit - remaining
  const percentage = Math.min(100, (usedBudget / weeklyLimit) * 100)

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
              <span className={`text-xl font-semibold ${remaining <= 0 ? "text-destructive" : "text-primary"}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
            <div className="h-4 w-full bg-[#e2ebe0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  remaining <= 0
                    ? "bg-gradient-to-r from-[#ffdad6] to-destructive"
                    : "bg-gradient-to-r from-primary-light to-primary"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-muted-foreground text-sm opacity-70">Based on your $250.00 weekly limit.</p>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center py-6 gap-2">
          <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">ENTER AMOUNT</label>
          <div className="relative flex items-center">
            <span className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-primary -mr-1">$</span>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
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
            placeholder="Add a note (e.g. Whole Foods Salad)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#e2ebe0] border-none rounded-[1rem] px-4 py-4 focus:ring-2 focus:ring-primary text-[15px] leading-[22px] placeholder:text-muted-foreground/50"
          />
        </section>

        <button className="w-full h-14 bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white text-xl font-semibold rounded-full shadow-[0px_10px_30px_rgba(28,25,23,0.04)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Log Expense
        </button>

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-foreground">Recent Purchases</h3>
            <button className="text-primary text-xs font-semibold tracking-widest uppercase hover:underline transition-all">SEE ALL</button>
          </div>
          <div className="flex flex-col gap-2">
            {recentPurchases.map((purchase) => {
              const Icon = purchase.icon
              return (
                <div
                  key={purchase.name}
                  className="bg-card p-4 rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex items-center justify-between group transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#e2ebe0] flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${purchase.iconClass}`} />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-sm text-foreground">{purchase.name}</p>
                      <p className="text-xs text-muted-foreground">{purchase.type} • {purchase.time}</p>
                    </div>
                  </div>
                  <span className="text-xl font-semibold text-foreground">-${purchase.amount.toFixed(2)}</span>
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
