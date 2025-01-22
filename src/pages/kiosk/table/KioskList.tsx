import { FC, useEffect, useState } from 'react'

import { Box, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useKiosk } from 'src/hooks/useKiosk'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKiosk } from 'src/model/kiosk/kioskModel'
import { useKioskUpdate } from 'src/service/kiosk/kioskService'

interface IKioskList {
  data: MKiosk[]
  refetch: () => void
}

const KioskList: FC<IKioskList> = ({ data, refetch }) => {
  const kiosk = useKiosk()
  const router = useRouter()
  const { mutateAsync } = useKioskUpdate()

  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [kioskData, setKioskData] = useState<MKiosk[]>([])

  useEffect(() => {
    setKioskData(data)
  }, [data])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '키오스크 ID',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MKiosk>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.id}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'name',
      headerName: '키오스크 명',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKiosk>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.name}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'location',
      headerName: '키오스크 위치',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKiosk>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.location}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'kioskType',
      headerName: '키오스크 타입',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKiosk>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom
              path='kiosk'
              icon={row.kioskType.typeId === 2 ? 'kiosk-Atype' : 'kiosk-Btype'}
              style={{ marginRight: '10px' }}
            />
            <Typography variant='inherit' noWrap>
              {row.kioskType.name}
            </Typography>
          </Box>
        )
      }
    },

    {
      field: 'dataStatus',
      headerName: '사용여부',
      headerAlign: 'center',
      flex: 0.5,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MKiosk>) => {
        return (
          <Switch
            checked={row.kioskStatus !== KIOSK_STATUS.DISABLED}
            onChange={async event => {
              await mutateAsync({
                id: row.id,
                kioskStatus: event.target.checked ? KIOSK_STATUS.ENABLED : KIOSK_STATUS.DISABLED
              })
              refetch()
            }}
          />
        )
      }
    },
    {
      field: '10',
      headerName: '수정 및 삭제',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MKiosk>) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                kiosk.setSelectedKioskInfo(row)
                kiosk.setIsKioskManagerModalOpen(true)
              }}
            >
              <IconCustom isCommon icon={'Edit'} />
            </IconButton>

            <IconButton
              disabled={row.kioskStatus === KIOSK_STATUS.DISABLED}
              onClick={() => {
                router.push({
                  pathname: 'kiosk/kiosk-contents-manager',
                  query: { id: row.id }
                })
              }}
            >
              <IconCustom path='kiosk' icon={'KioskSettingPurpleDefault'} />
            </IconButton>

            <IconButton
              onClick={async () => {
                await kiosk.kioskDelete([row.id], undefined, errorCallback => {
                  alert(errorCallback.message)
                })
                refetch()
              }}
            >
              <IconCustom isCommon icon='DeleteOutline' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  const handleSortModelChange = async (newSortModel: GridSortModel) => {
    if (newSortModel[0]?.field && newSortModel[0]?.sort) {
      const field = newSortModel[0].field ?? ''
      const sort = newSortModel[0].sort ?? null

      kiosk.setKioskSort({ field: field, sort: sort })
    } else {
      kiosk.setKioskSort({ field: '', sort: null })
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              rows={kioskData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[50, 100, 150]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={e => {
                kiosk.setCheckedKioskIds(e as number[])
              }}
              initialState={{
                sorting: {
                  sortModel: [{ field: kiosk.kioskSort.field, sort: kiosk.kioskSort.sort }] // 원하는 기본 정렬 필드와 방향 설정
                }
              }}
              onSortModelChange={handleSortModelChange}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default KioskList
