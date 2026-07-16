"use client"

import { useState } from "react"
import { ArrowRight, Wallet, UtensilsCrossed, Leaf, PiggyBank, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Your Pocket Financial &\nNutrition Advisor",
    subtitle:
      "EconoMeal uses AI to plan your meals around your student budget.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjVN0804vtZNzzunta_UPEwaaH1XrTM_Bim3z7NWgIAREPdbR-jxBPe6UDRjm3aAQBbC6uueELV_hCnFYIswKr0UxrRJm4gXyfxeE63Ea5dOEUdzPCpeANok4Ut7TRm7K0fwjkShVGE53lPE4JEHHa2V-kG-s8hNMxDdWwM6xNp3jJjMGJuPqpiYGi2_M9dgu1W05SAU9saQQpCYJkgNo2XG4vPTc0e79GLp60buMoVgT2VdX5ucYykw",
  },
  {
    title: "Eat Well, Stay Fit",
    subtitle:
      "Get personalized meal plans that meet your nutritional needs without breaking the bank.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPLWyWV6NQzW5mOrBOa7yTKFUguMNLrThUn2T_l-X0o0tj_X3NJu4ATGoDATldt-VeTW1hUy1805VdCw1L-BQ800usVshA_MFSkyTWWTkmUhKdEEFeZsBAj_uauqGyaygvXpA36CqUQ4DvA7HmawovkEL53ZL_kUe6X384mZ3uJEXndV-603dKYicfAYWRdaMu0fKssxnm5tezUCwQyQ_UqJDz1E9AXU5Qx23nQQjzaa3Tln2LF4c6Og",
  },
  {
    title: "Save While You Eat",
    subtitle:
      "University life is expensive. EconoMeal helps you reach your savings goals through smarter food choices.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoqhHtBpnJ74cpfXEH2Ytm0WfF9htCCYNq9cP9MuP6y1yV08o3ozFUOFYDNZt7VViTWGTqpmyYmSd-lNYyl-lh-IiDfcTB-3JPiqJrBHgnsDMiuPUw3N4jpqwqn0xCNOq-utfcE50E_-gqV_MS0vDiZCfIQsz4nZYeBv-bCf10NjBKr7rfURAsPEbM7Au1RhJR2tWArYdajnE5xyEdWKiLGpsk78MhIVu0RpiRiFLZXv8AqcLYPVJx0g",
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const slide = slides[step]
  const isLast = step === slides.length - 1

  const handleNext = () => {
    if (isLast) {
      router.push("/login")
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatShort {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-6">
        <header
          className={`flex items-center ${isLast ? "justify-center" : "justify-between"} mb-4`}
        >
          <span className="text-[28px] font-bold text-primary tracking-tight leading-[34px]">
            EconoMeal
          </span>
          {!isLast && (
            <button
              onClick={() => router.push("/login")}
              className="text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95"
            >
              SKIP
            </button>
          )}
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center">
          {step === 0 && (
            <div className="relative w-full aspect-square mb-8 flex items-center justify-center">
              <div className="absolute w-64 h-64 bg-primary-container/30 rounded-full blur-3xl opacity-50" />
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div
                  className="relative w-72 h-72 rounded-xl bg-white shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden flex items-center justify-center p-4 border-4 border-white"
                  style={{ animation: "float 6s ease-in-out infinite" }}
                >
                  <img
                    className="w-full h-full object-contain"
                    src={slide.image}
                    alt=""
                  />
                </div>
                <div
                  className="absolute top-10 right-4 bg-white/70 backdrop-blur-md px-3 py-2 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex items-center gap-2 animate-pulse"
                  style={{ animationDuration: "4s" }}
                >
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-[12px] font-semibold tracking-[0.05em] text-on-surface">
                    BUDGET SAVED
                  </span>
                </div>
                <div
                  className="absolute bottom-12 left-4 bg-white/70 backdrop-blur-md px-3 py-2 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex items-center gap-2"
                  style={{
                    animation: "floatShort 6s ease-in-out infinite",
                    animationDelay: "-1s",
                  }}
                >
                  <UtensilsCrossed className="w-4 h-4 text-secondary" />
                  <span className="text-[12px] font-semibold tracking-[0.05em] text-on-surface">
                    HEALTHY CHOICE
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="relative w-full aspect-square flex items-center justify-center mb-8">
              <div className="absolute w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10" />
              <div className="absolute top-10 right-10 w-24 h-24 bg-tertiary-container/30 rounded-full blur-2xl -z-10" />
              <div
                className="relative z-0 w-72 h-72 rounded-full overflow-hidden shadow-[0px_10px_30px_rgba(28,25,23,0.04)] border-4 border-white"
                style={{ animation: "floatShort 6s ease-in-out infinite" }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={slide.image}
                  alt=""
                />
              </div>
              <div
                className="absolute top-[10%] left-[5%] bg-white p-4 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex items-center gap-3"
                style={{
                  animation: "floatShort 6s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              >
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-on-primary-container" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant">
                    VIBRANT
                  </p>
                  <p className="text-[15px] font-bold text-on-surface">
                    100% Fresh
                  </p>
                </div>
              </div>
              <div
                className="absolute bottom-[20%] right-[2%] bg-white p-4 rounded-lg shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex items-center gap-3"
                style={{
                  animation: "floatShort 6s ease-in-out infinite",
                  animationDelay: "2s",
                }}
              >
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant">
                    BUDGET
                  </p>
                  <p className="text-[15px] font-bold text-on-surface">
                    Under $5.00
                  </p>
                </div>
              </div>
              <div
                className="absolute top-[45%] right-[-10px] bg-white p-2 rounded-full shadow-[0px_10px_30px_rgba(28,25,23,0.04)]"
                style={{
                  animation: "floatShort 6s ease-in-out infinite",
                  animationDelay: "0.5s",
                }}
              >
                <div className="flex items-center gap-1 px-3 py-1">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-[15px] font-bold text-on-surface">
                    450 kcal
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="relative w-full aspect-square flex items-center justify-center mb-8">
              <div className="absolute w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10 animate-pulse" />
              <div className="absolute w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl top-0 right-0 -z-10" />
              <div className="relative w-full h-full rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] bg-white overflow-hidden flex flex-col items-center justify-center">
                <div className="w-full h-full flex flex-col">
                  <div className="flex-grow w-full relative">
                    <img
                      className="w-full h-full object-contain p-6"
                      src={slide.image}
                      alt=""
                    />
                  </div>
                  <div className="absolute top-6 right-6 bg-white shadow-[0px_10px_30px_rgba(28,25,23,0.04)] px-4 py-2 rounded-lg flex items-center gap-1 border border-surface-container">
                    <Wallet className="w-4 h-4 text-secondary" />
                    <span className="text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant">
                      SAVED $120.40
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-[28px] font-bold text-on-surface tracking-tight leading-[34px] whitespace-pre-line mb-2">
            {step === 0 ? (
              <>
                Your Pocket Financial &<br />
                <span className="text-primary">Nutrition Advisor</span>
              </>
            ) : (
              slide.title
            )}
          </h2>
          <p className="text-[17px] text-on-surface-variant leading-relaxed max-w-xs mb-8">
            {slide.subtitle}
          </p>

          <div className="flex gap-2 mb-8">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-on-surface-variant/40 ring-1 ring-inset ring-on-surface-variant/20"
                }`}
              />
            ))}
          </div>

          <Button
            size="lg"
            className="w-full max-w-xs text-[17px] font-bold bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white border-0 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all duration-200 h-14 rounded-full flex items-center justify-center group"
            onClick={handleNext}
          >
            <span>{isLast ? "Get Started" : "Next"}</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {isLast && (
            <button className="mt-6 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant hover:text-primary transition-colors">
              VIEW OUR BUDGET PROMISE
            </button>
          )}
        </main>
      </div>
    </div>
  )
}
