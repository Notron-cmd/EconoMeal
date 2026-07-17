"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Bot, Bell, Check, Flame, Wheat, Beef, Sparkles, Droplets, AlertCircle } from "lucide-react"
import { BottomNav } from "@/components/shared/BottomNav"
import { api } from "@/lib/api"
import type { AiRecommendation, AiMenu } from "@/lib/types"

const statusList = [
  { text: "mencari tren bahan pangan...", icon: Sparkles },
  { text: "menghitung biaya per menu...", icon: Sparkles },
  { text: "menyeimbangkan nutrisi...", icon: Flame },
  { text: "menyesuaikan dengan budget...", icon: Sparkles },
  { text: "meracik rekomendasi...", icon: Bot },
]

function computeNutrisi(menus: AiMenu[]) {
  return menus.reduce(
    (s, m) => ({
      kalori: s.kalori + m.nutrisi.kalori,
      protein: s.protein + m.nutrisi.protein,
      karbohidrat: s.karbohidrat + m.nutrisi.karbohidrat,
      lemak: s.lemak + m.nutrisi.lemak,
    }),
    { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0 }
  )
}

export default function AiLoadingPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [statusIdx, setStatusIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [result, setResult] = useState<AiRecommendation | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState("")
  const savedRef = useRef(false)

  const selMenus = result?.menu.filter((m) => selected.includes(m.nama)) ?? []
  const totalNutrisi = computeNutrisi(selMenus)

  const doSave = useCallback(async () => {
    if (selMenus.length === 0) return
    setSaving(true)
    setSaveErr("")
    try {
      const results = await Promise.allSettled([
        api.post("/api/nutrition/save", totalNutrisi).then(() => qc.invalidateQueries({ queryKey: ["daily-nutrition"] })),
        api.post("/api/recipes/saved", { menu: selMenus }).then(() => qc.invalidateQueries({ queryKey: ["saved-recipes"] })),
      ])
      const errors = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[]
      if (errors.length > 0) {
        setSaveErr(errors.map((e) => (e.reason as Error).message).join("; "))
        return
      }
      savedRef.current = true
      router.push("/dashboard")
    } catch (e) {
      setSaveErr((e as Error).message)
    } finally {
      setSaving(false)
    }
  }, [selMenus, totalNutrisi, router, qc])

  useEffect(() => {
    const si = setInterval(() => setStatusIdx((p) => (p + 1) % statusList.length), 2000)
    const pi = setInterval(() => setProgress((p) => Math.min(p + 2 + Math.random() * 4, 92)), 400)

    api.post<AiRecommendation>("/api/ai/recommend")
      .then((res) => { setProgress(100); setResult(res); setLoading(false) })
      .catch((err) => { setError((err as Error).message); setLoading(false) })

    return () => { clearInterval(si); clearInterval(pi) }
  }, [])

  const toggle = (nama: string) => {
    setSelected((p) => p.includes(nama) ? p.filter((n) => n !== nama) : [...p, nama])
  }

  if (loading) {
    const StatusIcon = statusList[statusIdx].icon
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background pb-20">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-5">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-30 rounded-full animate-pulse" />
            <div className="relative w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
              <Bot className="w-20 h-20 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Menyusun Rekomendasi</h1>
          <p className="text-sm text-on-surface-variant text-center mb-8 max-w-xs">
            Menganalisis budget, nutrisi, dan bahan pangan regional.
          </p>
          <div className="w-48 h-2 bg-surface-container-high rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <StatusIcon className="w-4 h-4" />
            <span>{statusList[statusIdx].text}</span>
          </div>
        </div>
        <BottomNav onDashboard={() => router.push("/dashboard")} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 pb-20">
        <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
          <Bot className="w-10 h-10 text-destructive" />
        </div>
        <p className="text-destructive text-center mb-2 font-semibold">Gagal memuat rekomendasi</p>
        <p className="text-sm text-on-surface-variant text-center mb-6 max-w-xs">{error}</p>
        <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
          Kembali ke Dashboard
        </button>
        <BottomNav onDashboard={() => router.push("/dashboard")} />
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <main className="px-5 max-w-lg mx-auto space-y-5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">Pilih Menu</h2>
          <span className="text-sm text-on-surface-variant">{selected.length}/2 dipilih</span>
        </div>

        <section className="space-y-3">
          {result.menu.map((menu, i) => {
            const isSel = selected.includes(menu.nama)
            const disabled = selected.length >= 2 && !isSel
            return (
              <button
                key={i}
                onClick={() => !disabled && toggle(menu.nama)}
                disabled={disabled}
                className={`w-full text-left bg-white rounded-2xl p-4 border-2 transition-all active:scale-[0.98] ${
                  isSel ? "border-primary shadow-[0_0_0_1px_#006d36] shadow-lg" : "border-transparent shadow-sm"
                } ${disabled ? "opacity-40" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Menu {i + 1}
                      </span>
                      {isSel && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                    <h3 className="text-base font-bold leading-tight">{menu.nama}</h3>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1.5 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 shrink-0" />{menu.nutrisi.kalori} kkal</span>
                      <span className="flex items-center gap-1"><Beef className="w-3 h-3 shrink-0" />{menu.nutrisi.protein}g P</span>
                      <span className="flex items-center gap-1"><Wheat className="w-3 h-3 shrink-0" />{menu.nutrisi.karbohidrat}g K</span>
                      <span className="flex items-center gap-1"><Droplets className="w-3 h-3 shrink-0" />{menu.nutrisi.lemak}g L</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {menu.bahan_utama.map((b, j) => (
                    <span key={j} className="text-[11px] bg-surface-container-low px-2 py-0.5 rounded-full text-on-surface-variant">
                      {b.nama} {b.berat}{b.satuan === "gram" ? "g" : b.satuan}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </section>

        {selected.length > 0 && (
          <section className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Ringkasan Nutrisi {selected.length} Menu
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-surface-container-low rounded-xl p-3 text-center">
                <Flame className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-sm font-bold">{totalNutrisi.kalori}</p>
                <p className="text-[10px] text-on-surface-variant">Kalori</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-center">
                <Beef className="w-4 h-4 text-secondary mx-auto mb-1" />
                <p className="text-sm font-bold">{totalNutrisi.protein}g</p>
                <p className="text-[10px] text-on-surface-variant">Protein</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-center">
                <Wheat className="w-4 h-4 text-[#fd933d] mx-auto mb-1" />
                <p className="text-sm font-bold">{totalNutrisi.karbohidrat}g</p>
                <p className="text-[10px] text-on-surface-variant">Karbo</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-center">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="text-sm font-bold">{totalNutrisi.lemak}g</p>
                <p className="text-[10px] text-on-surface-variant">Lemak</p>
              </div>
            </div>

            {saveErr && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{saveErr}</span>
              </div>
            )}

            <button
              onClick={doSave}
              disabled={saving}
              className="w-full bg-primary text-white rounded-2xl py-4 font-bold text-lg active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              {saving ? "Menyimpan..." : savedRef.current ? "Lihat Dashboard" : "Simpan & ke Dashboard"}
            </button>
          </section>
        )}
      </main>

      <BottomNav onDashboard={doSave} />
    </div>
  )
}

function Header() {
  return (
    <header className="w-full top-0 sticky bg-background/80 backdrop-blur-lg flex items-center justify-between px-5 py-4 z-40">
      <span className="text-[28px] font-bold tracking-tight">
        <span className="text-[#fd933d]">Econo</span><span className="text-primary">Meal</span>
      </span>
      <Bell className="w-6 h-6 text-on-surface-variant" />
    </header>
  )
}
