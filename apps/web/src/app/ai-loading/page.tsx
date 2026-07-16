"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Wallet, Utensils, ShoppingBag, Apple, Bell } from "lucide-react"
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
    }, 3500)

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
    <>
      <style jsx>{`
        @keyframes soft-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); width: 20%; }
          50% { transform: translateX(50%); width: 50%; }
          100% { transform: translateX(300%); width: 20%; }
        }
        .animate-soft-pulse { animation: soft-pulse 3s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-progress-bar { animation: progress 2s ease-in-out infinite; }
        .mesh-gradient {
          background-color: #f3fcf0;
          background-image:
            radial-gradient(at 0% 0%, hsla(142, 72%, 90%, 1) 0px, transparent 50%),
            radial-gradient(at 100% 0%, hsla(32, 100%, 95%, 1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, hsla(142, 72%, 90%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(32, 100%, 95%, 1) 0px, transparent 50%);
        }
      `}</style>

      <div className="min-h-screen pb-20 mesh-gradient">
        {/* Header */}
        <header className="w-full top-0 sticky flex items-center justify-between px-5 py-4 bg-background z-50">
          <div className="flex items-center gap-2">
            <span className="text-[28px] font-bold text-primary tracking-tight">EconoMeal</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-primary hover:opacity-80 transition-opacity cursor-pointer" />
            <div className="w-10 h-10 rounded-full bg-primary-container/30 border-2 border-primary overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="User avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhyzMJTPyDQOZldCoSBxzV484sQDfNO0O_ekngga7rceeNl_O2dpWVu8SLIMc_-4FcjiCAKa1eVD2QsqlogZ0S-CVkRd4woQPQlEw7oZ6vx7u6f5WxEKhEOLcdePvy3bNkvG4Y0fw50DHc4_1fxvNBZ1yDvjVQ_wHR3QiomNoHtMUUwBbwFfLm0VPvn4wwUaUKbNKyFocsNhE-XiNXvp01p0RCBOZa9o-d0Ubwxy5KbeVhhcOw19Qjyg"
              />
            </div>
          </div>
        </header>

        {/* Main Loading Content */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-5 text-center">
          {/* AI Brain/Robot Section */}
          <div className="relative mb-6">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary-container blur-3xl opacity-20 rounded-full animate-soft-pulse" />
            {/* Icon Container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-surface-container-lowest rounded-xl shadow-lg flex items-center justify-center overflow-hidden animate-float">
              <Bot className="w-20 h-20 md:w-24 md:h-24 text-primary" />
              {/* Scanning Effect */}
              <div className="absolute inset-x-0 top-0 h-1 bg-primary/30 shadow-[0_0_15px_rgba(0,109,54,0.5)] animate-[scan_2s_linear_infinite]" />
            </div>
            {/* Floating Data Points */}
            <div className="absolute -top-4 -right-4 bg-secondary-container/20 p-2 rounded-lg shadow-sm border border-secondary/10 backdrop-blur-sm animate-bounce" style={{ animationDelay: "0.5s" }}>
              <Wallet className="w-4 h-4 text-secondary" />
            </div>
            <div className="absolute -bottom-2 -left-6 bg-primary-container/20 p-2 rounded-lg shadow-sm border border-primary/10 backdrop-blur-sm animate-bounce" style={{ animationDelay: "1.2s" }}>
              <Utensils className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Text Messages */}
          <div className="space-y-4 max-w-sm mb-8">
            <h1 className="text-[28px] font-bold text-on-surface leading-[34px] tracking-[-0.01em]">
              Analyzing your budget and nutrition...
            </h1>
            <p className="text-[17px] text-on-surface-variant leading-relaxed opacity-80">
              Checking regional food prices and your fridge ingredients to find the perfect match.
            </p>
          </div>

          {/* Custom Progress Bar */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-[240px] h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-full animate-progress-bar" />
            </div>
            <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.05em] transition-opacity duration-300">
              {statusTexts[statusIdx]}
            </span>
          </div>

          {/* Subtle Info Cards (Bento style) */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-surface-container-lowest p-4 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] border border-surface-variant/20">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-[12px] font-semibold text-on-surface-variant">Markets</span>
              </div>
              <p className="text-[20px] font-semibold text-primary">{marketCount}/12</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] border border-surface-variant/20">
              <div className="flex items-center gap-2 mb-1">
                <Apple className="w-4 h-4 text-secondary" />
                <span className="text-[12px] font-semibold text-on-surface-variant">Macros</span>
              </div>
              <p className="text-[20px] font-semibold text-secondary">Balancing</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
