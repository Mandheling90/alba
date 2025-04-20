import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { WorkType } from 'src/service/schedule/scheduleService'

type CustomerInfo = {
  customerId: string
  customerName: string
}

type GateInfo = {
  gateId: string
  gateName: string
}

interface ScheduleState {
  selectedCustomerInfo: CustomerInfo
  selectedGateInfo: GateInfo
  setSelectedCustomerInfo: Dispatch<SetStateAction<CustomerInfo>>
  setSelectedGateInfo: Dispatch<SetStateAction<GateInfo>>
  tempStore: TempMockDataStoreInterface
  setTempStore: Dispatch<SetStateAction<TempMockDataStoreInterface>>
}
const ScheduleContext = createContext<ScheduleState>({
  selectedCustomerInfo: {
    customerId: '',
    customerName: ''
  },
  selectedGateInfo: {
    gateId: '',
    gateName: ''
  },
  setSelectedCustomerInfo: () => {
    return void 0
  },
  setSelectedGateInfo: () => {
    return void 0
  },
  tempStore: {},
  setTempStore: () => {
    return void 0
  }
})

export const useScheduleContext = () => {
  return useContext(ScheduleContext)
}

interface TempMockDataStoreInterface {
  [key: string]: {
    [key: string]: {
      [key: string]: TempModaDataScheduleInterface[]
    }
  }
}

interface TempModaDataScheduleInterface {
  workType: WorkType
  startTime: string
  endTime: string
}

export const ScheduleContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState<CustomerInfo>({
    customerId: '',
    customerName: ''
  })
  const [selectedGateInfo, setSelectedGateInfo] = useState<GateInfo>({
    gateId: '',
    gateName: ''
  })

  const [tempStore, setTempStore] = useState<TempMockDataStoreInterface>({})

  return (
    <ScheduleContext.Provider
      value={{
        selectedCustomerInfo,
        setSelectedCustomerInfo,
        selectedGateInfo,
        setSelectedGateInfo,
        tempStore,
        setTempStore
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}

export default ScheduleContext
