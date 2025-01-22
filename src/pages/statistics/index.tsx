import { FC } from 'react'
import { MRealtimeDetailParam } from 'src/model/statistics/StatisticsModel'
import { create } from 'zustand'

// import Statistics from './Statistics'

interface MStatisticsStore {
  realtimeDetailParam: MRealtimeDetailParam
  cameraIds: number[]
}

interface MStatisticsAction {
  setRealtimeDetailParam: (value: MRealtimeDetailParam) => void
  setCameraIds: (value: number[]) => void
  clear: () => void
}

export const defaultValue: MStatisticsStore = {
  realtimeDetailParam: { item: 1, cameraIds: [], startDate: '', endDate: '' },
  cameraIds: []
}

export const useStatisticsStore = create<MStatisticsStore & MStatisticsAction>(set => ({
  ...defaultValue,

  setRealtimeDetailParam: (value: MRealtimeDetailParam) =>
    set(state => {
      return { ...state, realtimeDetailParam: value }
    }),
  setCameraIds: (value: number[]) =>
    set(state => {
      return { ...state, cameraIds: value }
    }),
  clear: () =>
    set(() => {
      return defaultValue
    })
}))

const Index: FC = ({}): React.ReactElement => {
  return <></>
}

export default Index
