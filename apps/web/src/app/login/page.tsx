"use client"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/financial-setup")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-5 py-8">
        <button
          onClick={() => router.back()}
          className="w-fit p-2 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-on-surface-variant" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-6">
            <Logo className="w-12 h-12" />
          </div>

          <h1 className="text-[28px] font-bold text-on-surface tracking-tight mb-1">
            Welcome Back
          </h1>
          <p className="text-[15px] text-on-surface-variant leading-[22px] mb-8 text-center">
            Sign in to continue your healthy, budget-friendly journey.
          </p>

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-[0.05em] px-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="hello@student.edu"
                value={form.email}
                onChange={handleChange("email")}
                required
                className="w-full h-[56px] px-5 rounded-xl bg-surface-container-low border-none ring-1 ring-inset ring-outline-variant focus:ring-2 focus:ring-primary text-[17px] transition-all placeholder:text-outline outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-[0.05em] px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                  className="w-full h-[56px] px-5 pr-14 rounded-xl bg-surface-container-low border-none ring-1 ring-inset ring-outline-variant focus:ring-2 focus:ring-primary text-[17px] transition-all placeholder:text-outline outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-[17px] font-bold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <p className="mt-6 text-[15px] text-on-surface-variant">
            New to EconoMeal?{" "}
            <button
              onClick={() => router.push("/onboarding")}
              className="text-primary font-semibold hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
