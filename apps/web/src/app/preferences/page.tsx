"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft, MapPin, ChefHat,
  Utensils, Check, ArrowRight, Loader2, ChevronDown,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

const equipmentOptions = [
  "Stove", "Microwave", "Rice Cooker", "Oven", "Air Fryer",
  "Blender", "Panci Presto", "Kukusan", "Wajan", "Klakat", "Teflon",
]

const dietOptions = ["Halal", "Vegan", "Dairy-Free", "Gluten-Free", "Nut-Free", "Egg-Free"]

export default function PreferencesPage() {
  const router = useRouter()
  const [provinces, setProvinces] = useState<string[]>([])
  const [province, setProvince] = useState("")
  const [provOpen, setProvOpen] = useState(false)
  const [equipment, setEquipment] = useState<string[]>(["Microwave"])
  const [diet, setDiet] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get<string[]>("/api/prices/provinces").then(setProvinces).catch(() => {})
  }, [])

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const toggleDiet = (item: string) => {
    setDiet((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
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
              Help EconoMeal understand your environment to suggest the best local and affordable recipes.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Your Location
            </h3>
            <div className="relative">
              <button
                onClick={() => setProvOpen(!provOpen)}
                className="w-full flex items-center bg-surface-container-lowest rounded-2xl shadow-sm p-4 border-2 border-transparent transition-all focus-within:[box-shadow:0_0_0_2px_#006d36]"
              >
                <MapPin className="w-5 h-5 text-primary shrink-0 mr-3" />
                <span className={`flex-1 text-left text-[15px] ${province ? "text-on-surface" : "text-outline"}`}>
                  {province || "Pilih Provinsi"}
                </span>
                <ChevronDown className={`w-5 h-5 text-outline transition-transform ${provOpen ? "rotate-180" : ""}`} />
              </button>
              {provOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-2xl shadow-lg border border-outline-variant/20 max-h-60 overflow-y-auto">
                  {provinces.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setProvince(p); setProvOpen(false) }}
                      className={`w-full text-left px-4 py-3 text-[15px] hover:bg-surface-container-low transition-colors ${
                        province === p ? "text-primary font-semibold bg-primary/5" : "text-on-surface"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Cooking Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleEquipment(item)}
                  className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 text-[15px] transition-all active:scale-95 ${
                    equipment.includes(item)
                      ? "bg-primary-container text-on-primary-container border-primary"
                      : "bg-surface-container-low text-on-surface border-outline-variant/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Dietary Restriction
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dietOptions.map((item) => (
                <label
                  key={item}
                  className={`relative flex items-center justify-between p-4 bg-surface-container-lowest rounded-[1rem] shadow-md cursor-pointer border-2 transition-all ${
                    diet.includes(item) ? "border-primary" : "border-transparent"
                  }`}
                >
                  <span className="text-[15px] font-semibold text-on-surface">
                    {item}
                  </span>
                  <input
                    type="checkbox"
                    checked={diet.includes(item)}
                    onChange={() => toggleDiet(item)}
                    className="hidden peer"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    diet.includes(item)
                      ? "bg-primary border-primary"
                      : "border-outline-variant"
                  }`}>
                    {diet.includes(item) && (
                      <Check className="w-[16px] h-[16px] text-white" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {error && (
              <p className="text-destructive text-sm text-center mb-3">{error}</p>
            )}
            <button
              onClick={async () => {
                setSaving(true)
                setError("")
                try {
                  await api.put("/api/auth/profile", {
                    provinsi: province,
                    alat_masak: equipment,
                    alergi: diet,
                  })
                  router.push("/dashboard")
                } catch (e) {
                  setError((e as Error)?.message || "Terjadi kesalahan, coba lagi")
                  setSaving(false)
                }
              }}
              disabled={!province || saving}
              className="w-full h-[56px] bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white text-[17px] font-bold rounded-full shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {!province && (
              <p className="text-center text-[13px] text-error mt-2">
                Pilih provinsi terlebih dahulu
              </p>
            )}
            <p className="text-center text-[15px] text-outline mt-4">
              You can change these anytime in settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
