import { Box, Typography, useTheme } from '@mui/material'
import { FC, useState } from 'react'

import { ETableDisplayType, ETableType } from 'src/context/StatisticsContext'
import { ITableData } from 'src/model/statistics/StatisticsModel'
import { generateColumns } from '../columns/columnGenerator'
import CustomTable from '../CustomTable'
import OneDepthTable from './OneDepthTable'
import TimePlaceDepthTable from './TimePlaceDepthTable'
import ToggleButton from './ToggleButton'

interface DepthTableProps {
  tableType: ETableType
  tableDisplayType: ETableDisplayType
  data: ITableData
}

const WeatherRenderer = ({ morning, after }: { morning?: string; after?: string }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'column', xl: 'row' },
        justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'center', xl: 'space-between' },
        alignItems: 'center'
      }}
    >
      {morning && (
        <Typography
          fontSize={12}
          sx={{
            whiteSpace: 'nowrap',
            opacity: 0.9,
            [`@media (min-width:${theme.breakpoints.values.xl}px)`]: {
              fontSize: 14
            }
          }}
        >
          오전 : {morning}
        </Typography>
      )}
      {after && (
        <Typography
          fontSize={12}
          sx={{
            whiteSpace: 'nowrap',
            opacity: 0.9,
            [`@media (min-width:${theme.breakpoints.values.xl}px)`]: {
              fontSize: 14
            }
          }}
        >
          오후 : {after}
        </Typography>
      )}
    </Box>
  )
}

const VisitorDepthTable: FC<DepthTableProps> = ({ tableType, tableDisplayType, data }) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const theme = useTheme()

  const toggleRow = (key: string) => {
    setExpandedRows(prev => {
      if (prev.includes(key)) {
        return prev.filter(row => row !== key)
      } else {
        return [...prev, key]
      }
    })
  }

  const checkDataListDepth = (obj: any, depth = 0): number => {
    if (!obj || !obj.dataList || !Array.isArray(obj.dataList) || obj.dataList.length === 0) {
      return depth
    }

    return checkDataListDepth(obj.dataList[0], depth + 1)
  }

  const defaultColumns = [
    { field: 'inCount', headerName: '입장객', type: 'number' as const },
    { field: 'outCount', headerName: '퇴장객', type: 'number' as const }
  ].filter(column => {
    if (Array.isArray(data.tableHeaders)) {
      return data.tableHeaders.some(header =>
        typeof header === 'string' ? header === column.headerName : header.headerName === column.headerName
      )
    }

    return false
  })

  const toggleFlex = 0.4
  const weatherFlex = 1.2

  const getColumns = () => {
    switch (tableType) {
      case ETableType.HOURLY:
        return generateColumns({
          columns: [
            {
              field: `toggle`,
              headerName: ``,
              type: 'string',
              flex: toggleFlex
            },
            {
              field: `dateName`,
              headerName: `${tableDisplayType === 'time' ? '날짜' : '날짜 및 시간대'}`,
              type: 'string'
            },
            {
              field: `${tableDisplayType === 'time' ? 'dateNameTemp' : 'totalPlaceName'}`,
              headerName: `${tableDisplayType === 'time' ? '시간대' : '장소'}`,
              type: 'string'
            },
            ...defaultColumns
          ],
          customRenderers: {
            toggle: (params: any) => {
              const depth = checkDataListDepth(params.row)

              if (tableDisplayType === 'time' && depth === 1) {
                return <></>
              }

              return (
                <ToggleButton
                  depth={depth}
                  isExpanded={expandedRows.includes(params.row.key)}
                  onToggle={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    toggleRow(params.row.key)
                  }}
                />
              )
            },
            dateName: (params: any) => {
              const depth = checkDataListDepth(params.row)

              if (depth === 1 && tableDisplayType === 'time') {
                return <></>
              }

              return <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
            },
            dateNameTemp: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return (
                <>
                  {tableDisplayType === 'time' && depth === 1 ? (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                  ) : (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateLabel}</Box>
                  )}
                </>
              )
            }
          }
        })
      case ETableType.DAILY:
        return generateColumns({
          columns: [
            {
              field: `toggle`,
              headerName: ``,
              type: 'string',
              flex: toggleFlex
            },
            {
              field: `dateName`,
              headerName: `${tableDisplayType === 'time' ? '날짜' : '날짜 및 시간대'}`,
              type: 'string'
            },
            {
              field: `${tableDisplayType === 'time' ? 'dateNameTemp' : 'totalPlaceName'}`,
              headerName: `${tableDisplayType === 'time' ? '시간대' : '장소'}`,
              type: 'string'
            },
            ...defaultColumns,
            { field: 'weather', headerName: '날씨', type: 'string', flex: weatherFlex },
            { field: 'temperature', headerName: '기온', type: 'string', flex: weatherFlex },
            {
              field: 'dust',
              headerName: '미세먼지(μg/m³)',
              type: 'string',
              flex: weatherFlex,
              renderHeader: () => (
                <span
                  style={{
                    fontFamily: 'Arial Unicode MS, sans-serif',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    color: 'rgba(58, 53, 65, 0.87)'
                  }}
                >
                  미세먼지(μg/m³)
                </span>
              )
            }
          ],
          customRenderers: {
            toggle: (params: any) => {
              const depth = checkDataListDepth(params.row)

              if (tableDisplayType === 'time' && depth === 1) {
                return <></>
              }

              return (
                <ToggleButton
                  depth={depth}
                  isExpanded={expandedRows.includes(params.row.key)}
                  onToggle={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    toggleRow(params.row.key)
                  }}
                />
              )
            },
            dateName: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return tableDisplayType === 'time' ? (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  {depth === 2 && <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>}
                </Box>
              ) : (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  <Box sx={{ position: 'absolute' }}></Box>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                </Box>
              )
            },
            dateNameTemp: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return (
                <>
                  {tableDisplayType === 'time' && depth === 1 ? (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                  ) : (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateLabel}</Box>
                  )}
                </>
              )
            },
            weather: (params: any) => {
              return <WeatherRenderer morning={params.row.morningWeather} after={params.row.afterWeather} />
            },
            temperature: (params: any) => {
              return <WeatherRenderer morning={params.row.morningTemperature} after={params.row.afterTemperature} />
            },
            dust: (params: any) => {
              return <WeatherRenderer morning={params.row.morningDust} after={params.row.afterDust} />
            }
          }
        })
      case ETableType.WEEKDAY:
        return generateColumns({
          columns: [{ field: 'weekDayName', headerName: '요일', type: 'string' }, ...defaultColumns]
        })
      case ETableType.WEEKLY:
        return generateColumns({
          columns: [{ field: 'weekName', headerName: '주별기간', type: 'string' }, ...defaultColumns]
        })
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [{ field: 'dateName', headerName: '날짜', type: 'string' }, ...defaultColumns]
        })
      default:
        return []
    }
  }

  const getColumns2 = () => {
    switch (tableType) {
      case ETableType.HOURLY:
        return generateColumns({
          columns: [
            { field: 'temp1', headerName: '', type: 'string', flex: toggleFlex, isEmpty: true },
            { field: 'temp2', headerName: '', type: 'string', isEmpty: true },
            { field: 'placeName', headerName: '장소 이름', type: 'string' },
            ...defaultColumns
          ]
        })
      case ETableType.DAILY:
        return generateColumns({
          columns: [
            { field: 'temp1', headerName: '', type: 'string', flex: toggleFlex, isEmpty: true },
            { field: 'temp2', headerName: '', type: 'string', isEmpty: true },
            { field: 'placeName', headerName: '', type: 'string' },
            ...defaultColumns,
            { field: 'weather', headerName: '날씨', type: 'string', flex: weatherFlex },
            { field: 'temperature', headerName: '기온', type: 'string', flex: weatherFlex },
            { field: 'dust', headerName: '미세먼지(μg/m³)', type: 'string', flex: weatherFlex }
          ],
          customRenderers: {
            weather: (params: any) => {
              return <WeatherRenderer morning={params.row.morningWeather} after={params.row.afterWeather} />
            },
            temperature: (params: any) => {
              return <WeatherRenderer morning={params.row.morningTemperature} after={params.row.afterTemperature} />
            },
            dust: (params: any) => {
              return <WeatherRenderer morning={params.row.morningDust} after={params.row.afterDust} />
            }
          }
        })
      case ETableType.WEEKLY:
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [{ field: 'dateName', headerName: '날짜', type: 'string' }, ...defaultColumns]
        })
      default:
        return []
    }
  }

  const columns = getColumns()
  const columns2 = getColumns2()

  return (
    <>
      {tableType === ETableType.WEEKDAY || tableType === ETableType.WEEKLY ? (
        <CustomTable columns={columns} rows={data.dataList} isAllView />
      ) : tableDisplayType === ETableDisplayType.TIME_PLACE ? (
        <TimePlaceDepthTable data={data} columns={columns} columns2={columns2} expandedRows={expandedRows} />
      ) : (
        <OneDepthTable data={data} columns={columns} expandedRows={expandedRows} />
      )}
    </>
  )
}

export default VisitorDepthTable
