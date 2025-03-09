import { Box, IconButton, TextField, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useCallback, useState } from 'react'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import { useCameraClientList } from 'src/service/cameras/camerasService'

interface IClientList {
  handleSelectClientGrid: (row: ICameraClient) => void
}

const CamerasClient: FC<IClientList> = ({ handleSelectClientGrid }) => {
  const cameraContext = useCameras()
  const { data: clientData, refetch: clientRefetch } = useCameraClientList(cameraContext.clientListReq)
  const [keyword, setKeyword] = useState('')

  const handleSearch = useCallback(
    (searchKeyword: string) => {
      cameraContext.setClientListReq({ ...cameraContext.clientListReq, keyword: searchKeyword })
    },
    [cameraContext.clientListReq]
  )

  const clientColumns: GridColDef[] = [
    {
      field: 'clientId',
      headerName: '고객사ID',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: true,
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<ICameraClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap sx={{ ml: 1 }}>
              {row.clientId}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'clientNm',
      headerName: '고객사명',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<ICameraClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap sx={{ ml: 2 }}>
              {row.clientNm}
            </Typography>
          </Box>
        )
      }
    }
  ]

  return (
    <Box>
      <TextField
        size='small'
        fullWidth
        sx={{ mb: 5 }}
        placeholder='고객사 ID, 고객사명'
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={e => {
                handleSearch(keyword)
              }}
            >
              <IconCustom isCommon icon='search' />
            </IconButton>
          )
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleSearch(keyword)
          }
        }}
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />

      <CustomTable
        showMoreButton={false}
        rows={clientData?.data || []}
        columns={clientColumns}
        selectRowEvent={handleSelectClientGrid}
        checkboxSelection={false}
        isAllView
      />
    </Box>
  )
}

export default CamerasClient
