"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Settings, MapPin, TrendingUp, Flame, Loader2, LogOut, BookHeart, Wallet, Apple, ChefHat, ExternalLink, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"
import { useAuth } from "@/hooks/useAuth"
import { useUserStreak, useSavedRecipes, useDailyBudget, useDailyNutrition } from "@/hooks/useData"

export default function ProfilePage() {
  const router = useRouter()
  const { profile, user, logout, refreshProfile } = useAuth()

  useEffect(() => { refreshProfile() }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }
  const { data: streak } = useUserStreak()
  const { data: savedRecipes } = useSavedRecipes()
  const { data: budget } = useDailyBudget()
  const { data: nutrition } = useDailyNutrition()

  const dailyBudget = budget ? Math.floor(Number(budget.anggaran_makan) / 30 / 1000) * 1000 : 0

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <header className="w-full top-0 sticky bg-background flex items-center justify-between px-5 py-4 z-40">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:opacity-80 transition-opacity active:scale-95" onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[28px] leading-[34px] font-bold tracking-tight text-primary">Profile</h1>
        </div>
        <button className="text-muted-foreground hover:opacity-80 transition-opacity active:scale-95">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <main className="px-5 max-w-md mx-auto space-y-5 pt-4">
        <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6 flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#e2ebe0]">
            <img
              className="w-full h-full object-cover"
              src={profile.avatar_url ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuBXyUcV4zjRtYN2lMk_LeFrdQclDw9_JhbFzm9pngdJg6_mu53Ee4OKsY0ZAkAT-sxYF2TlCLG4eUpnCqKtjyDpOFIDSyaHd849AsRJmpfZ7_9tJR9nesTMoCcrWD9NfhY8iN8rgCcJBXOQ8MUd-a14KUW3gtI8FLHIO9j6aC_bbf5HnzM5SupNARkTv4KxhtxoWmCo0p7THd4HD9tFS_n9zvcl39nQNJGsn6iBvnfMMR5rDHslPwFmQg"}
              alt="Avatar"
            />
          </div>
          <div className="text-center">
            <h2 className="text-[22px] leading-[30px] font-bold text-foreground">{profile.name || profile.full_name || "User"}</h2>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Mail className="w-4 h-4" /> {profile.email || user?.email || ""}</p>
            {profile.provinsi && (
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="w-4 h-4" /> {profile.provinsi}
              </p>
            )}
          </div>
        </section>

        <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6 flex items-center justify-around">
          <div className="text-center">
            <Flame className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{streak?.current_streak ?? 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{streak?.longest_streak ?? 0}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
        </section>

        <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <BookHeart className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{savedRecipes?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Resep Tersimpan</p>
          </div>
          <div className="text-center">
            <Wallet className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{dailyBudget > 0 ? `Rp ${dailyBudget.toLocaleString("id-ID")}` : "—"}</p>
            <p className="text-xs text-muted-foreground">Budget Harian</p>
          </div>
        </section>

        {nutrition && (nutrition.kalori > 0 || nutrition.protein > 0) && (
          <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Nutrisi Hari Ini</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <Flame className="w-4 h-4 text-primary mx-auto mb-0.5" />
                <p className="font-bold">{nutrition.kalori}</p>
                <p className="text-muted-foreground">Kalori</p>
              </div>
              <div>
                <span className="block text-secondary font-bold mb-0.5">P</span>
                <p className="font-bold">{nutrition.protein}g</p>
                <p className="text-muted-foreground">Protein</p>
              </div>
              <div>
                <span className="block text-[#fd933d] font-bold mb-0.5">K</span>
                <p className="font-bold">{nutrition.karbohidrat}g</p>
                <p className="text-muted-foreground">Karbo</p>
              </div>
              <div>
                <span className="block text-blue-500 font-bold mb-0.5">L</span>
                <p className="font-bold">{nutrition.lemak}g</p>
                <p className="text-muted-foreground">Lemak</p>
              </div>
            </div>
          </section>
        )}

        {profile.alat_masak && profile.alat_masak.length > 0 && (
          <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-primary" /> Alat Masak
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.alat_masak.map((item: string) => (
                <span key={item} className="bg-surface-container-low text-sm px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        {profile.alergi && profile.alergi.length > 0 && (
          <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Apple className="w-4 h-4 text-primary" /> Preferensi Makanan
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.alergi.map((item: string) => (
                <span key={item} className="bg-[#e2ebe0] text-primary text-sm font-medium px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        <a
          href="/preferences"
          className="flex items-center justify-between bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-5 active:scale-[0.98] transition-all"
        >
          <span className="font-semibold text-foreground">Edit Preferences</span>
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full h-12 border border-destructive/30 text-destructive text-base font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-destructive/5 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
