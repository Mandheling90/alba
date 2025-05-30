import { ReactNode, createContext, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
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
  const { user } = useAuth()
  const { mutateAsync: searchCameraList } = useSearchCameraListMutation()

  const [statisticsReq, setStatisticsReq] = useState<IStatisticsContextReq[]>(defaultProvider.statisticsReq)

  const statisticsDefultSet = async (newStatisticsReq: IStatisticsContextReq) => {
    // 동일한 page가 이미 존재하는지 확인
    // const existingPage = statisticsReq.find(req => req.page === newStatisticsReq.page)

    // if (existingPage) {
    //   return existingPage
    // }

    const req = await searchCameraList({ companyNo: user?.userInfo?.companyNo ?? 0 })

    const newStatistics = {
      ...newStatisticsReq,
      startTime: '00',
      endTime: '24',
      cameraNos: req?.data?.cameraList ? req.data.cameraList.map(camera => camera.cameraNo) : [],
      ageType: 'ALL'
    }

    // setStatisticsReq(prev => [...prev, newStatistics])

    return newStatistics
  }

  const statisticsReqUpdate = async (newStatisticsReq: IStatisticsContextReq) => {
    const existingPage = statisticsReq.find(req => req.page === newStatisticsReq.page)

    console.log(existingPage)

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
