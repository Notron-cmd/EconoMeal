export type Recipe = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  cooking_time_minutes: number | null
  servings: number
  nutrition: { calories?: number; protein?: number; carbs?: number; fats?: number } | null
  cost_estimate: number | null
  ingredients: { name: string; amount: string }[]
  steps: string[]
  meal_type: string | null
  dietary_tags: string[] | null
  equipment_needed?: string[] | null
}

export type DailyBudget = {
  daily_budget: number
  anggaran_makan: number
}

export type SaverTip = {
  id: number
  tip_text: string
  savings_amount: number | null
  category: string | null
}

export type UserStreak = {
  current_streak: number
  longest_streak: number
  last_active_date: string | null
}

export type FridgeSuggestion = {
  ingredients: string[]
  prices: { ingredient_name: string; average_price: number; province: string }[]
}

export type PriceInfo = {
  ingredient_name: string
  average_price: number
  province: string
}

export type RecipeDetail = {
  nama: string
  estimasi_harga: number
  nutrisi: { kalori: number; protein: number; lemak: number; karbohidrat: number }
  bahan_utama: BahanDetail[]
  cara_singkat: string
  alat?: string[]
}

export type BahanDetail = {
  nama: string
  berat: number
  satuan: string
  estimasi_harga: number
}

export type AiMenu = {
  nama: string
  estimasi_harga: number
  nutrisi: { kalori: number; protein: number; lemak: number; karbohidrat: number }
  bahan_utama: BahanDetail[]
  cara_singkat: string
  alat?: string[]
}

export type AiRecommendation = {
  budget_harian: number
  range_harga: string
  menu: AiMenu[]
}

export type SavedRecipe = {
  id: string
  user_id: string
  nama: string
  estimasi_harga: number
  nutrisi: { kalori: number; protein: number; lemak: number; karbohidrat: number }
  bahan_utama: BahanDetail[]
  cara_singkat: string
  alat?: string[]
  created_at: string
}

export type DailyNutrition = {
  kalori: number
  protein: number
  karbohidrat: number
  lemak: number
}

export type DailySpending = {
  total_spent: number
  date: string
}
