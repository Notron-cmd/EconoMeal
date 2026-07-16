"use client"

import { useState } from "react"
import { Search, Bot, Plus, Egg, CookingPot, ChefHat, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/shared/BottomNav"

const initialIngredients = ["Eggs", "Rice", "Onions", "Spinach"]
const suggestedIngredients = ["Tomato", "Salmon", "Chicken", "Tofu", "Carrots", "Potato"]

export default function FridgeSaverPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [ingredients, setIngredients] = useState(initialIngredients)

  const addIngredient = (item: string) => {
    if (!ingredients.includes(item)) {
      setIngredients((prev) => [...prev, item])
    }
    setSearch("")
  }

  const removeIngredient = (item: string) => {
    setIngredients((prev) => prev.filter((i) => i !== item))
  }

  const filteredSuggestions = suggestedIngredients.filter(
    (i) => !ingredients.includes(i) && i.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="px-6 pt-6">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            What&apos;s in your fridge?
          </h2>
          <p className="text-[#475569] leading-relaxed">
            Save food and money. Add your ingredients and let AI suggest your next meal.
          </p>
        </div>

        {/* AI Scan Card */}
        <div className="relative w-full h-48 mb-8 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(14,165,233,0.05)] flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
              <Bot className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <span className="text-sm font-bold text-[#0EA5E9] tracking-widest uppercase">
              Smart Sensing Active
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0EA5E9]" />
          <input
            type="text"
            placeholder="Add ingredients (e.g. Tomato, Salmon...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 pl-12 pr-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all text-[#0F172A] placeholder:text-[#475569]/50 text-sm"
          />
          {search && filteredSuggestions.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-10">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => addIngredient(item)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-[#0F172A] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#0EA5E9]" />
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ingredients Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#0F172A]">Your Ingredients</h3>
            <span className="text-sm text-[#0EA5E9] font-medium">{ingredients.length} Items</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ingredients.map((item) => {
              const icons: Record<string, React.ReactNode> = {
                Eggs: <Egg className="w-5 h-5 text-amber-600" />,
                Rice: <CookingPot className="w-5 h-5 text-slate-600" />,
                Onions: <ChefHat className="w-5 h-5 text-purple-600" />,
                Spinach: <span className="text-green-600 text-lg">🥬</span>,
              }
              return (
                <div
                  key={item}
                  onClick={() => removeIngredient(item)}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm p-4 rounded-xl flex items-center gap-3 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    {icons[item] || <ChefHat className="w-5 h-5 text-slate-600" />}
                  </div>
                  <span className="font-medium text-sm text-[#0F172A]">{item}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Ideas */}
        <div className="mb-12">
          <h3 className="font-bold text-lg text-[#0F172A] mb-4">Quick Ideas</h3>
          <div className="grid grid-cols-12 gap-4">
            <div
              className="col-span-12 md:col-span-8 h-48 rounded-2xl overflow-hidden relative cursor-pointer group"
              onClick={() => router.push("/recipe/1")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Top Match</span>
                <h4 className="text-white text-xl font-bold">Golden Egg & Spinach Rice</h4>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 h-48 rounded-2xl border-2 border-dashed border-[#0EA5E9]/30 flex flex-col justify-center items-center text-center p-6">
              <Plus className="w-8 h-8 text-[#0EA5E9] mb-2" />
              <p className="text-sm font-semibold text-[#475569]">Add 1 more item for 15+ more recipes</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-6 z-30">
        <Button
          size="lg"
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-lg font-bold shadow-xl shadow-[rgba(14,165,233,0.3)]"
          onClick={() => router.push("/ai-loading")}
        >
          <Sparkles className="w-5 h-5" />
          Generate Meal from Ingredients
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
