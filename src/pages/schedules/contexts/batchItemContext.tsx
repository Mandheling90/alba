import { createContext, ReactNode, useContext } from 'react'

interface BatchItemContextType {
  isApplied: boolean
  setIsApplied: (value: boolean) => void
}

const BatchItemContext = createContext<BatchItemContextType | undefined>(undefined)

interface BatchItemProviderProps {
  children: ReactNode
  isApplied: boolean
  setIsApplied: (value: boolean) => void
}

export const BatchItemProvider = ({ children, isApplied, setIsApplied }: BatchItemProviderProps) => {
  return <BatchItemContext.Provider value={{ isApplied, setIsApplied }}>{children}</BatchItemContext.Provider>
}

export const useBatchItem = () => {
  const context = useContext(BatchItemContext)
  if (context === undefined) {
    throw new Error('useBatchItem must be used within a BatchItemProvider')
  }

  return context
}
