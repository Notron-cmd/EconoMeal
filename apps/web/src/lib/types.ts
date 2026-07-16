export type Expense = {
  id: string
  amount: number
  name: string | null
  meal_type: string
  note: string | null
  logged_at: string
}

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
  spent_today: number
  remaining: number
  percentage: number
}

export type MonthlyBudget = {
  monthly_budget: number
  total_spent: number
  remaining: number
  percentage: number
  savings_goal: number
}

export type WeeklyBudget = {
  weekly_budget: number
  total_spent: number
  remaining: number
  percentage: number
  daily_average: number
  expenses: { amount: number; logged_at: string }[]
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
