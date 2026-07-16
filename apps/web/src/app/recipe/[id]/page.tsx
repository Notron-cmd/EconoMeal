"use client"

import { useState } from "react"
import { Timer, DollarSign, Zap, Check, ChefHat, Lightbulb, ArrowLeft, Plus, Minus, Leaf } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BottomNav } from "@/components/shared/BottomNav"

const tabs = ["Ingredients", "Steps", "Nutrition"] as const

const ingredients = [
  { name: "Red Lentils", amount: "1 cup", checked: false },
  { name: "Coconut Milk", amount: "1/2 can", checked: false },
  { name: "Fresh Ginger", amount: "1 tbsp", checked: false },
  { name: "Turmeric Powder", amount: "1 tsp", checked: false },
  { name: "Sweet Potato", amount: "1 large", checked: false },
  { name: "Spinach", amount: "2 cups", checked: false },
]

export default function RecipeDetailPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("Ingredients")
  const [servings, setServings] = useState(2)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-64 w-full overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop')",
          }}
        />
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </button>
        </div>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 text-sm font-semibold shadow-sm">
          <Timer className="w-4 h-4 text-primary" />
          25 MIN
        </div>
      </div>

      <div className="px-5 pt-4 pb-4 space-y-5">
        {/* Title & Description */}
        <div>
          <h1 className="text-[28px] font-bold text-on-surface leading-tight mb-1">Golden Red Lentil Dahl</h1>
          <p className="text-[15px] text-on-surface-variant leading-[22px]">
            High-protein, vegan comfort food that&apos;s easy on the wallet.
          </p>
        </div>

        {/* Cost & Impact */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-secondary" />
              <div>
                <p className="text-xs font-semibold text-on-surface-variant">Estimated Cost</p>
                <p className="text-lg font-bold text-on-surface">$2.50</p>
                <p className="text-[10px] text-on-surface-variant">per serving</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs font-semibold text-on-surface-variant">Budget Impact</p>
                <p className="text-lg font-bold text-primary">-15%</p>
                <p className="text-[10px] text-on-surface-variant">Daily Goal</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutrition Bar */}
        <div className="flex justify-between bg-surface-container-low rounded-xl px-4 py-3">
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">340</p>
            <p className="text-[10px] font-semibold text-on-surface-variant">Kcal</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">18g</p>
            <p className="text-[10px] font-semibold text-on-surface-variant">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">42g</p>
            <p className="text-[10px] font-semibold text-on-surface-variant">Carbs</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">6g</p>
            <p className="text-[10px] font-semibold text-on-surface-variant">Fats</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Ingredients Tab */}
        {activeTab === "Ingredients" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-on-surface-variant">Serves {servings}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-on-surface">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {ingredients.map((item, idx) => (
                <button
                  key={item.name}
                  onClick={() => toggleCheck(idx)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    checkedItems.has(idx) ? "opacity-50" : "hover:bg-surface-container"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      checkedItems.has(idx)
                        ? "bg-primary border-primary text-on-primary"
                        : "border-outline"
                    }`}
                  >
                    {checkedItems.has(idx) && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span
                    className={`text-[15px] ${
                      checkedItems.has(idx)
                        ? "line-through text-on-surface-variant"
                        : "text-on-surface"
                    }`}
                  >
                    {item.amount} {item.name}
                  </span>
                </button>
              ))}
            </div>

            {/* AI Budget Tip */}
            <div className="flex items-start gap-3 p-4 bg-primary-container/20 rounded-xl border border-primary-container/30">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-primary mb-0.5">AI Budget Tip</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Buy lentils in bulk to save $0.50 more next time. They have a 12-month shelf life!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Steps Tab */}
        {activeTab === "Steps" && (
          <div className="space-y-4">
            {[
              "Rinse red lentils and chop sweet potato into cubes.",
              "Sauté ginger and turmeric in oil until fragrant.",
              "Add lentils, sweet potato, coconut milk, and simmer for 20 min.",
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </div>
                <p className="text-[15px] text-on-surface leading-[22px] pt-1">{step}</p>
              </div>
            ))}
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === "Nutrition" && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold text-on-surface">Protein</span>
                <span className="text-sm text-on-surface-variant">18g / 50g</span>
              </div>
              <Progress value={36} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold text-on-surface">Budget Used</span>
                <span className="text-sm text-on-surface-variant">$2.50 / $15.00</span>
              </div>
              <Progress value={16} className="h-3 [&>div]:bg-secondary" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 px-5 z-30">
        <Button size="lg" className="w-full text-[17px] font-bold">
          <Check className="w-5 h-5" />
          Mark as Cooked
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
