import { Box, IconButton } from '@mui/material'
import { FC, createContext, useState } from 'react'

import IconCustom from 'src/layouts/components/IconCustom'
import { ICountBarTable } from 'src/model/statistics/StatisticsModel'
import { generateColumns } from '../columns/columnGenerator'
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
  tableType: 'hourly' | 'daily' | 'weekly' | 'monthly'
  tableDisplayType: 'time' | 'timePlace'
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
      case 'hourly':
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
      case 'daily':
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
      case 'weekly':
      case 'monthly':
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
      case 'hourly':
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
      case 'daily':
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
      case 'weekly':
      case 'monthly':
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
      {tableDisplayType === 'timePlace' ? (
        <TimePlaceDepthTable data={data} columns={columns} columns2={columns2} />
      ) : (
        <TimeDepthTable data={data} columns={columns} />
      )}
    </TableContext.Provider>
  )
}

export default DepthTable
