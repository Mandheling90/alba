import { Box, IconButton } from '@mui/material'
import { FC, useState } from 'react'

import { ETableDisplayType, ETableType } from 'src/context/StatisticsContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { ITableData } from 'src/model/statistics/StatisticsModel'
import { generateColumns } from '../columns/columnGenerator'
import CustomTable from '../CustomTable'
import OneDepthTable from './OneDepthTable'
import TimePlaceDepthTable from './TimePlaceDepthTable'

interface DepthTableProps {
  tableType: ETableType
  tableDisplayType: ETableDisplayType
  data: ITableData
}

const VisitorDepthTable: FC<DepthTableProps> = ({ tableType, tableDisplayType, data }) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([])

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

  const getColumns = () => {
    switch (tableType) {
      case ETableType.HOURLY:
        return generateColumns({
          columns: [
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
            { field: 'totalInCount', headerName: '입장객', type: 'number' },
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' }
          ],
          customRenderers: {
            dateName: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return tableDisplayType === 'time' ? (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  {depth === 2 && (
                    <>
                      <Box sx={{ position: 'absolute', left: 0 }}>
                        <IconButton
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            toggleRow(params.row.key)
                          }}
                        >
                          {depth === 2 && (
                            <IconCustom
                              isCommon
                              path='table'
                              icon={expandedRows.includes(params.row.key) ? 'unfolding' : 'folding'}
                            />
                          )}
                        </IconButton>
                      </Box>
                      <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                    </>
                  )}
                </Box>
              ) : (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  <Box sx={{ position: 'absolute', left: depth === 2 ? 0 : 30 }}>
                    <IconButton
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        toggleRow(params.row.key)
                      }}
                    >
                      <IconCustom
                        isCommon
                        path='table'
                        icon={expandedRows.includes(params.row.key) ? 'unfolding' : 'folding'}
                      />
                    </IconButton>
                  </Box>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                </Box>
              )
            },
            dateNameTemp: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return (
                <>
                  {tableDisplayType === 'time' && depth === 1 && (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
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
              field: `dateName`,
              headerName: `${tableDisplayType === 'time' ? '날짜' : '날짜 및 시간대'}`,
              type: 'string'
            },
            {
              field: `${tableDisplayType === 'time' ? 'dateNameTemp' : 'totalPlaceName'}`,
              headerName: `${tableDisplayType === 'time' ? '시간대' : '장소'}`,
              type: 'string'
            },
            { field: 'totalInCount', headerName: '입장객', type: 'number' },
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' },
            { field: 'morningWeather', headerName: '날씨', type: 'string' },
            { field: 'morningTemperature', headerName: '기온', type: 'string' },
            { field: 'dust', headerName: '미세먼지', type: 'string' }
          ],
          customRenderers: {
            dateName: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return tableDisplayType === 'time' ? (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  {depth === 2 && (
                    <>
                      <Box sx={{ position: 'absolute', left: 0 }}>
                        <IconButton
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            toggleRow(params.row.key)
                          }}
                        >
                          {depth === 2 && (
                            <IconCustom
                              isCommon
                              path='table'
                              icon={expandedRows.includes(params.row.key) ? 'unfolding' : 'folding'}
                            />
                          )}
                        </IconButton>
                      </Box>
                      <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                    </>
                  )}
                </Box>
              ) : (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  <Box sx={{ position: 'absolute', left: depth === 2 ? 0 : 30 }}>
                    <IconButton
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        toggleRow(params.row.key)
                      }}
                    >
                      <IconCustom
                        isCommon
                        path='table'
                        icon={expandedRows.includes(params.row.key) ? 'unfolding' : 'folding'}
                      />
                    </IconButton>
                  </Box>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                </Box>
              )
            },
            dateNameTemp: (params: any) => {
              const depth = checkDataListDepth(params.row)

              return (
                <>
                  {tableDisplayType === 'time' && depth === 1 && (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
                  )}
                </>
              )
            }
          }
        })
      case ETableType.WEEKDAY:
        return generateColumns({
          columns: [
            { field: 'weekDayName', headerName: '요일', type: 'string' },
            { field: 'totalInCount', headerName: '입장객', type: 'number' },
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' }
          ]
        })
      case ETableType.WEEKLY:
        return generateColumns({
          columns: [
            { field: 'weekName', headerName: '주별기간', type: 'string' },
            { field: 'totalInCount', headerName: '입장객', type: 'number' },
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' }
          ]
        })
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [
            { field: 'dateName', headerName: '날짜', type: 'string' },
            { field: 'totalInCount', headerName: '입장객', type: 'number' },
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' }
          ]
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
            { field: 'temp', headerName: '', type: 'string' },
            { field: 'placeName', headerName: '장소 이름', type: 'string' },
            { field: 'inCount', headerName: '입장객', type: 'number' },
            { field: 'outCount', headerName: '퇴장객', type: 'number' }
          ],
          customRenderers: {
            temp: (params: any) => {
              return <></>
            }
          }
        })
      case ETableType.DAILY:
        return generateColumns({
          columns: [
            { field: 'temp', headerName: '', type: 'string' },
            { field: 'placeName', headerName: '', type: 'string' },
            { field: 'inCount', headerName: '입장객', type: 'number' },
            { field: 'outCount', headerName: '퇴장객', type: 'number' },
            { field: 'morningWeather', headerName: '날씨', type: 'string' },
            { field: 'morningTemperature', headerName: '기온', type: 'string' },
            { field: 'dust', headerName: '미세먼지', type: 'string' }
          ],
          customRenderers: {
            temp: (params: any) => {
              return <></>
            }
          }
        })
      case ETableType.WEEKLY:
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [
            { field: 'dateName', headerName: '날짜', type: 'string' },
            { field: 'totalInCount', headerName: '입장객', type: 'number' },
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' }
          ]
        })
      default:
        return []
    }
  }

  const columns = getColumns()
  const columns2 = getColumns2()

  // data.tableHeaders에 "입장객" 또는 "퇴장객"이 없는 경우 해당 컬럼 제외
  const filteredColumns = columns.filter(
    column =>
      (column.field !== 'totalInCount' && column.field !== 'totalOutCount') ||
      (column.field === 'totalInCount' && data.tableHeaders?.includes('입장객')) ||
      (column.field === 'totalOutCount' && data.tableHeaders?.includes('퇴장객'))
  )
  const filteredColumns2 = columns2.filter(
    column =>
      (column.field !== 'inCount' &&
        column.field !== 'outCount' &&
        column.field !== 'totalInCount' &&
        column.field !== 'totalOutCount') ||
      (column.field === 'inCount' && data.tableHeaders?.includes('입장객')) ||
      (column.field === 'outCount' && data.tableHeaders?.includes('퇴장객')) ||
      (column.field === 'totalInCount' && data.tableHeaders?.includes('입장객')) ||
      (column.field === 'totalOutCount' && data.tableHeaders?.includes('퇴장객'))
  )

  return (
    <>
      {tableType === ETableType.WEEKDAY || tableType === ETableType.WEEKLY ? (
        <CustomTable columns={filteredColumns} rows={data.dataList} isAllView />
      ) : tableDisplayType === ETableDisplayType.TIME_PLACE ? (
        <TimePlaceDepthTable
          data={data}
          columns={filteredColumns}
          columns2={filteredColumns2}
          expandedRows={expandedRows}
        />
      ) : (
        <OneDepthTable data={data} columns={filteredColumns} expandedRows={expandedRows} />
      )}
    </>
  )
}

export default VisitorDepthTable
