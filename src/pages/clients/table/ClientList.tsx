import { FC, useCallback, useEffect, useState } from 'react'

import { Box, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import BorderNameTag from 'src/@core/components/atom/BorderNameTag'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import CustomTable from 'src/@core/components/table/CustomTable'

import { YN } from 'src/enum/commonEnum'
import { useClients } from 'src/hooks/useClients'
import { useCustomModal, useModal } from 'src/hooks/useModal'
import IconCustom from 'src/layouts/components/IconCustom'
import { MList } from 'src/model/client/clientModel'
import { useClientDelete, useClientReportGenerationStatusUpdate } from 'src/service/client/clientService'

interface IClientList {
  data: MList[]
  refetch: () => void
}

const ClientList: FC<IClientList> = ({ data, refetch }) => {
  const router = useRouter()

  const { setSimpleDialogModalProps } = useModal()
  const { setCustomSimpleDialogModalProps } = useCustomModal()

  const { mutateAsync: deleteClient } = useClientDelete()
  const { mutateAsync: updateReportGenerationStatus } = useClientReportGenerationStatusUpdate()
  const [clientData, setclientData] = useState<MList[]>([])
  const [analysisChannels, setAnalysisChannels] = useState(0)
  const { setSelectClientData } = useClients()

  useEffect(() => {
    setclientData(data)
  }, [data])

  const handleFilter = useCallback(
    (val: string) => {
      if (val !== '') {
        const newData = clientData.map(obj => {
          const shouldDisplay = !obj.companyId || obj.companyId.toLowerCase().includes(val)

          return { ...obj, display: shouldDisplay }
        })

        setclientData(newData)
      } else {
        const newData = clientData.map(obj => ({ ...obj, display: true }))
        setclientData(newData)
      }
    },
    [clientData]
  )

  const handleCheckboxSelection = (selectedRows: any[]) => {
    setSelectClientData(selectedRows)
  }

  const columns: GridColDef[] = [
    {
      field: 'companyId',
      headerName: '고객사ID',
      headerAlign: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.companyId}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'companyName',
      headerName: '고객사명',
      headerAlign: 'center',
      flex: 0.7,
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.companyName}
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
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
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
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
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
                  key={`single-${row.companyId}-${serviceType}-${index}`}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconCustom isCommon path='clients' icon={row.serviceIcons[index]} />
                  <Typography component='span' variant='inherit' noWrap>
                    {serviceType}
                  </Typography>
                </Box>
              ) : (
                <CustomTooltip
                  title={serviceType}
                  key={`multi-${row.companyId}-${serviceType}-${index}`}
                  placement='top'
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconCustom isCommon path='clients' icon={row.serviceIcons[index]} />
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
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
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
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 2 }}>
            <Typography variant='inherit' noWrap sx={{ flex: 1, textAlign: 'center' }}>
              {row.analysisChannels}
            </Typography>
            <Box
              sx={{
                cursor: 'pointer'
              }}
              onClick={() => {
                setAnalysisChannels(row.analysisChannels)

                setSimpleDialogModalProps({
                  open: true,
                  title: `서비스 항목별 분석채널 수 현황`,
                  contents: (
                    <Box>
                      <Typography sx={{ mt: 2, color: 'rgba(58, 53, 65, 0.6)', fontSize: 16, fontWeight: 400 }}>
                        <b>총 {row.analysisChannels}개</b>의 분석채널이 아래의 서비스 항목으로 등록되어 있습니다.
                        <ul>
                          {row.serviceInfos.map((item, index) => (
                            <li key={index}>
                              {item.serviceName} : {item.serviceCount}대
                            </li>
                          ))}
                        </ul>
                      </Typography>
                    </Box>
                  )
                })
              }}
            >
              <IconCustom isCommon icon='colons' />
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'reportGeneration',
      headerName: '리포트 생성',
      headerAlign: 'center',
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              checked={row.reportGeneration === YN.Y}
              onChange={event => {
                updateReportGenerationStatus({
                  companyNo: row.companyNo,
                  reportGeneration: event.target.checked ? YN.Y : YN.N
                })

                setclientData(prev =>
                  prev.map(client =>
                    client.companyNo === row.companyNo
                      ? { ...client, reportGeneration: event.target.checked ? YN.Y : YN.N }
                      : client
                  )
                )
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
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
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
      renderCell: ({ row }: GridRenderCellParams<MList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <BorderNameTag
              name={row.accountStatus === YN.Y ? '활성상태' : '비활성상태'}
              background={row.accountStatus === YN.Y ? '#9155fd21' : '#FF4C5121'}
              color={row.accountStatus === YN.Y ? '#9155FD' : '#FF4C51'}
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
                    id: row.companyNo
                  }
                })
              }}
            >
              <IconCustom isCommon icon='Edit' />
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={async () => {
                setCustomSimpleDialogModalProps({
                  open: true,
                  title: '고객사 정보 삭제 확인',
                  contents:
                    '선택하신 고객사 정보를 정말 삭제하시겠습니까? \r\n 삭제 시 고객사 정보 및 고객사 관련 카메라 정보 및 통계정보도 모두 삭제됩니다.',
                  actions: [
                    {
                      label: '취소',
                      variant: 'contained'
                    },
                    {
                      label: '삭제',
                      variant: 'outlined',
                      onClick: async () => {
                        try {
                          await deleteClient({ companyNos: [row.companyNo] })
                          await refetch()
                          setTimeout(() => {
                            setSimpleDialogModalProps({
                              open: true,
                              title: '고객사 정보 삭제 확인',
                              contents: '선택하신 고객사 정보가 모두 삭제되었습니다'
                            })
                          }, 100)
                        } catch (error) {
                          console.log(error)
                        }
                      }
                    }
                  ]
                })
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
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CustomTable
              onCheckboxSelectionChange={handleCheckboxSelection}
              showMoreButton={true}
              rows={clientData}
              columns={columns}
              id='companyNo'
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default ClientList
