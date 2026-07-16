"use client"

import { ArrowLeft, Clock, Users, Heart, Flame, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"
import { useRecipes } from "@/hooks/useData"
import type { Recipe } from "@/lib/types"

export default function RecommendationPage() {
  const router = useRouter()
  const { data: recipes, isLoading } = useRecipes()

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <header className="w-full top-0 sticky bg-background flex items-center justify-between px-5 py-4 z-40">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:opacity-80 transition-opacity active:scale-95" onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[28px] leading-[34px] font-bold tracking-tight text-primary">Recipes</h1>
        </div>
        <button className="text-muted-foreground hover:opacity-80 transition-opacity active:scale-95">
          <Heart className="w-6 h-6" />
        </button>
      </header>

      <main className="px-5 max-w-lg mx-auto space-y-4 pt-2">
        <p className="text-[15px] leading-[22px] text-muted-foreground">
          Smart meal ideas based on your budget and fridge contents.
        </p>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {recipes?.map((recipe: Recipe) => {
          const tags = recipe.meal_type ? [recipe.meal_type] : []
          if (recipe.dietary_tags) tags.push(...recipe.dietary_tags)

          return (
            <div
              key={recipe.id}
              onClick={() => router.push(`/recommendation/${recipe.id}`)}
              className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden flex flex-col active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${recipe.image_url ?? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"})` }}>
                <div className="absolute top-3 left-3 flex gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-white/90 backdrop-blur-sm text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <h2 className="text-[20px] leading-[28px] font-semibold text-foreground">{recipe.name}</h2>
                <p className="text-[15px] leading-[22px] text-muted-foreground">{recipe.description}</p>
                {recipe.nutrition && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {recipe.nutrition.calories && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-secondary" /> {recipe.nutrition.calories} cal
                      </span>
                    )}
                    {recipe.nutrition.protein && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-secondary" /> {recipe.nutrition.protein}g protein
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {recipe.cooking_time_minutes && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" /> {recipe.cooking_time_minutes}m
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-4 h-4" /> {recipe.servings} servings
                    </span>
                  </div>
                  {recipe.cost_estimate != null && (
                    <span className="text-xl font-semibold text-primary">
                      Rp {recipe.cost_estimate.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </main>

      <BottomNav />
    </div>
  )
}
