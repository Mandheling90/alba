import { ReactNode, createContext, useState } from 'react'
import { useLayout } from 'src/hooks/useLayout'
import { IStatisticsReq } from 'src/model/statistics/StatisticsModel'
import { useSearchCameraListMutation } from 'src/service/statistics/statisticsService'

export enum ETableType {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  WEEKDAY = 'weekday',
  MONTHLY = 'monthly'
}

export enum ETableDisplayType {
  TIME = 'time',
  TIME_PLACE = 'timePlace'
}

export interface IStatisticsContextReq extends IStatisticsReq {
  page: string
  tableType?: ETableType
  tableDisplayType?: ETableDisplayType
}

export type StatisticsValuesType = {
  statisticsReq: IStatisticsContextReq[]
  setStatisticsReq: (statisticsReq: IStatisticsContextReq[]) => void
  statisticsDefultSet: (statisticsReq: IStatisticsContextReq) => Promise<IStatisticsContextReq>
  statisticsReqUpdate: (statisticsReq: IStatisticsContextReq) => void
}

const defaultProvider: StatisticsValuesType = {
  statisticsReq: [],
  setStatisticsReq: () => null,
  statisticsDefultSet: () => Promise.resolve({ page: '', startTime: '', endTime: '', cameraNos: [], ageType: '' }),
  statisticsReqUpdate: () => null
}

const StatisticsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const StatisticsProvider = ({ children }: Props) => {
  const { companyNo } = useLayout()
  const { mutateAsync: searchCameraList } = useSearchCameraListMutation()

  const [statisticsReq, setStatisticsReq] = useState<IStatisticsContextReq[]>(defaultProvider.statisticsReq)

  const statisticsDefultSet = async (newStatisticsReq: IStatisticsContextReq) => {
    const req = await searchCameraList({ companyNo: companyNo })

    const newStatistics = {
      ...newStatisticsReq,
      startTime: '00',
      endTime: '24',
      cameraNos: req?.data?.cameraList ? req.data.cameraList.map(camera => camera.cameraNo) : [],
      ageType: 'ALL',
      companyNo: companyNo
    }

    return newStatistics
  }

  const statisticsReqUpdate = async (newStatisticsReq: IStatisticsContextReq) => {
    const existingPage = statisticsReq.find(req => req.page === newStatisticsReq.page)

    if (existingPage) {
      setStatisticsReq(prev =>
        prev.map(req => (req.page === newStatisticsReq.page ? { ...req, ...newStatisticsReq } : req))
      )
    } else {
      setStatisticsReq(prev => [...prev, newStatisticsReq])
    }
  }

  const values: StatisticsValuesType = {
    statisticsReq,
    setStatisticsReq,
    statisticsDefultSet,
    statisticsReqUpdate
  }

  return <StatisticsContext.Provider value={values}>{children}</StatisticsContext.Provider>
}
export { StatisticsContext, StatisticsProvider }
