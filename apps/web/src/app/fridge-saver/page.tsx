"use client"

import { useState, useEffect } from "react"
import { Search, Bot, Plus, Egg, CookingPot, ChefHat, Sparkles, Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"
import { useFridgeSuggestions, useSaveFridge } from "@/hooks/useData"
import type { PriceInfo } from "@/lib/types"

const suggestedIngredients = ["Tomato", "Salmon", "Chicken", "Tofu", "Carrots", "Potato", "Eggs", "Rice", "Onions", "Spinach", "Garlic", "Chili"]

const ingredientIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  Eggs: { icon: <Egg className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
  Rice: { icon: <CookingPot className="w-5 h-5 text-slate-600" />, bg: "bg-slate-50" },
  Onions: { icon: <ChefHat className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
  Spinach: { icon: <span className="text-green-600 text-lg">🥬</span>, bg: "bg-green-50" },
}

export default function FridgeSaverPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [ingredients, setIngredients] = useState<string[]>(["Eggs", "Rice", "Onions", "Spinach"])

  const { data: suggestions, isLoading } = useFridgeSuggestions()
  const saveFridge = useSaveFridge()

  useEffect(() => {
    if (suggestions?.ingredients && suggestions.ingredients.length > 0) {
      setIngredients(suggestions.ingredients)
    }
  }, [suggestions])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ingredients.length > 0) {
        saveFridge.mutate(ingredients)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [ingredients])

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
    <div className="min-h-screen bg-background pb-28">
      <header className="w-full top-0 sticky z-40 bg-background flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5weTNOnKAx7tEuEst6bxNeKV9atAT4ObjiCzicqpN4VCY0r1XK9qbJvpYqRXf0eqe7myTE6rC-El1aQG_UtdVMYyvVgiESgNULNFwMXf4UTy2jX69LmlvabpBU1JBG6mwP3IY_6GXhCzIbJgZKAsGrihM1nKg2K6OEgqxNA8zPnoaOSIJpxDm6A_V1iMg5aZTFu3Xf95Oik1haxMkEkRp6TsY8BoCiL6JkH8HMK4VY8sHUOcgjhi_Og"
              alt=""
            />
          </div>
          <h1 className="text-primary tracking-tight font-bold text-2xl">EconoMeal</h1>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="px-6 pt-4">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
            What&apos;s in your fridge?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Save food and money. Add your ingredients and let AI suggest your next meal.
          </p>
        </div>

        <div className="relative w-full h-48 mb-8 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,109,54,0.05)] flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,109,54,0.2)] animate-pulse">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <span className="text-sm font-bold text-primary tracking-widest uppercase">
              {isLoading ? "Loading..." : "Smart Sensing Active"}
            </span>
          </div>
        </div>

        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            placeholder="Add ingredients (e.g. Tomato, Salmon...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 pl-12 pr-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/50 text-sm"
          />
          {search && filteredSuggestions.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-border p-2 z-10">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => addIngredient(item)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-primary" />
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-foreground">Your Ingredients</h3>
            <span className="text-sm text-primary font-medium">{ingredients.length} Items</span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {ingredients.map((item) => {
                const info = ingredientIcons[item] || { icon: <ChefHat className="w-5 h-5 text-slate-600" />, bg: "bg-gray-50" }
                const price = suggestions?.prices?.find((p: PriceInfo) => p.ingredient_name.toLowerCase() === item.toLowerCase())?.average_price
                return (
                  <div
                    key={item}
                    onClick={() => removeIngredient(item)}
                    className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm p-4 rounded-xl flex items-center gap-3 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${info.bg} rounded-lg flex items-center justify-center`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm text-foreground block">{item}</span>
                      {price != null && (
                        <span className="text-xs text-muted-foreground">Rp {price.toLocaleString("id-ID")}/kg</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mb-12">
          <h3 className="font-bold text-lg text-foreground mb-4">Quick Ideas</h3>
          <div className="grid grid-cols-12 gap-4">
            <div
              className="col-span-12 md:col-span-8 h-48 rounded-2xl overflow-hidden relative cursor-pointer group"
              onClick={() => router.push("/recommendation")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Top Match</span>
                <h4 className="text-white text-xl font-bold">Discover Recipes</h4>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 h-48 rounded-2xl border-2 border-dashed border-primary/30 bg-white/80 backdrop-blur-xl flex flex-col justify-center items-center text-center p-6">
              <Plus className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">Add more ingredients for more recipes</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 left-0 right-0 px-6 z-30">
        <button
          onClick={() => router.push("/ai-loading")}
          className="w-full bg-gradient-to-b from-[#4ADE80] to-[#006d36] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Generate Meal from Ingredients
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
