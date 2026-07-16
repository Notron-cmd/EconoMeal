"use client"

import { ArrowLeft, Settings, Mail, MapPin, TrendingUp, Flame, Loader2, LogOut } from "lucide-react"
import { BottomNav } from "@/components/shared/BottomNav"
import { useAuth } from "@/hooks/useAuth"
import { useUserStreak } from "@/hooks/useData"

export default function ProfilePage() {
  const { profile, logout } = useAuth()
  const { data: streak } = useUserStreak()

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

      <main className="px-5 max-w-md mx-auto space-y-6 pt-4">
        <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#e2ebe0]">
            <img
              className="w-full h-full object-cover"
              src={profile.avatar_url ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuBXyUcV4zjRtYN2lMk_LeFrdQclDw9_JhbFzm9pngdJg6_mu53Ee4OKsY0ZAkAT-sxYF2TlCLG4eUpnCqKtjyDpOFIDSyaHd849AsRJmpfZ7_9tJR9nesTMoCcrWD9NfhY8iN8rgCcJBXOQ8MUd-a14KUW3gtI8FLHIO9j6aC_bbf5HnzM5SupNARkTv4KxhtxoWmCo0p7THd4HD9tFS_n9zvcl39nQNJGsn6iBvnfMMR5rDHslPwFmQg"}
              alt="Avatar"
            />
          </div>
          <div className="text-center">
            <h2 className="text-[22px] leading-[30px] font-bold text-foreground">{profile.full_name ?? "User"}</h2>
            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>
            {profile.provinsi && (
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
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

        {profile.pantry_staples && profile.pantry_staples.length > 0 && (
          <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(28,25,23,0.04)] p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Pantry Staples</h3>
            <div className="flex flex-wrap gap-2">
              {profile.pantry_staples.map((item: string) => (
                <span key={item} className="bg-[#e2ebe0] text-primary text-sm font-medium px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={logout}
          className="w-full h-12 border border-destructive/30 text-destructive text-base font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-destructive/5 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
