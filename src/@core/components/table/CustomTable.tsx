import { Box, Button, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import styled from 'styled-components'
import PageSizeSelect from './PageSizeSelect'

interface IRowSelect {
  selectRowEvent: (row: any) => void
}

interface IPageSizeSelect {
  showMoreButton: boolean
  rows: any[]
  columns: any[]
}

interface TableWrapperProps {
  $showMoreButton: boolean
}

interface IGridOptions {
  checkboxSelection: boolean
}

const CustomTable: FC<IPageSizeSelect & Partial<IRowSelect> & Partial<IGridOptions>> = ({
  showMoreButton,
  rows,
  columns,
  checkboxSelection = true,
  selectRowEvent
}) => {
  const pageSizeOptions = [25, 50, 100]
  const [pageSize, setPageSize] = useState(25)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: pageSize })

  return (
    <>
      <TableWrapper $showMoreButton={showMoreButton}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          pageSizeOptions={pageSizeOptions}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={row => row.clientId}
          onRowClick={row => selectRowEvent && selectRowEvent(row.row)}
          onRowSelectionModelChange={e => {
            console.log(e)
          }}
        />
      </TableWrapper>

      {showMoreButton && (
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }} mt={3} mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', justifyContent: 'center' }}>
            <Button
              variant='contained'
              onClick={() => {
                setPaginationModel({ page: 0, pageSize: Math.min(paginationModel.pageSize + pageSize, rows.length) })
              }}
              disabled={paginationModel.pageSize >= rows.length}
            >
              더보기
            </Button>
            <Typography>
              {paginationModel.pageSize > rows.length ? rows.length : paginationModel.pageSize} of {rows.length}
            </Typography>
          </Box>

          <Box sx={{ position: 'absolute', right: 30 }}>
            <PageSizeSelect
              pageSize={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
                setPaginationModel({ page: 0, pageSize: Number(e.target.value) })
              }}
            />
          </Box>
        </Box>
      )}
    </>
  )
}

const TableWrapper = styled.div<TableWrapperProps>`
  .MuiTablePagination-root {
    display: ${({ $showMoreButton }) => ($showMoreButton ? 'none' : 'block')};
  }
  .MuiDataGrid-footerContainer {
    display: ${({ $showMoreButton }) => ($showMoreButton ? 'none' : 'block')};
  }
`

export default CustomTable
