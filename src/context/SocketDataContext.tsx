import { ReactNode, createContext, useState } from 'react'
import { MKioskHealth } from 'src/model/kiosk/kioskModel'
import { MMonitoringHealth } from 'src/model/monitoring/monitoringModel'

export type SocketValuesType = {
  kioskHealth: MKioskHealth[]
  setKioskHealth: (kioskHealth: MKioskHealth[]) => void
  kioskHealthErrorCount: number
  setKioskHealthErrorCount: (monitoringHealthErrorCount: number) => void

  monitoringHealth: MMonitoringHealth[]
  setMonitoringHealth: (monitoringHealth: MMonitoringHealth[]) => void
  monitoringHealthErrorCount: number
  setMonitoringHealthErrorCount: (monitoringHealthErrorCount: number) => void
}

// ** Defaults
const defaultProvider: SocketValuesType = {
  kioskHealth: [],
  setKioskHealth: () => null,
  kioskHealthErrorCount: 0,
  setKioskHealthErrorCount: () => null,

  monitoringHealth: [],
  setMonitoringHealth: () => null,
  monitoringHealthErrorCount: 0,
  setMonitoringHealthErrorCount: () => null
}

const SocketDataContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const SocketDataProvider = ({ children }: Props) => {
  const [kioskHealth, setKioskHealth] = useState(defaultProvider.kioskHealth)
  const [monitoringHealth, setMonitoringHealth] = useState(defaultProvider.monitoringHealth)

  const [kioskHealthErrorCount, setKioskHealthErrorCount] = useState(defaultProvider.kioskHealthErrorCount)

  const [monitoringHealthErrorCount, setMonitoringHealthErrorCount] = useState(
    defaultProvider.monitoringHealthErrorCount
  )

  const values: SocketValuesType = {
    kioskHealth: kioskHealth,
    setKioskHealth: setKioskHealth,
    kioskHealthErrorCount: kioskHealthErrorCount,
    setKioskHealthErrorCount: setKioskHealthErrorCount,
    monitoringHealth: monitoringHealth,
    setMonitoringHealth: setMonitoringHealth,
    monitoringHealthErrorCount: monitoringHealthErrorCount,
    setMonitoringHealthErrorCount: setMonitoringHealthErrorCount
  }

  return <SocketDataContext.Provider value={values}>{children}</SocketDataContext.Provider>
}

export { SocketDataContext, SocketDataProvider }
