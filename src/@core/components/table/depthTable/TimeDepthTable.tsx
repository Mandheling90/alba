import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { FC, useContext } from 'react'
import { ITableData } from 'src/model/statistics/StatisticsModel'
import DividerBar from '../../atom/DividerBar'
import CustomTable from '../CustomTable'
import { TableContext } from './VisitorDepthTable'

interface TimeDepthTableProps {
  data: ITableData
  columns: GridColDef[]
}

const TimeDepthTable: FC<TimeDepthTableProps> = ({ data, columns }) => {
  const { expandedRows } = useContext(TableContext)

  const checkDataListDepth = (obj: any, depth = 0): number => {
    if (!obj || !obj.dataList || !Array.isArray(obj.dataList) || obj.dataList.length === 0) {
      return depth
    }

    return checkDataListDepth(obj.dataList[0], depth + 1)
  }

  const renderDetailPanel = (row: any) => {
    return (
      <Box>
        <CustomTable columns={columns} rows={row.dataList} isAllView showHeader={false} />
        <DividerBar />
      </Box>
    )
  }

  return (
    <>
      {data.dataList.map((row, index) => (
        <Box key={row.dateName}>
          <CustomTable
            id='dateName'
            columns={columns}
            rows={[data.dataList[index]]}
            isAllView
            showHeader={index === 0}
          />
          <DividerBar />
          {expandedRows.includes(`${row.dateName}-${row.totalPlaceName}-${row.totalInCount}-${row.totalOutCount}`) &&
            renderDetailPanel(row)}
        </Box>
      ))}
    </>
  )
}

export default TimeDepthTable
