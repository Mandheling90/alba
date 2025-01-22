import { format } from 'date-fns'
import { ReactNode, createContext, useState } from 'react'
import { MContent } from 'src/model/contents/contentsModel'
import { IChartProps, ISelectedColorList } from 'src/model/statistics/StatisticsModel'

export type StatisticsValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void

  errors: Partial<Record<keyof MContent, string>>
  setErrors: (errors: Partial<Record<keyof MContent, string>>) => void

  chartProps: IChartProps
  setChartProps: (chartProps: IChartProps) => void

  chartType: 'crowd' | 'smoking'
  setChartType: (chartType: 'crowd' | 'smoking') => void

  groupSetting: boolean
  setGroupSetting: (groupSetting: boolean) => void

  selectedIds: number[]
  setSelectedIds: (selectedIds: number[]) => void
  selectedColorList: ISelectedColorList[]
  setSelectedColorList: (selectedColorList: ISelectedColorList[]) => void

  range: number[]
  setRange: (range: number[]) => void

  // handleSetExtremes: (min: number, max: number) => void

  clear: () => void

  requiredFields: 'date' | null
  setRequiredFields: (requiredFields: 'date' | null) => void

  // getNextChartColor: (index: number) => string
}

// ** Defaults
const defaultProvider: StatisticsValuesType = {
  loading: true,
  setLoading: () => Boolean,

  errors: {},
  setErrors: () => null,

  chartProps: { rangeSelectorIndex: 1, time: 'hour', isGroup: true, isChartSetting: true, endDate: '', startDate: '' },
  setChartProps: () => null,

  chartType: 'crowd',
  setChartType: () => null,

  selectedIds: [],
  setSelectedIds: () => null,
  selectedColorList: [],
  setSelectedColorList: () => null,

  range: [],
  setRange: () => null,

  // handleSetExtremes: (min: number, max: number) => null,

  groupSetting: false,
  setGroupSetting: () => null,

  clear: () => null,

  requiredFields: null,
  setRequiredFields: () => null

  // getNextChartColor: (index: number) => '#000000'
}

const StatisticsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const StatisticsProvider = ({ children }: Props) => {
  const today = format(new Date(), 'yyyy-MM-dd')

  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({})

  const [chartProps, setChartProps] = useState({ ...defaultProvider.chartProps, startDate: today, endDate: today })
  const [chartType, setChartType] = useState(defaultProvider.chartType)
  const [selectedIds, setSelectedIds] = useState(defaultProvider.selectedIds)
  const [range, setRange] = useState(defaultProvider.range)
  const [groupSetting, setGroupSetting] = useState(defaultProvider.groupSetting)
  const [requiredFields, setRequiredFields] = useState(defaultProvider.requiredFields)

  const [selectedColorList, setSelectedColorList] = useState<ISelectedColorList[]>([])

  const clear = () => {
    setChartProps({ ...defaultProvider.chartProps, startDate: today, endDate: today })
    setSelectedIds(defaultProvider.selectedIds)
    setSelectedColorList([])
    setRange(defaultProvider.range)
  }

  // const handleSetExtremes = (min: number, max: number) => {
  //   // 현재 상태와 새로운 값이 동일한 경우 상태 업데이트를 피함
  //   if (range[0] !== min || range[1] !== max) {
  //     setRange([min, max])
  //   }
  // }

  // const getNextChartColor = (index: number): string => {
  //   const availableColors = chartColorList.filter(color => !selectedColorList.includes(color))

  //   return availableColors[index] ?? '#000000'
  // }

  const values: StatisticsValuesType = {
    loading,
    setLoading,
    errors,
    setErrors,
    chartProps,
    setChartProps,
    chartType,
    setChartType,
    selectedIds,
    setSelectedIds,
    selectedColorList,
    setSelectedColorList,
    range,
    setRange,

    // handleSetExtremes,
    groupSetting,
    setGroupSetting,
    clear,
    requiredFields,
    setRequiredFields

    // getNextChartColor
  }

  return <StatisticsContext.Provider value={values}>{children}</StatisticsContext.Provider>
}

export { StatisticsContext, StatisticsProvider }
