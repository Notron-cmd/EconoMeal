import { z } from "zod"

export const financialSetupSchema = z.object({
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  monthlyExpenses: z.number().min(0, "Monthly expenses cannot be negative"),
  savingsGoal: z.number().min(0, "Savings goal cannot be negative"),
})

export const userPreferencesSchema = z.object({
  location: z.string().min(1, "Location is required"),
  provinsi: z.string().optional(),
  cookingEquipment: z.array(z.string()),
  allergies: z.array(z.string()),
  pantryStaples: z.array(z.string()),
})

export const expenseLogSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  name: z.string().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack", "grocery", "other"]),
  note: z.string().optional(),
})

export const fridgeIngredientSchema = z.object({
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
})

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  cooking_time_minutes: z.number().nullable(),
  servings: z.number(),
  ingredients: z.any(),
  steps: z.any(),
  nutrition: z.any(),
  cost_estimate: z.number().nullable(),
  equipment_needed: z.array(z.string()).nullable(),
  meal_type: z.string().nullable(),
  dietary_tags: z.array(z.string()).nullable(),
})

export const dailyNutritionSchema = z.object({
  date: z.string(),
  total_calories: z.number(),
  total_protein: z.number(),
  total_carbs: z.number(),
  total_fats: z.number(),
})

export const userStreakSchema = z.object({
  current_streak: z.number(),
  longest_streak: z.number(),
  last_active_date: z.string(),
})

export const saverTipSchema = z.object({
  id: z.number(),
  tip_text: z.string(),
  savings_amount: z.number().nullable(),
  category: z.string().nullable(),
})

export type FinancialSetup = z.infer<typeof financialSetupSchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>
export type ExpenseLog = z.infer<typeof expenseLogSchema>
export type FridgeIngredients = z.infer<typeof fridgeIngredientSchema>
export type Recipe = z.infer<typeof recipeSchema>
export type DailyNutrition = z.infer<typeof dailyNutritionSchema>
export type UserStreak = z.infer<typeof userStreakSchema>
export type SaverTip = z.infer<typeof saverTipSchema>
