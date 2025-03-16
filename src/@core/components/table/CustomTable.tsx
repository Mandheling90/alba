import { Box, Button, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import styled from 'styled-components'
import PageSizeSelect from './PageSizeSelect'

interface IRowSelect {
  selectRowEvent?: (row: any) => void
  onCheckboxSelectionChange?: (selectedRows: any[]) => void
}

interface IPageSizeSelect {
  showMoreButton?: boolean
  rows: any[]
  columns: any[]
}

interface TableWrapperProps {
  $showMoreButton: boolean
}

interface IGridOptions {
  id?: string
  isAllView?: boolean
  enablePointer?: boolean
}

const CustomTable: FC<
  IPageSizeSelect & Partial<IRowSelect> & Partial<IGridOptions> & { highlightCriteria?: { field: string; value: any } }
> = ({
  id,
  isAllView = false,
  showMoreButton = false,
  rows,
  columns,
  selectRowEvent,
  enablePointer = false,
  onCheckboxSelectionChange,
  highlightCriteria
}) => {
  const pageSizeOptions = [25, 50, 100]
  const [pageSize, setPageSize] = useState(isAllView ? 100 : 25)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isAllView ? 100 : 25 })
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<any[]>([])

  const getSelectedRows = (selectedIds: any[]) => {
    return rows.filter(row => selectedIds.includes(row[id ?? 'id']))
  }

  return (
    <>
      <TableWrapper $showMoreButton={showMoreButton || isAllView}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          checkboxSelection={!!onCheckboxSelectionChange}
          pageSizeOptions={pageSizeOptions}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={row => row[id ?? 'id']}
          getRowClassName={(params): string => {
            const isSelectedByClick = selectedRow === params.id
            const isHighlighted = highlightCriteria && params.row[highlightCriteria.field] === highlightCriteria.value

            return isSelectedByClick ? 'selected-by-click' : isHighlighted ? 'highlighted-row' : ''
          }}
          onRowClick={(row: any) => {
            if (selectRowEvent) {
              if (selectedRow === row.id) {
                setSelectedRow(null)
              } else {
                setSelectedRow(row.id)
                selectRowEvent(row.row)
              }
            }
          }}
          onRowSelectionModelChange={(selectedIds: any[]) => {
            if (selectedIds.length === 0) {
              setSelectedRow(null)
            }

            setSelectedCheckboxes(selectedIds)
            if (onCheckboxSelectionChange) {
              const selectedRows = getSelectedRows(selectedIds)
              onCheckboxSelectionChange(selectedRows)
            }
          }}
          rowSelectionModel={[
            ...(onCheckboxSelectionChange ? selectedCheckboxes : []),
            ...(selectRowEvent && selectedRow ? [selectedRow] : [])
          ]}
          hideFooterPagination={isAllView}
          sx={{
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: 'rgba(145, 85, 253, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(144, 85, 253, 0.16)'
              }
            },
            '& .selected-by-click': {
              backgroundColor:
                onCheckboxSelectionChange && selectRowEvent
                  ? 'rgba(255, 0, 0, 0.1) !important'
                  : 'rgba(145, 85, 253, 0.1) !important',
              '&:hover': {
                backgroundColor:
                  onCheckboxSelectionChange && selectRowEvent
                    ? 'rgba(255, 0, 0, 0.2) !important'
                    : 'rgba(145, 85, 253, 0.2) !important'
              }
            },
            '& .highlighted-row': {
              backgroundColor: 'rgba(145, 85, 253, 0.08) !important',
              '&:hover': {
                backgroundColor: 'rgba(144, 85, 253, 0.16) !important'
              }
            },
            '& .MuiDataGrid-row': {
              cursor: enablePointer ? 'pointer' : 'default'
            }
          }}
        />
      </TableWrapper>

      {showMoreButton && !isAllView && (
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
