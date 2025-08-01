'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type User = {
  id: string
  email: string
  role_type: string
  [key: string]: any
}

interface UserContextValue {
  user: User | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      setUser(null)
    } else {
      const jwt = data.user
      const role_type = jwt?.user_metadata?.role_type ?? 'Pending'
      setUser({ id: jwt.id, email: jwt.email!, role_type, ...jwt.user_metadata })
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
  }

  const value: UserContextValue = {
    user,
    loading,
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
