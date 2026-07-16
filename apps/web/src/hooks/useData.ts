"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
  DailyBudget, MonthlyBudget, WeeklyBudget,
  SaverTip, UserStreak, Recipe,
  Expense, FridgeSuggestion,
} from "@/lib/types"

export function useDailyBudget() {
  return useQuery({
    queryKey: ["daily-budget"],
    queryFn: () => api.get<DailyBudget>("/api/finances/daily"),
  })
}

export function useMonthlyBudget() {
  return useQuery({
    queryKey: ["monthly-budget"],
    queryFn: () => api.get<MonthlyBudget>("/api/budget/monthly"),
  })
}

export function useWeeklyBudget() {
  return useQuery({
    queryKey: ["weekly-budget"],
    queryFn: () => api.get<WeeklyBudget>("/api/budget/weekly"),
  })
}

export function useSaverTips() {
  return useQuery({
    queryKey: ["saver-tips"],
    queryFn: () => api.get<SaverTip[]>("/api/streaks/tips"),
  })
}

export function useUserStreak() {
  return useQuery({
    queryKey: ["user-streak"],
    queryFn: () => api.get<UserStreak>("/api/streaks"),
  })
}

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: () => api.get<Recipe[]>("/api/recipes"),
  })
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => api.get<Recipe>(`/api/recipes/${id}`),
    enabled: !!id,
  })
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.get<Expense[]>("/api/expenses"),
  })
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { amount: number; name?: string; meal_type: string; note?: string }) =>
      api.post("/api/expenses", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] })
      qc.invalidateQueries({ queryKey: ["daily-budget"] })
      qc.invalidateQueries({ queryKey: ["weekly-budget"] })
      qc.invalidateQueries({ queryKey: ["monthly-budget"] })
    },
  })
}

export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/expenses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] })
      qc.invalidateQueries({ queryKey: ["daily-budget"] })
      qc.invalidateQueries({ queryKey: ["weekly-budget"] })
      qc.invalidateQueries({ queryKey: ["monthly-budget"] })
    },
  })
}

export function useFridgeSuggestions() {
  return useQuery({
    queryKey: ["fridge-suggestions"],
    queryFn: () => api.get<FridgeSuggestion>("/api/fridge/suggestions"),
  })
}

export function useSaveFridge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ingredients: string[]) =>
      api.post("/api/fridge/save", { ingredients }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fridge-suggestions"] })
      qc.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}
