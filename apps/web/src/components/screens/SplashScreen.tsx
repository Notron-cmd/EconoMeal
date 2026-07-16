"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"

export default function SplashScreen() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8 text-center">
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 animate-pulse" />
            <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />
            <Logo className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
          </div>
        </div>

        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h1 className="text-[28px] leading-[34px] md:text-[32px] md:leading-[40px] font-bold text-primary tracking-tight mb-1">
            NutriKos
          </h1>
          <p className="text-[20px] leading-[28px] font-medium text-on-surface-variant opacity-90">
            Eat Smart. Save More.
          </p>
        </div>

        <div
          className="w-full max-w-sm bg-white/40 backdrop-blur-xl p-6 rounded-xl shadow-lg mb-8 animate-fade-in animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="relative h-48 w-full rounded-md overflow-hidden bg-surface-container-low mb-4">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAq-biY-jXSOahSmHjJHE3aL0mmGgz2PXOT4orH4hjZxb1YCMeL9QLMrolwFvEh3ds7W-fjn93uYg7aLI9JoUqTVD7eTsxal42cocZfUTZ5_k39cYRUrqexpTq1fzLsxNfLl0t1KTyy7IlW6RaqCKS9ZHCzMt5Hcku9SVAXx0mqzAX3zNmEdqEPizwmxhyc1mnsC2d5uJWFgd3DTqQtS4iRwa6QE8mZ7ugvNXhAq0rn6IhCJf6n011OyQ')",
              }}
            />
          </div>
          <p className="text-on-surface-variant text-[15px] leading-[22px] px-2">
            Fuel your studies without breaking the bank. Personalized recipes and
            budget tracking at your fingertips.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-4 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <Button
            size="default"
            className="w-full font-bold text-[17px] shadow-lg active:scale-95"
            onClick={() => router.push("/onboarding")}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-[12px] leading-[16px] font-semibold text-on-surface-variant uppercase tracking-widest opacity-60">
            Join 5,000+ students today
          </p>
        </div>
      </main>
    </div>
  )
}
