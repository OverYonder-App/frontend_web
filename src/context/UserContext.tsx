'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type User = {
  id: string
  email: string
  role_type: string
  [key: string]: unknown
}

interface UserContextValue {
  user: User | null
  loading: boolean
  accessToken: string | null
  signInWithPassword: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const loadUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setUser(null)
      setAccessToken(null)
    } else {
      const jwt = session.user
      const role_type = jwt?.user_metadata?.role_type ?? 'Pending'
      setUser({ id: jwt.id, email: jwt.email!, role_type, ...jwt.user_metadata })
      setAccessToken(session.access_token)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password })
    await loadUser()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAccessToken(null)
  }

  const value: UserContextValue = {
    user,
    loading,
    accessToken,
    signInWithPassword,
    signOut,
    refreshUser: loadUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
