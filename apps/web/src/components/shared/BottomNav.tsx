"use client"

import { Home, BookOpen, Bot, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Recipes", href: "/recipes" },
  { icon: Bot, label: "AI Scan", href: "/fridge-saver" },
  { icon: User, label: "Profile", href: "/profile" },
]

type Props = {
  onDashboard?: () => void
}

export function BottomNav({ onDashboard }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNav = (href: string) => {
    if (href === "/dashboard" && onDashboard) {
      onDashboard()
    } else {
      router.push(href)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto px-3 py-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.href)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-primary bg-primary-container/20"
                  : "text-on-surface-variant opacity-70 hover:opacity-100"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "fill-current" : ""}`}
              />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
