import { Box, Button, Typography } from '@mui/material'
import { FC, ReactNode, useState } from 'react'
import PageSizeSelect from './PageSizeSelect'

interface TableWrapperProps {
  children: ReactNode
  rows: any[]
  showMoreButton?: boolean
  initialPageSize?: number
  onPaginationModelChange?: (model: { page: number; pageSize: number }) => void
}

const TableWrapper: FC<TableWrapperProps> = ({
  children,
  rows,
  showMoreButton = true,
  initialPageSize = 25,
  onPaginationModelChange
}) => {
  const [pageSize, setPageSize] = useState<number>(initialPageSize)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: initialPageSize })

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    setPaginationModel(newModel)
    onPaginationModelChange?.(newModel)
  }

  return (
    <Box>
      {children}

      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }} mt={3} mb={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', justifyContent: 'center' }}>
          {showMoreButton && (
            <>
              <Button
                variant='contained'
                onClick={() => {
                  handlePaginationModelChange({
                    page: 0,
                    pageSize: Math.min(paginationModel.pageSize + pageSize, rows.length)
                  })
                }}
                disabled={paginationModel.pageSize >= rows.length}
              >
                더보기
              </Button>
              <Typography>
                {paginationModel.pageSize > rows.length ? rows.length : paginationModel.pageSize} of {rows.length}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ position: 'absolute', right: 30 }}>
          <PageSizeSelect
            pageSize={pageSize}
            onChange={e => {
              const newPageSize = Number(e.target.value)
              setPageSize(newPageSize)
              handlePaginationModelChange({ page: 0, pageSize: newPageSize })
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default TableWrapper
