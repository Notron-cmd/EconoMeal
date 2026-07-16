"use client"

import { useState } from "react"
import {
  ArrowLeft, MapPin, Pen, ChefHat, Microwave,
  Utensils, Zap, Search, X, Check, ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

const equipmentOptions = [
  { label: "Stove", icon: ChefHat },
  { label: "Microwave", icon: Microwave },
  { label: "Rice Cooker", icon: Utensils },
  { label: "Oven", icon: ChefHat },
  { label: "Air Fryer", icon: Zap },
]

const allergyOptions = ["Dairy-Free", "Gluten-Free", "Nut-Free", "Egg-Free"]
const suggestedPantry = ["Potato", "Carrots"]

export default function PreferencesPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [equipment, setEquipment] = useState<string[]>(["Microwave"])
  const [allergies, setAllergies] = useState<string[]>(["Nut-Free"])
  const [pantry, setPantry] = useState<string[]>(["Rice", "Beans", "Pasta", "Olive Oil", "Garlic", "Onions"])

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const toggleAllergy = (item: string) => {
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const addPantry = (item: string) => {
    if (!pantry.includes(item)) setPantry((prev) => [...prev, item])
  }

  const removePantry = (item: string) => {
    setPantry((prev) => prev.filter((i) => i !== item))
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-90"
            aria-label="Go back"
          >
            <ArrowLeft className="text-on-surface-variant" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-semibold text-outline uppercase tracking-widest">
              Step 2 of 2
            </span>
            <h1 className="text-[20px] font-semibold text-on-surface">
              Preferences
            </h1>
          </div>
          <div className="w-10" />
        </header>

        <div className="flex-1 max-w-sm mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-on-surface tracking-tight leading-[34px]">
              Fine-tune your diet.
            </h2>
            <p className="text-[15px] text-on-surface-variant leading-[22px] mt-2">
              Help NutriKos understand your environment to suggest the best local and affordable recipes.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Your Location
            </h3>
            <div className="relative w-full h-40 rounded-[1rem] overflow-hidden shadow-md">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaMH9Sg_EXfuE43KNjqlgcQL8P2NoKmkNPVKZYfS2FNrFjO1odlJfeog5miKzR2WUjtZksedxhwLkbtPofNl7Ze6VmRAlkS5jf-KvoiC7XicCTWQRwYe9c_THXEvD5vzR4j9dmdcETiEqXRDCGKv2GT7NxXM2UvotdZ85ciQZUt1XmssaHZ2Hl73lvxbMC3O_oPEOhVEV7exzQKaswtpvkTY2Ofeg4WZmJBsEZFDiaUGLYRAKGGBSWkA')",
                }}
              />
              <div className="absolute inset-0 bg-black/5 flex items-end p-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-md pointer-events-auto cursor-pointer active:scale-95 transition-transform">
                  <MapPin className="w-[18px] h-[18px] text-primary" />
                  <span className="text-[15px] font-semibold">East London, UK</span>
                  <Pen className="w-[18px] h-[18px] text-on-surface-variant" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Cooking Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => toggleEquipment(label)}
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 text-[15px] transition-all active:scale-95 ${
                    equipment.includes(label)
                      ? "bg-primary-container text-on-primary-container border-transparent"
                      : "bg-surface-container-low text-on-surface border-outline-variant/30"
                  }`}
                >
                  <Icon className="w-[20px] h-[20px]" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Food Allergies
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((item) => (
                <label
                  key={item}
                  className={`relative flex items-center justify-between p-4 bg-surface-container-lowest rounded-[1rem] shadow-md cursor-pointer border-2 transition-all ${
                    allergies.includes(item) ? "border-primary" : "border-transparent"
                  }`}
                >
                  <span className="text-[15px] font-semibold text-on-surface">
                    {item}
                  </span>
                  <input
                    type="checkbox"
                    checked={allergies.includes(item)}
                    onChange={() => toggleAllergy(item)}
                    className="hidden peer"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    allergies.includes(item)
                      ? "bg-primary border-primary"
                      : "border-outline-variant"
                  }`}>
                    {allergies.includes(item) && (
                      <Check className="w-[16px] h-[16px] text-white" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Pantry Staples
              </h3>
              <span className="text-[12px] font-semibold text-primary">
                {pantry.length} selected
              </span>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search ingredients (e.g. Rice, Onion...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-[1rem] py-4 pl-12 pr-4 text-[15px] placeholder:text-outline/50 shadow-md focus:ring-0"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {pantry.map((item) => (
                <div
                  key={item}
                  className="bg-primary-container/30 text-on-primary-container px-3 py-1 rounded-full flex items-center gap-1 text-[15px] border border-primary/10"
                >
                  {item}
                  <button onClick={() => removePantry(item)}>
                    <X className="w-[14px] h-[14px]" />
                  </button>
                </div>
              ))}
              {suggestedPantry
                .filter((item) => !pantry.includes(item))
                .map((item) => (
                  <button
                    key={item}
                    onClick={() => addPantry(item)}
                    className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-[15px] hover:bg-surface-container-high transition-colors active:scale-95 border border-dashed border-outline-variant"
                  >
                    + {item}
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full h-[56px] bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white text-[17px] font-bold rounded-full shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[15px] text-outline mt-4">
              You can change these anytime in settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
