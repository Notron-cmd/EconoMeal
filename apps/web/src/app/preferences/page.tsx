"use client"

import { useState } from "react"
import { MapPin, X, Search, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const equipmentOptions = ["Stove", "Microwave", "Rice Cooker", "Oven", "Air Fryer"]
const allergyOptions = ["Dairy-Free", "Gluten-Free", "Nut-Free", "Egg-Free"]
const suggestedPantry = ["Potato", "Carrots", "Tomato", "Eggs", "Chicken", "Tofu"]

export default function PreferencesPage() {
  const router = useRouter()
  const [step] = useState(2)
  const [search, setSearch] = useState("")
  const [equipment, setEquipment] = useState<string[]>(["Microwave"])
  const [allergies, setAllergies] = useState<string[]>(["Nut-Free"])
  const [pantry, setPantry] = useState<string[]>(["Rice", "Beans", "Pasta", "Olive Oil", "Garlic", "Onions"])

  const totalSteps = 2
  const progress = (step / totalSteps) * 100

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

  const filteredSuggestions = suggestedPantry.filter(
    (item) =>
      !pantry.includes(item) &&
      item.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-8 overflow-y-auto">
        <div className="mb-6">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">
            Step {step} of {totalSteps}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex-1 max-w-sm mx-auto w-full">
          <h2 className="text-[28px] font-bold text-on-surface tracking-tight mb-1">
            Fine-tune your diet.
          </h2>
          <p className="text-[15px] text-on-surface-variant leading-[22px] mb-6">
            Help NutriKos understand your environment.
          </p>

          {/* Location */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-on-surface mb-2 block">
              Your Location
            </label>
            <div className="h-24 rounded-[1rem] bg-surface-container-low flex items-center justify-center gap-2 text-on-surface-variant text-sm">
              <MapPin className="w-4 h-4" />
              East London, UK
              <button className="text-primary font-semibold text-xs ml-1 underline">
                Edit
              </button>
            </div>
          </div>

          {/* Cooking Equipment */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-on-surface mb-2 block">
              Cooking Equipment
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleEquipment(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    equipment.includes(item)
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-on-surface mb-2 block">
              Food Allergies & Restrictions
            </label>
            <div className="flex flex-wrap gap-2">
              {allergyOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleAllergy(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    allergies.includes(item)
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Pantry Staples */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-on-surface mb-2 block">
              Pantry Staples
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <Input
                placeholder="Search ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {pantry.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-on-primary text-sm font-medium"
                >
                  {item}
                  <button onClick={() => removePantry(item)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {search && filteredSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => addPantry(item)}
                    className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="w-full text-[17px] font-bold"
            onClick={() => router.push("/dashboard")}
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </Button>
          <p className="text-xs text-on-surface-variant text-center mt-2">
            You can change these anytime in settings.
          </p>
        </div>
      </div>
    </div>
  )
}
