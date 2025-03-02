import { FC, useCallback, useEffect, useState } from 'react'

import { Box, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import { useContents } from 'src/hooks/useContents'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClient } from 'src/model/client/clientModel'
import { MContent } from 'src/model/contents/contentsModel'
import ContentsDeleteModal from '../modal/ContentsDeleteModal'

interface IClientList {
  data: IClient[]
  refetch: () => void
}

interface IKioskListInfo {
  count: number
  kioskList: string
}

interface MContentData extends MContent {
  display?: boolean
}

const ClientList: FC<IClientList> = ({ data, refetch }) => {
  const router = useRouter()
  const contents = useContents()

  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [clientData, setclientData] = useState<IClient[]>([])

  const [checkedId, setCheckedId] = useState<number[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [kioskListInfo, setKioskListInfo] = useState<IKioskListInfo>()

  useEffect(() => {
    setclientData(data.map(obj => ({ ...obj, display: true })))
  }, [data])

  const handleFilter = useCallback(
    (val: string) => {
      if (val !== '') {
        const newData = clientData.map(obj => {
          const shouldDisplay = !obj.clientId || obj.clientId.toLowerCase().includes(val)

          return { ...obj, display: shouldDisplay }
        })

        setclientData(newData)
      } else {
        const newData = clientData.map(obj => ({ ...obj, display: true }))
        setclientData(newData)
      }

      setValue(val)
    },
    [clientData]
  )

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'clientId',
      headerName: '고객사ID',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.clientId}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'clientName',
      headerName: '고객사명',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.clientName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'address',
      headerName: '주소',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.address}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'serviceTypes',
      headerName: '서비스 형태',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {row.serviceTypes.map((serviceType: string) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                key={serviceType}
              >
                <IconCustom isCommon path='clients' icon={serviceType} />
                {row.serviceTypes.length <= 1 && (
                  <Typography variant='inherit' noWrap>
                    {serviceType}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )
      }
    },
    {
      field: 'solutionTypes',
      headerName: '솔루션 유형',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.solutionTypes.join(', ')}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'analysisChannels',
      headerName: '분석 채널',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.analysisChannels}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'reportGeneration',
      headerName: '리포트 생성',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.reportGeneration ? '예' : '아니오'}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'reportEmail',
      headerName: '리포트 수신',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.reportEmail}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'accountStatus',
      headerName: '계정 상태',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.accountStatus ? '활성화' : '비활성화'}
            </Typography>
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <SimpleDialogModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        title={`선택된 컨텐츠는 아래 총 ${kioskListInfo?.count}곳의 키오스크에 게시되어 있습니다`}
        contents={kioskListInfo?.kioskList ?? ''}
      />

      {contents.selectedContentIds.length > 0 && (
        <ContentsDeleteModal
          open={isDeleteModalOpen}
          onClose={() => {
            contents.setSelectedContentIds([])
            setIsDeleteModalOpen(false)
            refetch()
          }}
        />
      )}

      <Grid container>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              rows={clientData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              getRowId={row => row.clientId}
              onRowSelectionModelChange={e => {
                console.log(e)
                setCheckedId(e as number[])
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default ClientList
