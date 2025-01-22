import { Box, Card, styled, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useEffect, useState } from 'react'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import { EResultCode, YN } from 'src/enum/commonEnum'
import { MKioskContent } from 'src/model/kiosk/kioskModel'
import { useKioskContentsUpdate } from 'src/service/kiosk/kioskService'

interface IUserList {
  data: MKioskContent[]
  refetch?: () => void
}

const KioskCardContentsList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync } = useKioskContentsUpdate()

  const [contentData, setContentData] = useState<MKioskContent[]>([])

  useEffect(() => {
    setContentData(data)
  }, [data])

  const columns: GridColDef[] = [
    {
      field: 'contentsName',
      headerName: '홍보물명',
      headerAlign: 'center',
      flex: 0.8,
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.contentsName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'priority',
      headerName: '우선순위',
      headerAlign: 'center',
      flex: 0.5,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        // 백엔드에서 조건을 바꿈
        // 0 F : 일반-일반
        // 1 T : 일반 우선
        // 1 F : 우선-일반
        // 0 T : 우선-우선
        const idSelected = (row.priority === 1 && !row.forceUpdated) || (row.priority === 0 && row.forceUpdated)

        return (
          <SwitchCustom
            isSuperChange
            switchName={['우선', '일반']}
            activeColor={['rgba(145, 85, 253, 1)', 'rgba(105, 105, 105, 1)']}
            selected={idSelected}
            superSelected={row.forceUpdated}
            onSuperChange={async selected => {
              await mutateAsync({
                id: row.id,
                contentsId: row.contentsId,
                forceUpdated: selected
              })
            }}
          />
        )
      }
    },
    {
      field: 'dataStatus',
      headerName: '사용여부',
      headerAlign: 'center',
      flex: 0.5,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        return (
          <Switch
            checked={row.dataStatus === YN.Y}
            onChange={async event => {
              const checked = event.target.checked ? YN.Y : YN.N
              const res = await mutateAsync({ id: row.id, contentsId: row.contentsId, dataStatus: checked })
              if (res.code === EResultCode.SUCCESS) {
                const updatedList = contentData.map(data => {
                  if (data.contentsId === row.contentsId) {
                    return { ...data, dataStatus: checked }
                  }

                  return data
                })
                setContentData(updatedList)
              }
            }}
          />
        )
      }
    }
  ]

  return (
    <KioskContentsListTable>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ height: '273px' }}>
            <DataGrid
              rows={contentData}
              columns={columns}
              checkboxSelection={false}
              disableRowSelectionOnClick={true}
              rowHeight={45}
              columnHeaderHeight={45}
              getRowId={row => row.contentsId}

              // sx={{ ...scrollbarSx }}

              // sx={{
              //   '& .MuiDataGrid-virtualScroller': {
              //     // 스크롤바 스타일 적용
              //     '&::-webkit-scrollbar': {
              //       width: '4px',
              //       opacity: 0,
              //       transition: 'opacity 0.3s'
              //     },
              //     '&::-webkit-scrollbar-track': {
              //       backgroundColor: 'transparent',
              //       borderRadius: '6px'
              //     },
              //     '&::-webkit-scrollbar-thumb': {
              //       backgroundColor: '#888',
              //       borderRadius: '6px'
              //     },
              //     '&::-webkit-scrollbar-thumb:hover': {
              //       backgroundColor: '#555'
              //     },
              //     '&:hover::-webkit-scrollbar': {
              //       opacity: 1
              //     }
              //   }
              // }}
            />
          </Card>
        </Grid>
      </Grid>
    </KioskContentsListTable>
  )
}

const KioskContentsListTable = styled('div')({
  '& .MuiDataGrid-footerContainer': {
    display: 'none'
  }
})

export default KioskCardContentsList
