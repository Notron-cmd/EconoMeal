"use client"

import { useState } from "react"
import { Heart, ChefHat, RefreshCw, Sparkles, Zap, Timer, Wallet, Dumbbell, Lightbulb, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/shared/BottomNav"

const alternatives = [
  {
    name: "Chickpea Power Salad",
    cost: "$1.80/serv",
    time: "15 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
  },
  {
    name: "Garlic Spinach Pasta",
    cost: "$2.10/serv",
    time: "12 min",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop",
  },
  {
    name: "Veggie Tofu Stir-fry",
    cost: "$2.90/serv",
    time: "18 min",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop",
  },
]

export default function RecommendationPage() {
  const router = useRouter()
  const [liked, setLiked] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="w-full top-0 sticky z-50 bg-background flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img
              className="w-full h-full object-cover"
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtUzUg1ZCgTVmPqo-MGaJ_9y0XwM8IeNG9skSFLnxAmMd3Z1Y7E3ONMc9E3h8UIhxs0dcEz5qvDTZdbWZJ7kv71rymUTpbLSBeea6ZDhEz4O9cS2YBC5JVu7E5VdmBHyVbSGDcUSfg7HwYVBxNFh6P4iUEHaaPPsHCz-DuJMetT5ktaDSPg5lT3EoHCin9wvtZo18KChuZx2Hux3PM9rgOE6OSfRbSSgpkWawOvrW2yyWjdTP-R0zgAQ"
            />
          </div>
        </div>
        <h1 className="text-[28px] font-bold text-primary tracking-tight">EconoMeal</h1>
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <div className="px-5 pt-1 pb-4 space-y-5">
        <section className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0px_10px_30px_rgba(28,25,23,0.04)]">
          <div className="relative h-72 w-full overflow-hidden">
            <img
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              alt="Lentil and Sweet Potato Curry"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary-container text-on-primary-container text-[12px] font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                AI BEST MATCH
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-[28px] font-bold text-on-surface leading-tight">Lentil & Sweet Potato Curry</h2>
              <button onClick={() => setLiked(!liked)} className="transition-colors">
                <Heart className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : "text-on-surface-variant"}`} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge icon={Wallet} text="$2.50/serving" />
              <Badge icon={Zap} text="450 Cal" />
              <Badge icon={Dumbbell} text="18g Protein" />
              <Badge icon={Timer} text="20 min" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
                <ChefHat className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Equipment</p>
                  <p className="text-[15px] text-on-surface">Single Pot</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary-container/20 border border-primary-container/30 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary fill-current" />
                <div>
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-wider font-bold">AI Insight</p>
                  <p className="text-[15px] text-on-surface-variant">This saves you <span className="font-bold text-primary">$4 today</span> vs. your budget goal.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={() => router.push("/recipe/1")}
                className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-white font-semibold text-[17px] shadow-md active:scale-[0.98] transition-all duration-200"
                style={{ background: "linear-gradient(to bottom, #4ADE80, #22C55E)" }}
              >
                Cook This
                <ChefHat className="w-5 h-5" />
              </button>
              <button className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-on-surface-variant text-[17px] hover:bg-surface-container transition-colors active:scale-[0.98]">
                Try Another Recommendation
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[20px] font-semibold text-on-surface">Alternative Meals</h3>
            <button className="text-primary text-[12px] font-semibold">SEE ALL</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 hide-scrollbar">
            {alternatives.map((alt) => (
              <div
                key={alt.name}
                className="min-w-[260px] bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-surface-container shrink-0"
              >
                <div className="h-32 w-full">
                  <img className="w-full h-full object-cover" alt={alt.name} src={alt.image} />
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-semibold text-on-surface">{alt.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-bold text-sm">{alt.cost}</span>
                    <span className="text-on-surface-variant text-sm">{alt.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low p-5 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[20px] font-semibold text-on-surface">Weekly Budget</h3>
              <p className="text-on-surface-variant text-[15px]">You&apos;re doing great, Alex!</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xl">$42.50</p>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase">Remaining</p>
            </div>
          </div>
          <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(to bottom, #4ADE80, #22C55E)" }} />
          </div>
          <div className="flex justify-between text-[12px] font-semibold text-on-surface-variant">
            <span>Spent: $77.50</span>
            <span>Goal: $120.00</span>
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  )
}

function Badge({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="bg-surface-container-low px-3 py-1.5 rounded-full flex items-center gap-1">
      <Icon className="w-[18px] h-[18px] text-secondary" />
      <span className="text-[12px] font-semibold text-on-surface-variant">{text}</span>
    </div>
  )
}
