import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type CustomerInfo = {
  customerId: string
  customerName: string
}

type LocationInfo = {
  locationId: string
  locationName: string
}

const ScheduleContext = createContext<{
  selectedCustomerInfo: CustomerInfo
  selectedLocationInfo: LocationInfo
  setSelectedCustomerInfo: Dispatch<SetStateAction<CustomerInfo>>
  setSelectedLocationInfo: Dispatch<SetStateAction<LocationInfo>>
}>({
  selectedCustomerInfo: {
    customerId: '',
    customerName: ''
  },
  selectedLocationInfo: {
    locationId: '',
    locationName: ''
  },
  setSelectedCustomerInfo: () => {
    return void 0
  },
  setSelectedLocationInfo: () => {
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
  const [selectedLocationInfo, setSelectedLocationInfo] = useState<LocationInfo>({
    locationId: '',
    locationName: ''
  })

  return (
    <ScheduleContext.Provider
      value={{ selectedCustomerInfo, setSelectedCustomerInfo, selectedLocationInfo, setSelectedLocationInfo }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}

export default ScheduleContext
