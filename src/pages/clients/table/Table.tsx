import { FC, useCallback, useEffect, useState } from 'react'

import { Box, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'

import { YN } from 'src/enum/commonEnum'
import { CONTENTS_TYPE, PROMO } from 'src/enum/contentsEnum'

import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import { useContents } from 'src/hooks/useContents'
import IconCustom from 'src/layouts/components/IconCustom'
import { MContent } from 'src/model/contents/contentsModel'
import { extractFileName } from 'src/utils/CommonUtil'
import ContentsDeleteModal from '../modal/ContentsDeleteModal'

interface IUserList {
  data: MContent[]
  refetch: () => void
}

interface IKioskListInfo {
  count: number
  kioskList: string
}

interface MContentData extends MContent {
  display?: boolean
}

const ContentsList: FC<IUserList> = ({ data, refetch }) => {
  const router = useRouter()
  const contents = useContents()

  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [contentData, setContentData] = useState<MContent[]>([])

  const [checkedId, setCheckedId] = useState<number[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [kioskListInfo, setKioskListInfo] = useState<IKioskListInfo>()

  useEffect(() => {
    setContentData(data.map(obj => ({ ...obj, display: true })))
  }, [data])

  const handleFilter = useCallback(
    (val: string) => {
      if (val !== '') {
        const newData = contentData.map(obj => {
          const shouldDisplay = !obj.name || obj.name.toLowerCase().includes(val)

          return { ...obj, display: shouldDisplay }
        })

        setContentData(newData)
      } else {
        const newData = contentData.map(obj => ({ ...obj, display: true }))
        setContentData(newData)
      }

      setValue(val)
    },
    [contentData]
  )

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '홍보물명',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {row.type === PROMO.NO_SMOKING_PROMO ? (
              <>
                <IconCustom
                  path='contents'
                  icon='smoking-prevention-ads'
                  style={{ width: '26px', marginRight: '10px' }}
                />
                <Typography variant='inherit' noWrap>
                  {row.name}
                </Typography>
              </>
            ) : (
              <>
                <IconCustom
                  path='contents'
                  icon='ic_baseline-content-paste'
                  style={{ width: '26px', marginRight: '10px' }}
                />
                <Typography variant='inherit' noWrap>
                  {row.name}
                </Typography>
              </>
            )}
          </Box>
        )
      }
    },
    {
      field: 'postStartDate',
      headerName: '게시시작일',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom path='contents' icon='carbon_calendar' style={{ width: '26px', marginRight: '10px' }} />
            <Typography variant='inherit' noWrap>
              {row.postStartDate}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'postEndDate',
      headerName: '게시종료일',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom path='contents' icon='carbon_calendar' style={{ width: '26px', marginRight: '10px' }} />
            <Typography variant='inherit' noWrap>
              {row.postEndDate}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'kioskList',
      headerName: '게시위치',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        const kioskList = row.kioskList.map(kiosk => kiosk.name).join(', ')
        const count = row.kioskList.length

        return (
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <CustomTooltip title={kioskList}>
              <Typography variant='inherit' noWrap sx={{ flex: 1, textAlign: 'center' }}>
                {count}곳
              </Typography>
            </CustomTooltip>

            <Box sx={{ position: 'absolute', right: 0, cursor: 'pointer' }}>
              <IconButton
                onClick={() => {
                  setKioskListInfo({ count: count, kioskList: kioskList })
                  setIsOpen(true)
                }}
              >
                <IconCustom isCommon icon='table-more' />
              </IconButton>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'contentsTypeId',
      headerName: '타입',
      headerAlign: 'center',
      flex: 0.3,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <IconButton>
            <IconCustom
              path='contents'
              icon={row.contentsTypeId === CONTENTS_TYPE.VIDEO ? 'type' : 'ic_baseline-content-paste'}
            />
          </IconButton>
        )
      }
    },
    {
      field: 'creator',
      headerName: '게시자',
      headerAlign: 'center',
      flex: 0.7,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.creator}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'tag',
      headerName: '태그',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom path='contents' icon='tag' style={{ width: '16px', marginRight: '10px' }} />
            <Typography variant='inherit' noWrap>
              {row.tag}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'filePath',
      headerName: '홍보물 파일명',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {extractFileName(row.filePath)}
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
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Switch
            checked={row.dataStatus === YN.Y}
            onChange={async event => {
              const checked = event.target.checked ? YN.Y : YN.N

              await contents.contentsUpsert({ ...row, id: row.id, dataStatus: checked }, false, errorCallback => {
                alert(errorCallback.message)
              })

              const updatedList = contentData.map(data => {
                if (data.id === row.id) {
                  return { ...data, dataStatus: checked }
                }

                return data
              })
              setContentData(updatedList)
            }}
          />
        )
      }
    },
    {
      field: '10',
      headerName: '편집 및 관리',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MContentData>) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                contents.setSelectedContent(row)
                contents.setIsContentsManagerModalOpen(true)
              }}
            >
              <IconCustom path='contents' icon='view' />
            </IconButton>

            <IconButton
              disabled={row.dataStatus === YN.D}
              onClick={() => {
                contents.setSelectedContent(row)

                router.push({
                  pathname: 'contents/contents-manager',
                  query: { id: row.id }
                })
              }}
            >
              <IconCustom path='contents' icon={row.dataStatus === YN.D ? 'Edit-disable' : 'Edit'} />
            </IconButton>

            <IconButton
              onClick={() => {
                contents.setSelectedContentIds([row.id])
                setIsDeleteModalOpen(true)
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
              rows={contentData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
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

export default ContentsList
