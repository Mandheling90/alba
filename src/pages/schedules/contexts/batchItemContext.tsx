import { createContext, ReactNode, useContext, useState } from 'react'

export type ApplyStatusType = 'applied' | 'notApplied' | 'writing'

interface BatchItemContextType {
  applyStatus: ApplyStatusType
  setApplyStatus: (value: ApplyStatusType) => void
}

const BatchItemContext = createContext<BatchItemContextType | undefined>(undefined)

interface BatchItemProviderProps {
  children: ReactNode
}

export const BatchItemProvider = ({ children }: BatchItemProviderProps) => {
  const [applyStatus, setApplyStatus] = useState<ApplyStatusType>('notApplied')

  return <BatchItemContext.Provider value={{ applyStatus, setApplyStatus }}>{children}</BatchItemContext.Provider>
}

export const useBatchItem = () => {
  const context = useContext(BatchItemContext)
  if (context === undefined) {
    throw new Error('useBatchItem must be used within a BatchItemProvider')
  }

  return context
}
