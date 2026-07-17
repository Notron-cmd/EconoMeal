"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { DailyBudget, SaverTip, UserStreak, Recipe, FridgeSuggestion, DailyNutrition, SavedRecipe, AiMenu } from "@/lib/types"

export function useDailyBudget() {
  return useQuery({
    queryKey: ["daily-budget"],
    queryFn: () => api.get<DailyBudget>("/api/finances/daily"),
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

export function useIngredients(provinsi?: string) {
  return useQuery({
    queryKey: ["ingredients", provinsi],
    queryFn: () => api.get<{ id: string; nama_bahan: string; estimasi_harga: number; satuan: string }[]>(`/api/prices/ingredients${provinsi ? `?provinsi=${encodeURIComponent(provinsi)}` : ""}`),
    enabled: !!provinsi,
  })
}

export function useFridgeSuggestions() {
  return useQuery({
    queryKey: ["fridge-suggestions"],
    queryFn: () => api.get<FridgeSuggestion>("/api/fridge/suggestions"),
  })
}

export function useSavedRecipes() {
  return useQuery({
    queryKey: ["saved-recipes"],
    queryFn: () => api.get<SavedRecipe[]>("/api/recipes/saved"),
  })
}

export function useSavedRecipe(id: string) {
  return useQuery({
    queryKey: ["saved-recipe", id],
    queryFn: () => api.get<SavedRecipe>(`/api/recipes/saved/${id}`),
    enabled: !!id,
  })
}

export function useSaveRecipes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (menu: AiMenu[]) =>
      api.post("/api/recipes/saved", { menu }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-recipes"] })
    },
  })
}

export function useDailyNutrition() {
  return useQuery({
    queryKey: ["daily-nutrition"],
    queryFn: () => api.get<DailyNutrition>("/api/nutrition/today"),
  })
}

export function useSaveNutrition() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DailyNutrition) =>
      api.post("/api/nutrition/save", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["daily-nutrition"] })
    },
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
