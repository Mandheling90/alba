import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type CustomerInfo = {
  customerId: string
  customerName: string
}

type GateInfo = {
  gateId: string
  gateName: string
}

const ScheduleContext = createContext<{
  selectedCustomerInfo: CustomerInfo
  selectedGateInfo: GateInfo
  setSelectedCustomerInfo: Dispatch<SetStateAction<CustomerInfo>>
  setSelectedGateInfo: Dispatch<SetStateAction<GateInfo>>
}>({
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
  }
})

export const useScheduleContext = () => {
  return useContext(ScheduleContext)
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

  return (
    <ScheduleContext.Provider
      value={{ selectedCustomerInfo, setSelectedCustomerInfo, selectedGateInfo, setSelectedGateInfo }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}

export default ScheduleContext
