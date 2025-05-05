import { useContext } from 'react'
import { StatisticsContext } from 'src/context/StatisticsContext'

export const useStatistics = () => useContext(StatisticsContext)
