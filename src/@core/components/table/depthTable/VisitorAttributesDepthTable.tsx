import { Box, IconButton } from '@mui/material'
import { FC, useState } from 'react'

import { ETableDisplayType, ETableType } from 'src/context/StatisticsContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { IAgeGenderStatisticsTableResponse } from 'src/model/statistics/StatisticsModel'
import { generateColumns } from '../columns/columnGenerator'
import CustomTable from '../CustomTable'
import OneDepthTable from './OneDepthTable'
import TimePlaceDepthTable from './TimePlaceDepthTable'

interface DepthTableProps {
  tableType: ETableType
  tableDisplayType: ETableDisplayType
  data: IAgeGenderStatisticsTableResponse
}

const VisitorAttributesDepthTable: FC<DepthTableProps> = ({ tableType, tableDisplayType, data }) => {
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
    if (!obj || !obj.dataList || !Array.isArray(obj.dataList)) {
      return depth
    }

    return checkDataListDepth(obj.dataList[0], depth + 1)
  }

  const getColumns = () => {
    switch (tableType) {
      case ETableType.HOURLY:
      case ETableType.DAILY:
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [
            {
              field: `toggle`,
              headerName: ``,
              type: 'string'
            },
            {
              field: `dateName`,
              headerName: `${tableDisplayType === 'time' ? '날짜' : '날짜 및 시간대'}`,
              type: 'string',
              flex: 1.5
            },
            {
              field: `${tableDisplayType === 'time' ? 'dateNameTemp' : 'totalPlaceName'}`,
              headerName: `${tableDisplayType === 'time' ? '시간대' : '장소'}`,
              type: 'string'
            },
            { field: 'totalM0', headerName: '10대이하', type: 'number' },
            { field: 'totalM10', headerName: '10대', type: 'number' },
            { field: 'totalM20', headerName: '20대', type: 'number' },
            { field: 'totalM30', headerName: '30대', type: 'number' },
            { field: 'totalM40', headerName: '40대', type: 'number' },
            { field: 'totalM50', headerName: '50대', type: 'number' },
            { field: 'totalM60', headerName: '60대이상', type: 'number' },
            { field: 'totalF0', headerName: '10대이하', type: 'number' },
            { field: 'totalF10', headerName: '10대', type: 'number' },
            { field: 'totalF20', headerName: '20대', type: 'number' },
            { field: 'totalF30', headerName: '30대', type: 'number' },
            { field: 'totalF40', headerName: '40대', type: 'number' },
            { field: 'totalF50', headerName: '50대', type: 'number' },
            { field: 'totalF60', headerName: '60대이상', type: 'number' },
            { field: 'totalManCount', headerName: '남자', type: 'number' },
            { field: 'totalWomanCount', headerName: '여자', type: 'number' },
            { field: 'totalCount', headerName: '계', type: 'number' }
          ],
          customRenderers: {
            toggle: (params: any) => {
              const depth = checkDataListDepth(params.row)

              if (tableDisplayType === 'time' && depth === 1) {
                return <></>
              }

              return (
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
                </Box>
              )
            },
            dateName: (params: any) => {
              const depth = checkDataListDepth(params.row)

              if (tableDisplayType === 'time' && depth === 1) {
                return <></>
              }

              return <Box sx={{ width: '100%', textAlign: 'center' }}>{params.row.dateName}</Box>
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
            { field: 'totalM0', headerName: '10대이하', type: 'number' },
            { field: 'totalM10', headerName: '10대', type: 'number' },
            { field: 'totalM20', headerName: '20대', type: 'number' },
            { field: 'totalM30', headerName: '30대', type: 'number' },
            { field: 'totalM40', headerName: '40대', type: 'number' },
            { field: 'totalM50', headerName: '50대', type: 'number' },
            { field: 'totalM60', headerName: '60대이상', type: 'number' },
            { field: 'totalF0', headerName: '10대이하', type: 'number' },
            { field: 'totalF10', headerName: '10대', type: 'number' },
            { field: 'totalF20', headerName: '20대', type: 'number' },
            { field: 'totalF30', headerName: '30대', type: 'number' },
            { field: 'totalF40', headerName: '40대', type: 'number' },
            { field: 'totalF50', headerName: '50대', type: 'number' },
            { field: 'totalF60', headerName: '60대이상', type: 'number' },
            { field: 'totalManCount', headerName: '남자', type: 'number' },
            { field: 'totalWomanCount', headerName: '여자', type: 'number' },
            { field: 'totalCount', headerName: '계', type: 'number' }
          ]
        })
      case ETableType.WEEKLY:
        return generateColumns({
          columns: [
            { field: 'weekName', headerName: '주별기간', type: 'string' },
            { field: 'totalM0', headerName: '10대이하', type: 'number' },
            { field: 'totalM10', headerName: '10대', type: 'number' },
            { field: 'totalM20', headerName: '20대', type: 'number' },
            { field: 'totalM30', headerName: '30대', type: 'number' },
            { field: 'totalM40', headerName: '40대', type: 'number' },
            { field: 'totalM50', headerName: '50대', type: 'number' },
            { field: 'totalM60', headerName: '60대이상', type: 'number' },
            { field: 'totalF0', headerName: '10대이하', type: 'number' },
            { field: 'totalF10', headerName: '10대', type: 'number' },
            { field: 'totalF20', headerName: '20대', type: 'number' },
            { field: 'totalF30', headerName: '30대', type: 'number' },
            { field: 'totalF40', headerName: '40대', type: 'number' },
            { field: 'totalF50', headerName: '50대', type: 'number' },
            { field: 'totalF60', headerName: '60대이상', type: 'number' },
            { field: 'totalManCount', headerName: '남자', type: 'number' },
            { field: 'totalWomanCount', headerName: '여자', type: 'number' },
            { field: 'totalCount', headerName: '계', type: 'number' }
          ]
        })
      default:
        return []
    }
  }

  const getColumns2 = () => {
    switch (tableType) {
      case ETableType.HOURLY:
      case ETableType.DAILY:
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [
            { field: 'temp1', headerName: '', type: 'string' },
            { field: 'temp2', headerName: '', type: 'string', flex: 1.5 },
            { field: 'placeName', headerName: '장소', type: 'string' },
            { field: 'm0', headerName: '10대이하', type: 'number' },
            { field: 'm10', headerName: '10대', type: 'number' },
            { field: 'm20', headerName: '20대', type: 'number' },
            { field: 'm30', headerName: '30대', type: 'number' },
            { field: 'm40', headerName: '40대', type: 'number' },
            { field: 'm50', headerName: '50대', type: 'number' },
            { field: 'm60', headerName: '60대이상', type: 'number' },
            { field: 'f0', headerName: '10대이하', type: 'number' },
            { field: 'f10', headerName: '10대', type: 'number' },
            { field: 'f20', headerName: '20대', type: 'number' },
            { field: 'f30', headerName: '30대', type: 'number' },
            { field: 'f40', headerName: '40대', type: 'number' },
            { field: 'f50', headerName: '50대', type: 'number' },
            { field: 'f60', headerName: '60대이상', type: 'number' },
            { field: 'totalManCount', headerName: '남자', type: 'number' },
            { field: 'totalWomanCount', headerName: '여자', type: 'number' },
            { field: 'totalCount', headerName: '계', type: 'number' }
          ],
          customRenderers: {
            temp1: (params: any) => {
              return <></>
            },
            temp2: (params: any) => {
              return <></>
            }
          }
        })
      default:
        return []
    }
  }

  const getColumns3 = () => {
    switch (tableType) {
      case ETableType.HOURLY:
      case ETableType.DAILY:
      case ETableType.MONTHLY:
        return generateColumns({
          columns: [
            { field: 'temp1', headerName: '통계날짜', type: 'string', flex: 0.7 },
            { field: 'temp2', headerName: '남자', type: 'string', flex: 1.5 },
            { field: 'temp3', headerName: '여자', type: 'string', flex: 1.5 },
            { field: 'temp4', headerName: '합계', type: 'string', flex: 0.6 }
          ],
          customRenderers: {
            temp1: (params: any) => {
              return <></>
            },
            temp2: (params: any) => {
              return <></>
            },
            temp3: (params: any) => {
              return <></>
            },
            temp4: (params: any) => {
              return <></>
            }
          }
        })
      case ETableType.WEEKDAY:
      case ETableType.WEEKLY:
        return generateColumns({
          columns: [
            { field: 'temp1', headerName: '통계날짜', type: 'string', flex: 0.2 },
            { field: 'temp2', headerName: '남자', type: 'string', flex: 1.5 },
            { field: 'temp3', headerName: '여자', type: 'string', flex: 1.5 },
            { field: 'temp4', headerName: '합계', type: 'string', flex: 0.6 }
          ],
          customRenderers: {
            temp1: (params: any) => {
              return <></>
            },
            temp2: (params: any) => {
              return <></>
            },
            temp3: (params: any) => {
              return <></>
            },
            temp4: (params: any) => {
              return <></>
            }
          }
        })
      default:
        return []
    }
  }

  const columns = getColumns()
  const columns2 = getColumns2()
  const coverColumns = getColumns3()

  return (
    <>
      <CustomTable columns={coverColumns} rows={[]} isAllView hideRows />

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

export default VisitorAttributesDepthTable
