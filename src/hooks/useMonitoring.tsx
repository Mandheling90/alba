import { useContext } from 'react'
import { MonitoringContext } from 'src/context/MonitoringContext'

export const useMonitoring = () => useContext(MonitoringContext)
