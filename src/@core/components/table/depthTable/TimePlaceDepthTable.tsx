import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { FC, useContext } from 'react'
import { ICountBarTable } from 'src/model/statistics/StatisticsModel'
import DividerBar from '../../atom/DividerBar'
import CustomTable from '../CustomTable'
import { TableContext } from './DepthTable'

interface TimePlaceDepthTableProps {
  data: ICountBarTable
  columns: GridColDef[]
  columns2: GridColDef[]
}

const TimePlaceDepthTable: FC<TimePlaceDepthTableProps> = ({ data, columns, columns2 }) => {
  const { expandedRows } = useContext(TableContext)

  const checkDataListDepth = (obj: any, depth = 0): number => {
    if (!obj || !obj.dataList || !Array.isArray(obj.dataList) || obj.dataList.length === 0) {
      return depth
    }

    return checkDataListDepth(obj.dataList[0], depth + 1)
  }

  const renderDetailPanel = (row: any) => {
    return (
      <>
        {row.dataList.map((row: any, index: number) => (
          <Box key={`${row.dateName}-${row.totalPlaceName}-${index}`}>
            <CustomTable columns={columns} rows={[row]} isAllView showHeader={false} />
            <DividerBar />
            {expandedRows.includes(`${row.dateName}-${row.totalPlaceName}-${row.totalInCount}-${row.totalOutCount}`) &&
              renderDetailPanel2(row.dataList)}
          </Box>
        ))}
      </>
    )
  }

  const renderDetailPanel2 = (row: any) => {
    return (
      <>
        <CustomTable columns={columns2} rows={row} isAllView showHeader={false} />
        <DividerBar />
      </>
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

export default TimePlaceDepthTable
