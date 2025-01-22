import { FC, useEffect, useState } from 'react'

import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import SwitchColumn from 'src/@core/components/atom/SwitchColumn'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import TimePicker from 'src/@core/components/atom/TimePicker'
import { YN } from 'src/enum/commonEnum'
import { useKiosk } from 'src/hooks/useKiosk'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKioskContent } from 'src/model/kiosk/kioskModel'
import { formatNumber } from 'src/utils/CommonUtil'

interface IKioskList {
  data: MKioskContent[]
  onPreView: (data: MKioskContent) => void
  refetch: () => void
}

const splitStringToNumbers = (input: string): [number, number] => {
  // 먼저 문자열을 두 부분으로 나누기
  const firstPart = parseInt(input.slice(0, 2), 10) // 처음 두 글자
  const secondPart = parseInt(input.slice(2), 10) // 그 이후의 글자들

  return [firstPart, secondPart]
}

const KioskContentsList: FC<IKioskList> = ({ data, onPreView, refetch }) => {
  const kiosk = useKiosk()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const handleRowUpdate = (modRow: MKioskContent, changeKey: keyof MKioskContent) => {
    const index = kiosk.kioskContentModRows.findIndex(item => item?.contentsId === modRow.contentsId)

    const newArr =
      index === -1
        ? [...kiosk.kioskContentModRows, modRow]
        : kiosk.kioskContentModRows.map(item =>
            item && item.contentsId === modRow.contentsId
              ? { ...item, [changeKey]: modRow[changeKey] } // changeKey는 keyof MKioskContent로 안전하게 접근 가능
              : item
          )

    kiosk.setKioskContentModRows(newArr)
  }

  useEffect(() => {
    kiosk.setKioskContentModRows([])
    kiosk.setKioskContentDeleteIds([])
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'contentsName',
      headerName: '홍보물 명',
      headerAlign: 'center',
      flex: 1,
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
            width={70}
            switchName={['우선', '일반']}
            activeColor={['rgba(145, 85, 253, 1)', 'rgba(105, 105, 105, 1)']}
            selected={idSelected}
            superSelected={row.forceUpdated}
            onSuperChange={async selected => {
              handleRowUpdate({ ...row, forceUpdated: selected }, 'forceUpdated')
            }}
          />
        )
      }
    },
    {
      field: 'startDate',
      headerName: '게시기간',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {`${row.startDate} ~ ${row.endDate}`}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'startTime',
      headerName: '게시시간',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        const startTime = splitStringToNumbers(row.startTime)
        const endTime = splitStringToNumbers(row.endTime)

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimePicker
                hour={startTime[0]}
                minute={startTime[1]}
                onChange={(hour, minute) => {
                  handleRowUpdate({ ...row, startTime: formatNumber(hour) + formatNumber(minute) }, 'startTime')
                }}
              />
              <Typography variant='inherit' sx={{ marginX: 1 }}>
                ~
              </Typography>
              <TimePicker
                hour={endTime[0]}
                minute={endTime[1]}
                onChange={(hour, minute) => {
                  handleRowUpdate({ ...row, endTime: formatNumber(hour) + formatNumber(minute) }, 'endTime')
                }}
              />
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'fileName',
      headerName: '홍보물 파일명',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.fileName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'setting',
      headerName: '사용관리',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MKioskContent>) => {
        return (
          <Box>
            <SwitchColumn
              defaultChecked={row.dataStatus === YN.Y}
              onChange={async event => {
                const checked = event.target.checked ? YN.Y : YN.N
                handleRowUpdate({ ...row, dataStatus: checked }, 'dataStatus')
              }}
            />

            <IconButton
              disabled={row.dataStatus === YN.D}
              onClick={() => {
                onPreView(row)
              }}
            >
              <IconCustom path='contents' icon='view' />
            </IconButton>

            <IconButton
              onClick={() => {
                kiosk.setKioskContentDeleteIds([...kiosk.kioskContentDeleteIds, row.contentsId])
              }}
            >
              <IconCustom path='contents' icon='DeleteOutline' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <DataGrid
      autoHeight
      getRowId={row => row.contentsId}
      rows={data.filter(item => !kiosk.kioskContentDeleteIds.includes(item.contentsId))}
      columns={columns}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  )
}

export default KioskContentsList
