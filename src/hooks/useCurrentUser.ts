'use client'

import { useUser } from '@/context/UserContext'

export function useCurrentUser() {
  return useUser()
}
