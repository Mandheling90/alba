import { Box } from '@mui/material'
import { FC, useState } from 'react'

import { ETableDisplayType, ETableType } from 'src/context/StatisticsContext'
import { IAgeGenderStatisticsTableResponse, ITableHeaders } from 'src/model/statistics/StatisticsModel'
import { generateColumns } from '../columns/columnGenerator'
import CustomTable from '../CustomTable'
import OneDepthTable from './OneDepthTable'
import TimePlaceDepthTable from './TimePlaceDepthTable'
import ToggleButton from './ToggleButton'

interface DepthTableProps {
  tableType: ETableType
  tableDisplayType: ETableDisplayType
  data: IAgeGenderStatisticsTableResponse
}

const VisitorAttributesDepthTable: FC<DepthTableProps> = ({ tableType, tableDisplayType, data }) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const getTableTopHeaders = (headers: ITableHeaders[], defaultFlex = false, firstFlex = 0.7) => {
    return (
      headers?.map((header: ITableHeaders, index: number) => ({
        field: header.field,
        headerName: header.headerName,
        type: 'string' as const,
        flex: defaultFlex ? 1 : index === 0 ? firstFlex : index === 3 ? 0.6 : 1.5,
        isEmpty: true
      })) || []
    )
  }

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

  const tableTopHeaders = getTableTopHeaders(
    (data.tableHeaders || []).map(header =>
      typeof header === 'string' ? { field: header, headerName: header } : header
    ),
    true
  )

  const toggleFlex = 0.4
  const weatherFlex = 1.2

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
              headerName: `${
                tableDisplayType === 'time'
                  ? tableType === ETableType.HOURLY
                    ? '날짜'
                    : tableType === ETableType.DAILY
                    ? '년도 및 월'
                    : '년도'
                  : tableType === ETableType.HOURLY
                  ? '날짜 및 시간대'
                  : tableType === ETableType.DAILY
                  ? '날짜'
                  : '년도 및 월'
              }`,
              type: 'string',
              flex: 1.5
            },
            {
              field: `${tableDisplayType === 'time' ? 'dateNameTemp' : 'totalPlaceName'}`,
              headerName: `${
                tableDisplayType === 'time'
                  ? tableType === ETableType.HOURLY
                    ? '시간대'
                    : tableType === ETableType.DAILY
                    ? '날짜'
                    : '월'
                  : '장소'
              }`,
              type: 'string',
              flex: 1.5
            },
            ...tableTopHeaders,
            { field: 'totalCount', headerName: '계', type: 'number' }
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
            ...tableTopHeaders,
            { field: 'totalCount', headerName: '계', type: 'number' }
          ]
        })
      case ETableType.WEEKLY:
        return generateColumns({
          columns: [
            { field: 'weekName', headerName: '주별기간', type: 'string' },
            ...tableTopHeaders,
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
            { field: 'temp1', headerName: '', type: 'string', isEmpty: true },
            { field: 'temp2', headerName: '', type: 'string', flex: 1.5, isEmpty: true },
            { field: 'placeName', headerName: '장소', type: 'string' },
            ...tableTopHeaders,
            { field: 'totalCount', headerName: '계', type: 'number' }
          ]
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
          columns: getTableTopHeaders(data.tableTopHeaders || [], false, 0.7)
        })
      case ETableType.WEEKDAY:
      case ETableType.WEEKLY:
        return generateColumns({
          columns: getTableTopHeaders(data.tableTopHeaders || [], false, 0.2)
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
