"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api, setToken, clearToken } from "@/lib/api"

type Profile = {
  id: string
  email: string
  full_name: string | null
  name: string | null
  kota_domisili: string | null
  provinsi: string | null
  alat_masak: string[]
  alergi: string[]
  pantry_staples: string[]
  avatar_url: string | null
}

type AuthContextType = {
  user: { id: string; email: string } | null
  profile: Profile | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("token")
    if (saved) {
      setTokenState(saved)
      api.get<{ user: { id: string; email: string }; profile: Profile }>("/api/auth/me")
        .then((res) => {
          setUser(res.user)
          setProfile(res.profile)
        })
        .catch(() => {
          clearToken()
          setTokenState(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: { id: string; email: string }; session: { access_token: string }; profile: Profile }>(
      "/api/auth/login",
      { email, password }
    )
    setToken(res.session.access_token)
    setTokenState(res.session.access_token)
    setUser(res.user)
    setProfile(res.profile)
    setToken(res.session.access_token)
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await api.post<{ user: { id: string; email: string }; session: { access_token: string } }>(
      "/api/auth/register",
      { email, password, name }
    )
    if (res.session) {
      setToken(res.session.access_token)
      setTokenState(res.session.access_token)
      setUser(res.user)
      const profileRes = await api.get<{ user: { id: string; email: string }; profile: Profile }>("/api/auth/me")
      setProfile(profileRes.profile)
    }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get<{ user: { id: string; email: string }; profile: Profile }>("/api/auth/me")
      setProfile(res.profile)
    } catch {
      // ignore
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
