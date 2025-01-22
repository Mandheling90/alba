import { ReactNode, createContext, useState } from 'react'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { MContent } from 'src/model/contents/contentsModel'
import { MMonitoringFilter } from 'src/model/monitoring/monitoringModel'

export type MonitoringValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void

  monitoringFilter: MMonitoringFilter
  setMonitoringFilter: (monitoringFilter: MMonitoringFilter) => void

  errors: Partial<Record<keyof MContent, string>>
  setErrors: (errors: Partial<Record<keyof MContent, string>>) => void
}

// ** Defaults
const defaultProvider: MonitoringValuesType = {
  loading: true,
  setLoading: () => Boolean,

  monitoringFilter: { sort: 'asc', status: KIOSK_STATUS.ALL, keyWord: '' },
  setMonitoringFilter: () => null,

  errors: {},
  setErrors: () => null
}

const MonitoringContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const MonitoringProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [monitoringFilter, setMonitoringFilter] = useState(defaultProvider.monitoringFilter)
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({})

  const values: MonitoringValuesType = {
    loading,
    setLoading,
    errors,
    monitoringFilter,
    setMonitoringFilter,
    setErrors
  }

  return <MonitoringContext.Provider value={values}>{children}</MonitoringContext.Provider>
}

export { MonitoringContext, MonitoringProvider }
