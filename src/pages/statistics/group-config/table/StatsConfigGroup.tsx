import { FC } from 'react'

import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import IconCustom from 'src/layouts/components/IconCustom'
import { MGroupList, MKioskData } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'

interface IStatsConfigGroup {
  data?: MGroupList
  onDelete: (row: MKioskData) => void
  refetch?: () => void
}

const StatsConfigGroup: FC<IStatsConfigGroup> = ({ data, onDelete, refetch }) => {
  const columns: GridColDef[] = [
    {
      field: 'kioskName',
      headerName: 'kioskName',
      headerAlign: 'center',
      flex: 0.8,
      renderCell: ({ row }: GridRenderCellParams<MKioskData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.kioskName}
            </Typography>
          </Box>
        )
      }
    },

    {
      field: 'statsName',
      headerName: 'statsName',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKioskData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.statsName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'setting',
      headerName: '사용관리',
      headerAlign: 'center',
      flex: 0.5,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MKioskData>) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                onDelete(row)
              }}
            >
              <IconCustom isCommon icon='DeleteOutline' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <TableWrapper>
      <DataGrid
        autoHeight
        getRowId={row => row.statsId}
        rows={data?.data ?? []}
        columns={columns}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '35%',
              height: '40%',
              width: '2px',
              backgroundColor: 'rgba(58, 53, 65, 0.12)'
            }
          },
          '& .MuiDataGrid-cell:last-child::after': {
            display: 'none'
          }
        }}
      />
    </TableWrapper>
  )
}

const TableWrapper = styled.div`
  .MuiDataGrid-footerContainer {
    display: none;
  }

  .MuiDataGrid-columnHeaders {
    display: none;
  }
`

export default StatsConfigGroup
