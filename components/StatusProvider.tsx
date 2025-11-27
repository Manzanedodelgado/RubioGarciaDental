'use client'

import { createContext, useContext } from 'react'

const StatusContext = createContext({})

export function StatusProvider({ children }: { children: React.ReactNode }) {
  return (
    <StatusContext.Provider value={{}}>
      {children}
    </StatusContext.Provider>
  )
}

export const useStatus = () => useContext(StatusContext)
