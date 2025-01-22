import { FC, useState } from 'react'

import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import IconCustom from 'src/layouts/components/IconCustom'
import { MGroupSettingList } from 'src/model/statistics/StatisticsModel'

interface IStatsConfigItemList {
  data?: MGroupSettingList[]
  onAdd: (row: MGroupSettingList) => void
  refetch?: () => void
}

const StatsConfigItemList: FC<IStatsConfigItemList> = ({ data, onAdd, refetch }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const columns: GridColDef[] = [
    {
      field: 'kioskId',
      headerName: '키오스크ID',
      headerAlign: 'left',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MGroupSettingList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.kioskId}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'kioskName',
      headerName: '키오스크명',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MGroupSettingList>) => {
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
      field: 'kioskLocation',
      headerName: '키오스크위치',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MGroupSettingList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.kioskLocation}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'statsName',
      headerName: '분석위치 및 방향',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MGroupSettingList>) => {
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
      renderCell: ({ row }: GridRenderCellParams<MGroupSettingList>) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                onAdd(row)
              }}
            >
              <Typography variant='button' fontWeight={700} mr={1}>
                추가
              </Typography>
              <IconCustom path='statistics' icon='Active' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <DataGrid
      autoHeight
      getRowId={row => row.statsId}
      rows={data ?? []}
      columns={columns}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
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
  )
}

export default StatsConfigItemList
