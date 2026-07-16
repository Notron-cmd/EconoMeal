"use client"

import {
  Sparkles,
  ChefHat,
  Receipt,
  Refrigerator,
  TrendingDown,
  Zap,
  Apple,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BottomNav } from "@/components/shared/BottomNav"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-8 pb-4">
        {/* Hero Budget Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-on-primary mb-6 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-1">
              Today&apos;s Food Budget
            </p>
            <p className="text-4xl font-bold mb-1">$15.00</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-80">
                Remaining: <span className="font-bold">$8.50</span>
              </p>
              <span className="text-xs font-semibold opacity-80">56.6%</span>
            </div>
            <Progress value={56.6} className="h-3 bg-white/20 [&>div]:bg-white" />
            <p className="text-xs font-medium opacity-80 mt-2 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              On track to save $45 this month
            </p>
          </CardContent>
        </Card>

        {/* AI Recommendation Entry */}
        <Card
          className="mb-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/ai-loading")}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1rem] bg-gradient-to-br from-primary-light to-primary flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface">Ask AI for Recommendation</p>
              <p className="text-sm text-on-surface-variant truncate">
                &ldquo;What can I cook with the eggs and spinach in my fridge?&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Apple className="w-6 h-6 text-primary mb-1" />
              <p className="text-2xl font-bold text-on-surface">1.2k</p>
              <p className="text-xs text-on-surface-variant">Calories</p>
              <p className="text-[10px] text-on-surface-variant">60% of goal</p>
              <div className="w-full h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Zap className="w-6 h-6 text-secondary mb-1" />
              <p className="text-2xl font-bold text-on-surface">45g</p>
              <p className="text-xs text-on-surface-variant">Protein</p>
              <p className="text-[10px] text-on-surface-variant">target 80g</p>
              <div className="w-full h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-secondary" style={{ width: "56%" }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <p className="text-sm font-semibold text-on-surface mb-3">Quick Actions</p>
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <QuickActionCard
            icon={Refrigerator}
            label="Fridge Saver"
            onClick={() => router.push("/fridge-saver")}
          />
          <QuickActionCard
            icon={ChefHat}
            label="View Recipes"
            onClick={() => router.push("/recipes")}
          />
          <QuickActionCard
            icon={Receipt}
            label="Expense Log"
            onClick={() => router.push("/expense-log")}
          />
        </div>

        {/* Smart Saver Tip */}
        <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface mb-0.5">Smart Saver Tip</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Buying bulk grains instead of pre-packaged boxes could save you $12 this week.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

function QuickActionCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-[1rem] bg-card shadow-sm min-w-[100px] hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-[0.75rem] bg-surface-container-low flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-xs font-semibold text-on-surface">{label}</span>
    </button>
  )
}
