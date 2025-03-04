import { FC, useCallback, useEffect, useState } from 'react'

import { Box, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import BorderNameTag from 'src/@core/components/atom/BorderNameTag'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useContents } from 'src/hooks/useContents'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClient, SERVICE_TYPE, SERVICE_TYPE_LABELS } from 'src/model/client/clientModel'
import { MContent } from 'src/model/contents/contentsModel'
import styled from 'styled-components'
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
      flex: 0.5,
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
      flex: 0.7,
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
      flex: 0.5,
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
            {row.serviceTypes.map((serviceType: string, index: number) =>
              row.serviceTypes.length <= 1 ? (
                <Box
                  key={`single-${row.clientId}-${serviceType}-${index}`}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconCustom isCommon path='clients' icon={serviceType} />
                  <Typography component='span' variant='inherit' noWrap>
                    {SERVICE_TYPE_LABELS[serviceType as SERVICE_TYPE]}
                  </Typography>
                </Box>
              ) : (
                <CustomTooltip
                  title={SERVICE_TYPE_LABELS[serviceType as SERVICE_TYPE]}
                  key={`multi-${row.clientId}-${serviceType}-${index}`}
                  placement='top'
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconCustom isCommon path='clients' icon={serviceType} />
                  </Box>
                </CustomTooltip>
              )
            )}
          </Box>
        )
      }
    },
    {
      field: 'solutionTypes',
      headerName: '솔루션 유형',
      headerAlign: 'center',
      align: 'center',
      flex: 0.7,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
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
      align: 'center',
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 2 }}>
            <Typography variant='inherit' noWrap sx={{ flex: 1, textAlign: 'center' }}>
              {row.analysisChannels}
            </Typography>
            <IconCustom isCommon icon='colons' />
          </Box>
        )
      }
    },
    {
      field: 'reportGeneration',
      headerName: '리포트 생성',
      headerAlign: 'center',
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              checked={row.reportGeneration}
              onChange={event => {
                console.log(row.reportGeneration)
              }}
            />
          </Box>
        )
      }
    },
    {
      field: 'reportEmail',
      headerName: '리포트 수신',
      headerAlign: 'center',
      flex: 0.8,
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
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<IClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <BorderNameTag
              name={row.accountStatus ? '활성상태' : '비활성상태'}
              background={row.accountStatus ? '#9155fd21' : '#FF4C5121'}
              color={row.accountStatus ? '#9155FD' : '#FF4C51'}
            />
          </Box>
        )
      }
    },
    {
      field: 'updateDelete',
      headerName: '수정 및 삭제',
      flex: 0.4,
      renderCell: ({ row }: any) => {
        return (
          <>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                router.push({
                  pathname: '/clients/clientsAdd',
                  query: {
                    mode: 'edit',
                    clientData: JSON.stringify(row)
                  }
                })
              }}
            >
              <IconCustom isCommon icon='Edit' />
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                console.log(e)
              }}
            >
              <IconCustom isCommon icon='DeleteOutline' />
            </IconButton>
          </>
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
            <CustomTable showMoreButton={true} rows={clientData} columns={columns} />

            {/* <TableWrapper>
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
            </TableWrapper> */}

            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} mt={3} mb={3} gap={3}>
              <Button
                variant='contained'
                onClick={() => {
                  setPaginationModel({ page: 0, pageSize: Math.min(paginationModel.pageSize + 50, clientData.length) })
                }}
                disabled={paginationModel.pageSize >= clientData.length}
              >
                더보기
              </Button>
              <Typography>
                {paginationModel.pageSize > clientData.length ? clientData.length : paginationModel.pageSize} of{' '}
                {clientData.length}
              </Typography>

              <PageSizeSelect pageSize={paginationModel.pageSize} onChange={handlePageSizeChange} />
            </Box> */}
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

const TableWrapper = styled.div`
  .MuiTablePagination-root {
    display: none;
  }
  .MuiDataGrid-footerContainer {
    display: none;
  }
`

export default ClientList
