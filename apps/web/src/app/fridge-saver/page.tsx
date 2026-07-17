"use client"

import { useState, useEffect } from "react"
import { Search, Bot, Bell, Sparkles, Loader2, Check, X, Flame, Wheat, Beef, Droplets } from "lucide-react"
import { BottomNav } from "@/components/shared/BottomNav"
import RecipeDetailSheet from "@/components/shared/RecipeDetailSheet"
import { api } from "@/lib/api"
import { ingredients } from "@/lib/ingredients"
import type { AiRecommendation, AiMenu } from "@/lib/types"

const STORAGE_KEY = "fridge-saver-state"

type SavedState = {
  selected: string[]
  result: AiRecommendation | null
}

function loadState(): SavedState {
  if (typeof window === "undefined") return { selected: [], result: null }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { selected: [], result: null }
}

function saveState(state: SavedState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

export default function FridgeSaverPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>(loadState().selected)
  const [result, setResult] = useState<AiRecommendation | null>(loadState().result)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [detailMenu, setDetailMenu] = useState<AiMenu | null>(null)

  useEffect(() => {
    saveState({ selected, result })
  }, [selected, result])

  const filtered = ingredients.filter(
    (i) => i.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (nama: string) => {
    setSelected((p) => p.includes(nama) ? p.filter((n) => n !== nama) : [...p, nama])
    setSearch("")
  }

  const handleGenerate = async () => {
    if (selected.length === 0) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await api.post<AiRecommendation>("/api/ai/recommend", { ingredients: selected })
      setResult(res)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="w-full top-0 sticky z-40 bg-background flex items-center justify-between px-5 py-4">
        <h1 className="text-[28px] font-bold tracking-tight text-primary">Fridge Saver</h1>
        <Bell className="w-6 h-6 text-on-surface-variant" />
      </header>

      <main className="px-5 max-w-lg mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Apa isi kulkasmu?</h2>
          <p className="text-sm text-on-surface-variant">
            Cari bahan yang tersedia, klik untuk memilih. AI akan menyarankan menu dari bahan tersebut.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari bahan (misal: ayam, tahu, bayam...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
          {search && filtered.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-border p-2 z-10 max-h-60 overflow-y-auto">
              {filtered.map((item) => {
                const isSel = selected.includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between gap-2 hover:bg-muted ${
                      isSel ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isSel ? <Check className="w-4 h-4 text-primary shrink-0" /> : <X className="w-4 h-4 text-transparent shrink-0" />}
                      <span className="font-medium truncate">{item}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Bahan Dipilih</h3>
              <span className="text-xs text-primary font-medium">{selected.length} item</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.map((item) => (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                >
                  {item}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {selected.length > 0 && !result && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-b from-[#4ADE80] to-[#006d36] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Menyusun resep...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Meal from Ingredients</>
            )}
          </button>
        )}

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        {result && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Rekomendasi Menu</h3>

            {result.menu.map((menu, i) => (
              <div
                key={i}
                onClick={() => setDetailMenu(menu)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 cursor-pointer active:scale-[0.98] transition-all"
              >
                <h4 className="text-base font-bold mb-2">{menu.nama}</h4>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {menu.bahan_utama.map((b, j) => (
                    <span key={j} className="text-[11px] bg-surface-container-low px-2 py-0.5 rounded-full text-on-surface-variant">
                      {b.nama} {b.berat}{b.satuan === "gram" ? "g" : b.satuan}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 shrink-0" />{menu.nutrisi.kalori} kkal</span>
                  <span className="flex items-center gap-1"><Beef className="w-3 h-3 shrink-0" />{menu.nutrisi.protein}g P</span>
                  <span className="flex items-center gap-1"><Wheat className="w-3 h-3 shrink-0" />{menu.nutrisi.karbohidrat}g K</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3 shrink-0" />{menu.nutrisi.lemak}g L</span>
                </div>
              </div>
            ))}


          </div>
        )}

        {!result && selected.length === 0 && !search && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold mb-1">Belum ada bahan dipilih</p>
            <p className="text-sm text-on-surface-variant max-w-xs">
              Ketik nama bahan di atas, klik untuk menambahkan, lalu tekan Generate.
            </p>
          </div>
        )}
      </main>

      <RecipeDetailSheet recipe={detailMenu} onClose={() => setDetailMenu(null)} />

      <BottomNav />
    </div>
  )
}
