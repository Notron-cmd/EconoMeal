"use client"

import { useState } from "react"
import {
  User,
  Edit2,
  TrendingUp,
  Flame,
  Wallet,
  PiggyBank,
  Apple,
  ChefHat,
  MapPin,
  DollarSign,
  LogOut,
  ChevronRight,
  Info,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/shared/BottomNav"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-8">
        {/* Profile Hero */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-3xl font-bold text-on-primary shadow-lg">
              AT
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center shadow-sm">
              <Edit2 className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
          <h2 className="text-[24px] font-bold text-on-surface">Alex Thompson</h2>
          <p className="text-sm text-on-surface-variant">Economics Major - $450 Monthly Budget</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Card>
            <CardContent className="p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-on-surface">$124.50</p>
              <p className="text-xs font-semibold text-on-surface-variant">SAVED THIS MONTH</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-on-surface">12</p>
              <p className="text-xs font-semibold text-on-surface-variant">STREAK</p>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-6 mb-8">
          {/* Financial Settings */}
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Financial Settings</p>
            <div className="space-y-1">
              <SettingRow
                icon={Wallet}
                label="Income & Budget"
                description="Manage monthly allowances"
                onClick={() => router.push("/financial-setup")}
              />
              <SettingRow
                icon={PiggyBank}
                label="Savings Goals"
                description="Set and track progress"
              />
            </div>
          </div>

          {/* Preferences */}
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Preferences</p>
            <div className="space-y-1">
              <SettingRow
                icon={Apple}
                label="Allergies & Restrictions"
                description="Nut-free, Gluten-free, Vegan"
                onClick={() => router.push("/preferences")}
              />
              <SettingRow
                icon={ChefHat}
                label="Kitchen Equipment"
                description="Air fryer, Microwave, Hot plate"
              />
            </div>
          </div>

          {/* Regional */}
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Regional</p>
            <SettingRow
              icon={MapPin}
              label="Regional Pricing"
              description="Boston, MA - US Dollar"
            />
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Support</p>
            <SettingRow
              icon={Info}
              label="About NutriKos"
              description="Version 2.4.0 - Student Edition"
            />
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          size="lg"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
          onClick={() => router.push("/")}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>

        <p className="text-center text-[10px] font-semibold text-on-surface-variant tracking-[0.05em] mt-6 mb-4">
          NUTRITION ON A BUDGET - EST. 2024
        </p>
      </div>
      <BottomNav />
    </div>
  )
}

function SettingRow({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-card hover:bg-surface-container-high transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
          <Icon className="w-5 h-5 text-on-surface-variant" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-on-surface">{label}</p>
          <p className="text-xs text-on-surface-variant">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-on-surface-variant" />
    </button>
  )
}
