'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { identifyUser, resetAnalytics } from '@/lib/analytics'

export type User = {
  id: string
  email: string
  role_type: string
  institution_id?: string
  institution_status?: string
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
      const token = session.access_token
      const payload = JSON.parse(atob(token.split('.')[1])) as {
        app_metadata?: {
          role_type?: string
          institution_id?: string
          institution_status?: string
        }
      }
      const role_type =
        payload.app_metadata?.role_type || 'Pending'
      const institution_id = payload.app_metadata?.institution_id
      const institution_status = payload.app_metadata?.institution_status
      setUser({
        id: session.user.id,
        email: session.user.email!,
        role_type,
        institution_id,
        institution_status,
        ...session.user.user_metadata,
      })
      setAccessToken(token)
      identifyUser(session.user.id, { role_type, institution_id })
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
    resetAnalytics()
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
