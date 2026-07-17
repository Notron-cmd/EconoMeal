"use client"

import { useState } from "react"
import { Banknote, Loader2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function FinancialSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [budget, setBudget] = useState("")

  const formatRupiah = (value: string) => {
    const digits = value.replace(/\D/g, "")
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseRupiah = (value: string) => value.replace(/\./g, "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "")
    setBudget(formatRupiah(digits))
  }

  const handleSave = async () => {
    const amount = Number(parseRupiah(budget))
    if (!amount || amount <= 0) return
    setLoading(true)
    setError("")
    try {
      await api.post("/api/finances", { anggaran_makan: amount })
      router.push("/preferences")
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-md mx-auto px-5 py-8">
        <main className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-on-surface tracking-tight mb-2">
              Anggaran Makan Bulanan
            </h1>
            <p className="text-[15px] text-on-surface-variant leading-[22px]">
              Masukkan total budget untuk makanan kamu setiap bulan. Kami akan hitung budget harian dan rekomendasikan resep yang pas.
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6 space-y-4 mb-6">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant text-center uppercase">
              Budget Makan Per Bulan
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-primary">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={budget}
                onChange={handleChange}
                className="bg-transparent border-none text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-foreground focus:ring-0 w-48 text-center placeholder:opacity-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            {budget && (
              <p className="text-center text-sm text-on-surface-variant">
                Budget harian: Rp {Math.floor(Number(parseRupiah(budget)) / 30 / 1000) * 1000}{" "}
                <span className="text-xs opacity-60">({Math.floor(Number(parseRupiah(budget)) / 30 / 1000) * 1000} x 30)</span>
              </p>
            )}
          </div>

          {error && (
            <p className="text-destructive text-[13px] text-center mb-3">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={loading || !budget}
            className="w-full h-14 bg-gradient-to-b from-[#4ADE80] to-[#006d36] text-white rounded-full text-lg font-semibold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Lanjut ke Preferensi</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="w-28 h-28 relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
            <div className="absolute inset-0 rounded-full border-[3px] border-surface-container-highest" />
            <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center animate-bounce">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2 text-center animate-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-lg font-semibold text-on-surface">Menyimpan budget</h2>
          </div>
        </div>
      )}
    </div>
  )
}
