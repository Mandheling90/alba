import { Box, IconButton } from '@mui/material'
import { FC, createContext, useState } from 'react'

import { ETableDisplayType, ETableType } from 'src/context/StatisticsContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICountBarTable } from 'src/model/statistics/StatisticsModel'
import { generateColumns } from '../columns/columnGenerator'
import CustomTable from '../CustomTable'
import TimeDepthTable from './TimeDepthTable'
import TimePlaceDepthTable from './TimePlaceDepthTable'

interface TableContextType {
  expandedRows: string[]
  toggleRow: (key: string) => void
}

export const TableContext = createContext<TableContextType>({
  expandedRows: [],
  toggleRow: (key: string) => key
})

interface DepthTableProps {
  tableType: ETableType
  tableDisplayType: ETableDisplayType
  data: ICountBarTable
}

const DepthTable: FC<DepthTableProps> = ({ tableType, tableDisplayType, data }) => {
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
              const key = `${params.row.dateName}-${params.row.totalPlaceName}-${params.row.totalInCount}-${params.row.totalOutCount}`

              return tableDisplayType === 'time' ? (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  {depth === 2 && (
                    <>
                      <Box sx={{ position: 'absolute', left: 0 }}>
                        <IconButton
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            toggleRow(key)
                          }}
                        >
                          {depth === 2 && (
                            <IconCustom
                              isCommon
                              path='table'
                              icon={expandedRows.includes(key) ? 'unfolding' : 'folding'}
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
                        toggleRow(key)
                      }}
                    >
                      <IconCustom isCommon path='table' icon={expandedRows.includes(key) ? 'unfolding' : 'folding'} />
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
            { field: 'totalOutCount', headerName: '퇴장객', type: 'number' }
          ],
          customRenderers: {
            dateName: (params: any) => {
              const depth = checkDataListDepth(params.row)
              const key = `${params.row.dateName}-${params.row.totalPlaceName}-${params.row.totalInCount}-${params.row.totalOutCount}`

              return tableDisplayType === 'time' ? (
                <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                  {depth === 2 && (
                    <>
                      <Box sx={{ position: 'absolute', left: 0 }}>
                        <IconButton
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            toggleRow(key)
                          }}
                        >
                          {depth === 2 && (
                            <IconCustom
                              isCommon
                              path='table'
                              icon={expandedRows.includes(key) ? 'unfolding' : 'folding'}
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
                        toggleRow(key)
                      }}
                    >
                      <IconCustom isCommon path='table' icon={expandedRows.includes(key) ? 'unfolding' : 'folding'} />
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

  return (
    <TableContext.Provider value={{ expandedRows, toggleRow }}>
      {tableType === ETableType.WEEKDAY || tableType === ETableType.WEEKLY ? (
        <CustomTable columns={columns} rows={data.dataList} isAllView />
      ) : tableDisplayType === ETableDisplayType.TIME_PLACE ? (
        <TimePlaceDepthTable data={data} columns={columns} columns2={columns2} />
      ) : (
        <TimeDepthTable data={data} columns={columns} />
      )}
    </TableContext.Provider>
  )
}

export default DepthTable
