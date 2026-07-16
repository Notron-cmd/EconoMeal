"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"

const slides = [
  {
    title: "Your Pocket Financial &\nNutrition Advisor",
    subtitle:
      "NutriKos uses AI to plan your meals around your student budget.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAq-biY-jXSOahSmHjJHE3aL0mmGgz2PXOT4orH4hjZxb1YCMeL9QLMrolwFvEh3ds7W-fjn93uYg7aLI9JoUqTVD7eTsxal42cocZfUTZ5_k39cYRUrqexpTq1fzLsxNfLl0t1KTyy7IlW6RaqCKS9ZHCzMt5Hcku9SVAXx0mqzAX3zNmEdqEPizwmxhyc1mnsC2d5uJWFgd3DTqQtS4iRwa6QE8mZ7ugvNXhAq0rn6IhCJf6n011OyQ",
    badges: ["BUDGET SAVED", "HEALTHY CHOICE"],
  },
  {
    title: "Eat Well, Stay Fit",
    subtitle:
      "Get personalized meal plans that meet your nutritional needs without breaking the bank.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    badges: ["VIBRANT - 100% Fresh", "BUDGET - Under $5.00", "450 kcal"],
  },
  {
    title: "Save While You Eat",
    subtitle:
      "University life is expensive. NutriKos helps you reach your savings goals through smarter food choices.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    badges: ["SAVED $120.40"],
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
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <Logo className="w-10 h-10" />
          {!isLast && (
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-semibold text-on-surface-variant"
            >
              SKIP
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative w-64 h-48 mb-8">
            <div
              className="w-full h-full rounded-[1.5rem] bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute -right-2 -top-2 flex flex-col gap-1">
              {slide.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/90 shadow-sm text-on-surface whitespace-nowrap"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <h2 className="text-[28px] font-bold text-on-surface tracking-tight mb-2 md:leading-[34px] md:tracking-[-0.01em] whitespace-pre-line">
            {slide.title}
          </h2>
          <p className="text-[15px] text-on-surface-variant leading-[22px] max-w-xs mb-8">
            {slide.subtitle}
          </p>

          <div className="flex gap-2 mb-8">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-on-surface-variant/25 ring-1 ring-inset ring-on-surface-variant/10"
                }`}
              />
            ))}
          </div>

          <Button
            size="lg"
            className="w-full max-w-xs text-[17px] font-bold"
            onClick={handleNext}
          >
            {isLast ? "Get Started" : "Next"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
