"use client"

import { useState } from "react"
import { ArrowLeft, Bell, Clock, CheckCircle, Circle, Bot, UtensilsCrossed, Minus, Plus, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"

const tabs = ["INGREDIENTS", "STEPS", "NUTRITION"] as const

const ingredients = [
  { name: "Red Lentils", amount: "1 cup" },
  { name: "Coconut Milk", amount: "1/2 can" },
  { name: "Fresh Ginger", amount: "1 tbsp" },
  { name: "Turmeric Powder", amount: "1 tsp" },
]

const steps = [
  "Rinse red lentils under cold water until the water runs clear. Set aside.",
  "In a large pot, sauté onion and ginger for 5 minutes until soft and fragrant.",
  "Add spices, lentils, and 3 cups of water. Simmer for 15-20 minutes until lentils are soft.",
]

export default function RecipeDetailPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("INGREDIENTS")
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
    <div className="min-h-screen bg-background text-on-background font-body-md pb-32">
      <header className="w-full top-0 sticky z-40 bg-background flex items-center justify-between px-container-padding py-md">
        <div className="flex items-center gap-md">
          <button onClick={() => router.back()} className="text-on-surface-variant cursor-pointer active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            <span className="text-[#fd933d]">Econo</span><span className="text-primary">Meal</span>
          </span>
        </div>
        <div className="flex items-center gap-md">
          <Bell className="w-6 h-6 text-primary hover:opacity-80 transition-opacity cursor-pointer" />
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
            <img className="w-full h-full object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3CuaJ6rrTxpdToH4zWOaibiStxHwA5tqAlYuGs0axK5MdnMDX87tAVD5MEZxxYmRSVoKiku7cj6dQ9GmjpY3XepYSIacKssByDnJgNUsLa0_W-Uih6znE1GAccF9BwW3PbWvAeRlmjSXx85hOqnfJM4wiQ_hdqZoYfEgwRUI6lgaAnHxslh5bfiNvrpH1vcdkzp8gIF65dIukuq85xIg1aouKKsK7qc4c-zaHS4HBhmMwPsIcCanVIw" />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="relative w-full aspect-[4/3] px-container-padding mt-sm">
          <div className="w-full h-full rounded-lg overflow-hidden soft-card-shadow relative">
            <img className="w-full h-full object-cover" alt="Golden Red Lentil Dahl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZTMGw0HMN_MJv-U0fN6A6_AAIddLAtjDWO6qCVHLBmCf3FDNiI-zJWj15ibK4MJY-YLh11IY4gBOk-VV-lD1nUEVFbuJIsQD6Prfvndv6fQRXgU-j9RUmWdMyuaVoyG_bDG9TuyyZ7xXEObyBqjj-Wq3fWci2lhku_2hEewPaFEsmXoyKfU2vNXs58PHeL0PaHBNwHtsn13Y8qFf18dIveaZsuB3Xfq9KpaREmnjlqN1K-u1V7K5Dbg" />
            <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-md py-xs rounded-full flex items-center gap-xs">
              <Clock className="w-[18px] h-[18px] text-primary" />
              <span className="font-label-caps text-on-surface-variant">25 MIN</span>
            </div>
          </div>
        </div>

        <section className="px-container-padding mt-lg space-y-md">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Golden Red Lentil Dahl</h1>
            <p className="font-body-md text-on-surface-variant">High-protein, vegan comfort food that&apos;s easy on the wallet.</p>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest p-md rounded-lg soft-card-shadow flex flex-col justify-between">
              <span className="font-label-caps text-on-surface-variant uppercase">Estimated Cost</span>
              <div className="mt-sm">
                <span className="text-headline-lg-mobile font-bold text-primary">$2.50</span>
                <p className="text-[12px] text-on-surface-variant mt-xs">Per serving</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-lg soft-card-shadow flex flex-col justify-between">
              <span className="font-label-caps text-on-surface-variant uppercase">Budget Impact</span>
              <div className="mt-sm">
                <span className="text-headline-lg-mobile font-bold text-secondary">-15%</span>
                <p className="text-[12px] text-on-surface-variant mt-xs">Daily Goal</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container p-md rounded-lg flex justify-around items-center">
            <div className="text-center">
              <p className="font-bold text-on-surface">340</p>
              <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Kcal</p>
            </div>
            <div className="w-[1px] h-8 bg-outline-variant" />
            <div className="text-center">
              <p className="font-bold text-on-surface">18g</p>
              <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Protein</p>
            </div>
            <div className="w-[1px] h-8 bg-outline-variant" />
            <div className="text-center">
              <p className="font-bold text-on-surface">42g</p>
              <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Carbs</p>
            </div>
            <div className="w-[1px] h-8 bg-outline-variant" />
            <div className="text-center">
              <p className="font-bold text-on-surface">6g</p>
              <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Fats</p>
            </div>
          </div>
        </section>

        <div className="mt-xl border-b border-surface-container-high px-container-padding sticky top-[72px] bg-background/90 backdrop-blur-sm z-30">
          <div className="flex gap-xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-label-caps py-md transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "text-primary border-b-[3px] border-primary"
                    : "text-on-surface-variant opacity-60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-container-padding py-lg min-h-[400px]">
          {activeTab === "INGREDIENTS" && (
            <div className="space-y-md">
              <div className="flex items-center justify-between mb-sm">
                <span className="font-title-md text-title-md text-on-surface">Serves {servings}</span>
                <div className="flex bg-surface-container rounded-full p-xs">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center font-bold text-primary active:scale-90 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 flex items-center justify-center font-bold">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center font-bold text-primary active:scale-90 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <ul className="space-y-sm">
                {ingredients.map((item, idx) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between p-md bg-surface-container-lowest rounded-lg border border-surface-container-high"
                  >
                    <button onClick={() => toggleCheck(idx)} className="flex items-center gap-md">
                      {checkedItems.has(idx) ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-outline" />
                      )}
                      <span className={`font-body-md ${checkedItems.has(idx) ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                        {item.name}
                      </span>
                    </button>
                    <span className="text-on-surface-variant font-semibold">{item.amount}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-xl bg-surface-container-low p-lg rounded-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-sm mb-sm text-primary">
                    <Bot className="w-5 h-5" />
                    <span className="font-label-caps">AI BUDGET TIP</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    Buy lentils in <span className="font-bold text-primary">bulk</span> to save $0.50 more next time. They have a 12-month shelf life!
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-5 text-primary scale-[4]">
                  <Wallet className="w-[80px] h-[80px]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "STEPS" && (
            <div className="space-y-lg">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-md">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <p className="font-body-md text-on-surface">{step}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "NUTRITION" && (
            <div className="space-y-md">
              <div className="bg-surface-container-lowest p-lg rounded-lg soft-card-shadow">
                <h3 className="font-title-md text-on-surface mb-md">Daily Values</h3>
                <div className="space-y-lg">
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-caps">PROTEIN</span>
                      <span className="font-bold">18g / 50g</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[36%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-caps">BUDGET</span>
                      <span className="font-bold">$2.50 / $15.00</span>
                    </div>
                    <div className="h-[18px] w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[16%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-[72px] w-full bg-background/80 backdrop-blur-xl p-container-padding z-50">
        <button className="w-full h-[56px] pill-gradient text-on-primary rounded-full font-bold text-lg active:scale-95 transition-transform soft-card-shadow flex items-center justify-center gap-md">
          <UtensilsCrossed className="w-5 h-5" />
          Mark as Cooked
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
