"use client"

import { useState } from "react"
import { Plus, Receipt, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNav } from "@/components/shared/BottomNav"

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const

const recentPurchases = [
  { name: "Artisan Pizza Co.", amount: -12.4, type: "Dinner" },
  { name: "Campus Brew", amount: -4.2, type: "Snack" },
  { name: "Fresh Market", amount: -38.15, type: "Grocery" },
]

export default function ExpenseLogPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [mealType, setMealType] = useState<string>("Lunch")
  const [note, setNote] = useState("")

  const budgetTotal = 142.5
  const spent = 40
  const remaining = budgetTotal - spent
  const percentage = (spent / budgetTotal) * 100

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 space-y-6">
        {/* Budget Preview */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-on-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold opacity-80">Remaining Budget</p>
              <span className="text-xs font-semibold opacity-80">{Math.round(percentage)}%</span>
            </div>
            <p className="text-4xl font-bold mb-3">${remaining.toFixed(2)}</p>
            <Progress value={percentage} className="h-3 bg-white/20 [&>div]:bg-white" />
            <div className="flex justify-between text-xs font-medium opacity-80 mt-2">
              <span>Spent: ${spent.toFixed(2)}</span>
              <span>Total: ${budgetTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Input */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-[20px] font-semibold text-on-surface">Log Expense</h3>

            <div>
              <label className="text-sm font-semibold text-on-surface mb-1.5 block">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg font-semibold h-14"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-on-surface mb-2 block">Meal Type</label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      mealType === type
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-on-surface mb-1.5 block">Note (optional)</label>
              <Input
                placeholder="Add a note (e.g. Whole Foods Salad)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              size="lg"
              className="w-full text-[17px] font-bold"
              disabled={!amount}
              onClick={() => {
                setAmount("")
                setNote("")
              }}
            >
              <Plus className="w-5 h-5" />
              Log Expense
            </Button>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <div>
          <h3 className="text-[20px] font-semibold text-on-surface mb-3">Recent Purchases</h3>
          <div className="space-y-2">
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.name}
                className="bg-card p-4 rounded-[1rem] flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">{purchase.name}</p>
                    <p className="text-xs text-on-surface-variant">{purchase.type}</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-destructive">
                  -${Math.abs(purchase.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
