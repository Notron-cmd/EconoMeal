"use client"

import { useState } from "react"
import { ArrowLeft, Flame, Loader2, Trash2, BookHeart, Wheat, Beef, Droplets } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"
import RecipeDetailSheet from "@/components/shared/RecipeDetailSheet"
import { useSavedRecipes } from "@/hooks/useData"
import type { SavedRecipe } from "@/lib/types"

function toObject(v: unknown): Record<string, unknown> | null {
  if (typeof v === "object" && v && !Array.isArray(v)) return v as Record<string, unknown>
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return toObject(p) } catch { return null }
  }
  return null
}

function getBahanList(bahan_utama: unknown): unknown[] {
  if (Array.isArray(bahan_utama)) return bahan_utama
  if (typeof bahan_utama === "string") {
    try { const p = JSON.parse(bahan_utama); if (Array.isArray(p)) return p } catch { return [] }
  }
  return []
}

function normalizeBahanPreview(b: unknown): string {
  const obj = toObject(b)
  if (obj) {
    const nama = String(obj.nama ?? "")
    const berat = Number(obj.berat) || 0
    const satuan = String(obj.satuan ?? "gram")
    return berat > 0 ? `${nama} ${berat}${satuan === "gram" ? "g" : satuan}` : nama
  }
  return String(b ?? "")
}

export default function SavedRecipesPage() {
  const router = useRouter()
  const { data: recipes, isLoading } = useSavedRecipes()
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null)

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
          <BookHeart className="w-6 h-6" />
        </button>
      </header>

      <main className="px-5 max-w-lg mx-auto space-y-4 pt-2">
        <p className="text-[15px] leading-[22px] text-muted-foreground">
          Menu favorit dari rekomendasi AI (maks. 5).
        </p>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (!recipes || recipes.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <BookHeart className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-semibold mb-1">Belum ada resep</p>
            <p className="text-sm text-on-surface-variant">
              Gunakan AI Scan untuk mendapatkan rekomendasi menu, lalu simpan ke sini.
            </p>
          </div>
        )}

        {recipes?.map((recipe: SavedRecipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden flex flex-col active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[20px] leading-[28px] font-semibold text-foreground flex-1">{recipe.nama}</h2>
                <button
                  onClick={(e) => { e.stopPropagation(); /* TODO: delete */ }}
                  className="text-destructive/60 hover:text-destructive p-1 -mr-1 -mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getBahanList(recipe.bahan_utama).map((b: unknown, j: number) => (
                  <span key={j} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    {normalizeBahanPreview(b)}
                  </span>
                ))}
              </div>
              {recipe.nutrisi && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-primary" /> {recipe.nutrisi.kalori} kkal
                  </span>
                  <span className="flex items-center gap-1">
                    <Beef className="w-4 h-4 text-secondary" /> {recipe.nutrisi.protein}g P
                  </span>
                  <span className="flex items-center gap-1">
                    <Wheat className="w-4 h-4 text-[#fd933d]" /> {recipe.nutrisi.karbohidrat}g K
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-blue-500" /> {recipe.nutrisi.lemak}g L
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      <RecipeDetailSheet recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      <BottomNav />
    </div>
  )
}
