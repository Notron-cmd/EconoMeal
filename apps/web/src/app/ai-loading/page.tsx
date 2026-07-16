"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Wallet, ChefHat, ShoppingBag } from "lucide-react"
import { BottomNav } from "@/components/shared/BottomNav"

const statusTexts = [
  "fetching grocery trends...",
  "calculating cost per meal...",
  "optimizing protein ratio...",
  "scanning local store discounts...",
  "tailoring flavor profiles...",
]

export default function AiLoadingPage() {
  const router = useRouter()
  const [statusIdx, setStatusIdx] = useState(0)
  const [marketCount, setMarketCount] = useState(0)
  const [loadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statusTexts.length)
    }, 2500)

    const countInterval = setInterval(() => {
      setMarketCount((prev) => (prev < 12 ? prev + 1 : prev))
    }, 300)

    const timer = setTimeout(() => {
      setLoadingComplete(true)
    }, 5000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(countInterval)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (loadingComplete) {
      router.push("/recommendation")
    }
  }, [loadingComplete, router])

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          {/* AI Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary-container blur-3xl opacity-20 rounded-full animate-pulse" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-card rounded-xl shadow-lg flex items-center justify-center overflow-hidden animate-bounce" style={{ animationDuration: "4s" }}>
              <Bot className="w-20 h-20 md:w-24 md:h-24 text-primary" />
              <div className="absolute inset-x-0 top-0 h-1 bg-primary/30 shadow-[0_0_15px_rgba(0,109,54,0.5)] animate-slide-down" />
            </div>
            <div className="absolute -top-4 -right-4 bg-secondary-container/20 p-2 rounded-lg shadow-sm border border-secondary/10 backdrop-blur-sm animate-bounce" style={{ animationDelay: "0.5s" }}>
              <Wallet className="w-4 h-4 text-secondary" />
            </div>
            <div className="absolute -bottom-2 -left-6 bg-primary-container/20 p-2 rounded-lg shadow-sm border border-primary/10 backdrop-blur-sm animate-bounce" style={{ animationDelay: "1.2s" }}>
              <ChefHat className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4 max-w-sm mb-8">
            <h1 className="text-[28px] font-bold text-on-surface md:leading-[34px] md:tracking-[-0.01em]">
              Analyzing your budget and nutrition...
            </h1>
            <p className="text-[15px] text-on-surface-variant leading-[22px]">
              Checking regional food prices and your fridge ingredients to find the perfect match.
            </p>
          </div>

          {/* Loading Bar */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-60 h-3 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-light to-primary rounded-full animate-progress" />
            </div>
            <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.05em] transition-opacity duration-300">
              {statusTexts[statusIdx]}
            </span>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-card p-4 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] border border-surface-variant/20">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-[12px] font-semibold text-on-surface-variant">Markets</span>
              </div>
              <p className="text-[20px] font-semibold text-primary">{marketCount}/12</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] border border-surface-variant/20">
              <div className="flex items-center gap-2 mb-1">
                <ChefHat className="w-4 h-4 text-secondary" />
                <span className="text-[12px] font-semibold text-on-surface-variant">Macros</span>
              </div>
              <p className="text-[20px] font-semibold text-secondary">Balancing</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
