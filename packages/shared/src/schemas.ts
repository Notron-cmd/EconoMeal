import { z } from "zod"

export const financialSetupSchema = z.object({
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  monthlyExpenses: z.number().min(0, "Monthly expenses cannot be negative"),
  savingsGoal: z.number().min(0, "Savings goal cannot be negative"),
})

export const userPreferencesSchema = z.object({
  location: z.string().min(1, "Location is required"),
  cookingEquipment: z.array(z.string()),
  allergies: z.array(z.string()),
  pantryStaples: z.array(z.string()),
})

export const expenseLogSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  note: z.string().optional(),
})

export const fridgeIngredientSchema = z.object({
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
})

export type FinancialSetup = z.infer<typeof financialSetupSchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>
export type ExpenseLog = z.infer<typeof expenseLogSchema>
export type FridgeIngredients = z.infer<typeof fridgeIngredientSchema>
