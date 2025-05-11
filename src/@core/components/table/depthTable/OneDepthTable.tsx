import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { FC } from 'react'
import DividerBar from '../../atom/DividerBar'
import CustomTable from '../CustomTable'

interface OneDepthTableProps {
  data: any
  columns: GridColDef[]
  expandedRows: string[]
}

const OneDepthTable: FC<OneDepthTableProps> = ({ data, columns, expandedRows }) => {
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

export default OneDepthTable
