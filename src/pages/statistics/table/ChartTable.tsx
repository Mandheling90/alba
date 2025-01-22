import { FC, useCallback, useEffect, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef, GridRenderCellParams } from 'custom_modules/@mui_custom/x-data-grid'
import { useAuth } from 'src/hooks/useAuth'
import { useStatistics } from 'src/hooks/useStatistics'
import { MTable } from 'src/model/statistics/StatisticsModel'
import { exportToExcel } from 'src/utils/CommonUtil'
import styled from 'styled-components'
import TableHeader from './TableHeader'

interface IUserList {
  data: MTable[]
  isCrowd?: boolean
  refetch?: () => void
}

const ChartTable: FC<IUserList> = ({ data, isCrowd = false, refetch }) => {
  const statistics = useStatistics()

  // ** State
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const [listData, setListData] = useState<MTable[]>([])

  const [userCheck, setUserCheck] = useState<number[]>([])

  const auth = useAuth()

  useEffect(() => {
    setListData(data.map((obj, index) => ({ ...obj, id: index, display: true })))
    setPaginationModel({ page: 0, pageSize: 50 })
    setUserCheck([])
  }, [data])

  const handleFilter = useCallback(
    (val: string, key: string) => {
      if (val !== '') {
        const newData = listData.map(obj => {
          let shouldDisplay = false

          if (key === 'all') {
            // 모든 키값에서 검색
            shouldDisplay = (Object.values(obj) as string[]).some(value =>
              value?.toString().toLowerCase().includes(val.toLowerCase())
            )
          } else {
            // 특정 key에 대해 검색
            const fieldValue = (obj[key as keyof MTable] as string)?.toString().toLowerCase()
            shouldDisplay = fieldValue?.includes(val.toLowerCase())
          }

          return { ...obj, display: shouldDisplay }
        })

        setListData(newData)
      } else {
        const newData = listData.map(obj => ({ ...obj, display: true }))
        setListData(newData)
      }

      setValue(val)
    },
    [listData]
  )

  const crowdColumns: GridColDef[] = [
    {
      field: 'date',
      headerName: '날짜',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.date}
          </Typography>
        )
      }
    },
    {
      field: 'time',
      headerName: `${
        statistics.chartProps.time === 'hour' ? '시간' : statistics.chartProps.time === 'day' ? '일' : '월'
      }`,
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.time}
          </Typography>
        )
      }
    },
    {
      field: 'kioskId',
      headerName: '키오스크 ID',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.kioskId}
          </Typography>
        )
      }
    },
    {
      field: 'kioskName',
      headerName: '키오스크 명',
      headerAlign: 'center',
      align: 'center',
      flex: 0.7,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.kioskName}
          </Typography>
        )
      }
    },
    {
      field: 'kioskLocation',
      headerName: '키오스크위치',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.kioskLocation}
          </Typography>
        )
      }
    },
    {
      field: 'lineName',
      headerName: '분석위치 및 방향',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.lineName}
          </Typography>
        )
      }
    },
    {
      field: 'count',
      headerName: '카운트수',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.count}
          </Typography>
        )
      }
    }
  ]

  const smokingColumns: GridColDef[] = [
    {
      field: 'date',
      headerName: '날짜',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.date}
          </Typography>
        )
      }
    },
    {
      field: 'time',
      headerName: `${
        statistics.chartProps.time === 'hour' ? '시간' : statistics.chartProps.time === 'day' ? '일' : '월'
      }`,
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.time}
          </Typography>
        )
      }
    },
    {
      field: 'kioskId',
      headerName: '키오스크 ID',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.kioskId}
          </Typography>
        )
      }
    },
    {
      field: 'kioskName',
      headerName: '키오스크 명',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.kioskName}
          </Typography>
        )
      }
    },
    {
      field: 'kioskLocation',
      headerName: '키오스크위치',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.kioskLocation}
          </Typography>
        )
      }
    },
    {
      field: 'areaName',
      headerName: '분석위치',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.areaName}
          </Typography>
        )
      }
    },
    {
      field: 'peopleCount',
      headerName: '유동인구수',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.peopleCount}
          </Typography>
        )
      }
    },
    {
      field: 'smokerCount',
      headerName: '흡연자수',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
      renderCell: ({ row }: GridRenderCellParams<MTable>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.smokerCount}
          </Typography>
        )
      }
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableWrapper>
              <TableHeader
                value={value}
                handleFilter={handleFilter}
                refetch={() => {
                  refetch?.()
                }}
                onExport={() => {
                  const filteredData = listData.filter(item => item.id !== undefined && userCheck.includes(item.id))
                  let reorderedData
                  if (isCrowd) {
                    reorderedData = filteredData.map(item => {
                      const { date, time, kioskId, kioskName, kioskLocation, lineName, count, ...rest } = item

                      return {
                        date,
                        time,
                        kioskId,
                        kioskName,
                        kioskLocation,
                        lineName,
                        count,
                        ...rest
                      }
                    })
                  } else {
                    reorderedData = filteredData.map(item => {
                      const {
                        date,
                        time,
                        kioskId,
                        kioskName,
                        kioskLocation,
                        areaName,
                        peopleCount,
                        smokerCount,
                        ...rest
                      } = item

                      return {
                        date,
                        time,
                        kioskId,
                        kioskName,
                        kioskLocation,
                        areaName,
                        peopleCount,
                        smokerCount,
                        ...rest
                      }
                    })
                  }

                  exportToExcel(reorderedData, '통계 테이블 리스트')
                }}
                isCrowd={isCrowd}
              />

              <DataGrid
                autoHeight
                rows={listData.filter(row => row.display)}
                columns={isCrowd ? crowdColumns : smokingColumns}
                checkboxSelection
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={e => {
                  setUserCheck(e as number[])
                }}
                rowSelectionModel={userCheck} // 체크된 항목을 명시적으로 설정
                isRowSelectable={(params: any) => params.row.id !== auth?.user?.userInfo?.id}

                // pageSizeOptions={[10, 25, 50]}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} mt={3} mb={3} gap={3}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setPaginationModel({ page: 0, pageSize: Math.min(paginationModel.pageSize + 50, listData.length) })
                  }}
                  disabled={paginationModel.pageSize >= listData.length}
                >
                  더보기
                </Button>
                <Typography>
                  {paginationModel.pageSize > listData.length ? listData.length : paginationModel.pageSize} of{' '}
                  {listData.length}
                </Typography>
              </Box>
            </TableWrapper>
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

export default ChartTable
