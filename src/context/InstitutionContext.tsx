'use client'

import { createContext, useContext, useState } from 'react'

interface InstitutionContextValue {
  institutionId: string | null
  switchInstitution: (id: string) => void
}

const InstitutionContext = createContext<InstitutionContextValue | undefined>(undefined)

export const InstitutionProvider = ({ children }: { children: React.ReactNode }) => {
  const [institutionId, setInstitutionId] = useState<string | null>(null)

  const switchInstitution = (id: string) => {
    setInstitutionId(id)
  }

  return (
    <InstitutionContext.Provider value={{ institutionId, switchInstitution }}>
      {children}
    </InstitutionContext.Provider>
  )
}

export const useInstitution = () => {
  const ctx = useContext(InstitutionContext)
  if (!ctx) throw new Error('useInstitution must be used within InstitutionProvider')
  return ctx
}
