"use client"

import { useEffect } from "react"
import { X, Flame, Wheat, Beef, Droplets } from "lucide-react"
import type { RecipeDetail, BahanDetail } from "@/lib/types"

function toObject(v: unknown): Record<string, unknown> | null {
  if (typeof v === "object" && v && !Array.isArray(v)) return v as Record<string, unknown>
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return toObject(p) } catch { return null }
  }
  return null
}

function normalizeBahan(bahan_utama: unknown): BahanDetail[] {
  let arr: unknown[] = []
  if (Array.isArray(bahan_utama)) arr = bahan_utama
  else if (typeof bahan_utama === "string") {
    try { const p = JSON.parse(bahan_utama); if (Array.isArray(p)) arr = p } catch { return [] }
  }
  return arr.map((b: unknown) => {
    const obj = toObject(b) ?? (typeof b === "string" ? null : toObject(b))
    if (!obj && typeof b === "string") return { nama: b, berat: 0, satuan: "porsi", estimasi_harga: 0 }
    return {
      nama: String(obj?.nama ?? b ?? ""),
      berat: Number(obj?.berat) || 0,
      satuan: String(obj?.satuan ?? "gram"),
      estimasi_harga: Number(obj?.estimasi_harga) || 0,
    }
  })
}

type Props = {
  recipe: RecipeDetail | null
  onClose: () => void
}

export default function RecipeDetailSheet({ recipe, onClose }: Props) {
  useEffect(() => {
    if (!recipe) return
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [recipe])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  if (!recipe) return null

  const bahan = normalizeBahan(recipe.bahan_utama)
  const totalHarga = bahan.reduce((s: number, b: BahanDetail) => s + b.estimasi_harga, 0)
  const steps = recipe.cara_singkat
    ? recipe.cara_singkat.split(".").map((s: string) => s.trim()).filter((s: string) => s.length > 0 && !/^\d+$/.test(s)).map((s: string) => s + ".")
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-background rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col animate-slide-up">
        <div className="sticky top-0 bg-background/90 backdrop-blur-md z-10 flex items-center justify-between px-5 py-4 border-b border-surface-container-low">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{recipe.nama}</h2>
            {totalHarga > 0 && (
              <p className="text-xs text-on-surface-variant mt-0.5">
                Total estimasi: Rp {totalHarga.toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 ml-3 p-1.5 rounded-full hover:bg-surface-container-low active:scale-90 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 pb-12 space-y-5">
          <section>
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Bahan-Bahan
            </h3>
            <ul className="space-y-2">
              {bahan.map((b: BahanDetail, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span className="font-medium">{b.nama}</span>
                  {b.berat > 0 && (
                    <span className="text-on-surface-variant">
                      — {b.berat}{b.satuan === "gram" ? "g" : b.satuan}
                    </span>
                  )}
                  {b.estimasi_harga > 0 && (
                    <span className="ml-auto text-on-surface-variant">Rp {b.estimasi_harga.toLocaleString("id-ID")}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {recipe.alat && recipe.alat.length > 0 && (
            <section>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Alat Masak
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {recipe.alat.map((a: string, i: number) => (
                  <span key={i} className="text-xs bg-surface-container-low px-2.5 py-1 rounded-full text-on-surface-variant">
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Cara Membuat
            </h3>
            <div className="space-y-2.5">
              {steps.length > 0 ? (
                steps.map((step: string, i: number) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{step}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant italic">{recipe.cara_singkat}</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Informasi Nutrisi
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-surface-container-low rounded-xl p-2.5 text-center">
                <Flame className="w-4 h-4 text-primary mx-auto mb-0.5" />
                <p className="text-sm font-bold">{recipe.nutrisi.kalori}</p>
                <p className="text-[10px] text-on-surface-variant">Kalori</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-2.5 text-center">
                <Beef className="w-4 h-4 text-secondary mx-auto mb-0.5" />
                <p className="text-sm font-bold">{recipe.nutrisi.protein}g</p>
                <p className="text-[10px] text-on-surface-variant">Protein</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-2.5 text-center">
                <Wheat className="w-4 h-4 text-[#fd933d] mx-auto mb-0.5" />
                <p className="text-sm font-bold">{recipe.nutrisi.karbohidrat}g</p>
                <p className="text-[10px] text-on-surface-variant">Karbo</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-2.5 text-center">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-0.5" />
                <p className="text-sm font-bold">{recipe.nutrisi.lemak}g</p>
                <p className="text-[10px] text-on-surface-variant">Lemak</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  )
}
