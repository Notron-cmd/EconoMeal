"use client"

import {
  Bell,
  Edit2,
  DollarSign,
  TrendingUp,
  Ban,
  ChefHat,
  MapPin,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="w-full top-0 sticky z-50 bg-background flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary/10">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj-fAucQ5WCqWGcxsxXaraKNiXYU664FwYldFcProCNQqo3saniet5ryvSDgU1jJdPp-mHkSiOxkpLKkGlTiOb1c69UZ8N72e_B5z8gkPPmdzohVU1kEnbiPUAyNh8hKGzUObWJamKpxCk95aEmepUOxBmk4pY_kaXlXa9WCX_bq94kCU346puTeENPQi50VnhPy31zmZimMrbVvA7UfO3UiDU5JA4FCf7CsTIBvtNiBnh8hbIbnWmaQ"
              alt=""
            />
          </div>
          <h1 className="text-[28px] font-bold text-primary tracking-tight">EconoMeal</h1>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
          <Bell className="w-6 h-6" />
        </button>
      </header>
      <main className="max-w-md mx-auto px-5 mt-6">
        <section className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-lg">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs4-VJy-OrUe76xD9nRWrAKFyUN8aWYiHCC1mwdIlQjLRpln_wLf6sHy0yjwuUbmME8dLMmLocBRJhjxPdAEPm8AfeGZYZYaxt7eO5RlyYMIW_z_OFyT1D6gZnR7iKDa-738igUCfqmlLO6CuThuU-vxg2p8sA-yEZVarghx-pptIZgneBPuEUiLpe6Av__sOu0TPaPhLY3A11y5ZHCG1h1Dz4yYH5Srm8Hcn3CKafKMZWSrGDlj1iHw"
                alt=""
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full border-2 border-card flex items-center justify-center">
              <Edit2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-[28px] font-bold text-foreground">Alex Thompson</h2>
          <p className="text-[15px] text-muted-foreground">Economics Major &bull; $450 Monthly Budget</p>
        </section>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-[0.05em] text-muted-foreground opacity-70">SAVED THIS MONTH</span>
            <span className="text-xl font-semibold text-primary">$124.50</span>
          </div>
          <div className="bg-card p-4 rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-[0.05em] text-muted-foreground opacity-70">STREAK</span>
            <span className="text-xl font-semibold text-secondary">12 Days</span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-[0.05em] text-muted-foreground px-2">FINANCIAL SETTINGS</h3>
            <div className="bg-card rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden">
              <button
                onClick={() => router.push("/financial-setup")}
                className="w-full flex items-center justify-between p-4 transition-all hover:bg-muted active:bg-input active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[17px] text-foreground">Income &amp; Budget</p>
                    <p className="text-xs text-muted-foreground">Manage monthly allowances</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-border" />
              </button>
              <div className="h-[1px] bg-border mx-4"></div>
              <button className="w-full flex items-center justify-between p-4 transition-all hover:bg-muted active:bg-input active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[17px] text-foreground">Savings Goals</p>
                    <p className="text-xs text-muted-foreground">Set and track progress</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-border" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-[0.05em] text-muted-foreground px-2">PREFERENCES</h3>
            <div className="bg-card rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden">
              <button
                onClick={() => router.push("/preferences")}
                className="w-full flex items-center justify-between p-4 transition-all hover:bg-muted active:bg-input active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[#895024]">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[17px] text-foreground">Allergies &amp; Restrictions</p>
                    <p className="text-xs text-muted-foreground">Nut-free, Gluten-free, Vegan</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-border" />
              </button>
              <div className="h-[1px] bg-border mx-4"></div>
              <button className="w-full flex items-center justify-between p-4 transition-all hover:bg-muted active:bg-input active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[#895024]">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[17px] text-foreground">Kitchen Equipment</p>
                    <p className="text-xs text-muted-foreground">Air fryer, Microwave, Hot plate</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-border" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-[0.05em] text-muted-foreground px-2">REGIONAL</h3>
            <div className="bg-card rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 transition-all hover:bg-muted active:bg-input active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[17px] text-foreground">Regional Pricing</p>
                    <p className="text-xs text-muted-foreground">Boston, MA &bull; US Dollar</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-border" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-[0.05em] text-muted-foreground px-2">SUPPORT</h3>
            <div className="bg-card rounded-xl shadow-[0px_10px_30px_rgba(28,25,23,0.04)] overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 transition-all hover:bg-muted active:bg-input active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[17px] text-foreground">About EconoMeal</p>
                    <p className="text-xs text-muted-foreground">Version 2.4.0 (Student Edition)</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-border" />
              </button>
            </div>
          </div>
          <button className="w-full h-14 bg-destructive/10 text-destructive font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-6 mb-8 shadow-sm">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
          <p className="text-center text-xs font-semibold tracking-[0.05em] text-muted-foreground opacity-40 mb-6">
            NUTRITION ON A BUDGET &bull; EST. 2024
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
