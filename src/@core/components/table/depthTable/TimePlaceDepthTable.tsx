import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { FC } from 'react'
import DividerBar from '../../atom/DividerBar'
import CustomTable from '../CustomTable'

interface TimePlaceDepthTableProps {
  data: any
  columns: GridColDef[]
  columns2: GridColDef[]
  expandedRows: string[]
}

const TimePlaceDepthTable: FC<TimePlaceDepthTableProps> = ({ data, columns, columns2, expandedRows }) => {
  const checkDataListDepth = (obj: any, depth = 0): number => {
    if (!obj || !obj.dataList || !Array.isArray(obj.dataList)) {
      return depth
    }

    return checkDataListDepth(obj.dataList[0], depth + 1)
  }

  const renderDetailPanel = (row: any) => {
    if (!row?.dataList) return null

    return (
      <>
        {row.dataList.map((row: any, index: number) => (
          <Box key={`${row.dateName}-${row.totalPlaceName}-${index}`}>
            <CustomTable columns={columns} rows={[row]} isAllView showHeader={false} />
            <DividerBar />
            {expandedRows.includes(row.key) && renderDetailPanel2(row.dataList)}
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
      {data.dataList.map((row: any, index: number) => (
        <Box key={row.dateName}>
          <CustomTable
            id='dateName'
            columns={columns}
            rows={[data.dataList[index]]}
            isAllView
            showHeader={index === 0}
          />
          <DividerBar />
          {expandedRows.includes(row.key) && renderDetailPanel(row)}
        </Box>
      ))}
    </>
  )
}

export default TimePlaceDepthTable
