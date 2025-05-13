import { Box, Button, Card, Grid, IconButton } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import { CameraPageType } from 'src/context/CamerasContext'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import styled from 'styled-components'

import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import { generateColumns } from 'src/@core/components/table/columns/columnGenerator'
import OneDepthTable from 'src/@core/components/table/depthTable/OneDepthTable'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import IconCustom from 'src/layouts/components/IconCustom'
import ModifyActions from 'src/pages/cameras/table/ModifyActions'

const ButtonHoverIconList = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface CamerasClientListProps {
  columnFilter?: string[]
  cameraPage?: CameraPageType
}

interface DataItem {
  key: string
  systemMenuName?: string
  defaultSettingName?: string
  modifySettingName?: string
  isEdit?: boolean
  dataList?: DataItem[]
}

interface DataState {
  dataList: DataItem[]
}

const CamerasClientList: FC<CamerasClientListProps> = ({ columnFilter, cameraPage }) => {
  const { companyNo, companyId, companyName } = useLayout()
  const { user } = useAuth()
  const layoutContext = useLayout()
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [data, setData] = useState<DataState>({ dataList: [] })
  const [dataOrigin, setDataOrigin] = useState<DataState>({ dataList: [] })

  const handleCancelClick = useCallback(
    (key: string) => {
      setData(prev => {
        const newDataList = prev.dataList.map(item => {
          if (item.key === key) {
            const originItem = dataOrigin.dataList.find(origin => origin.key === key)
            if (originItem) {
              return {
                ...originItem,
                isEdit: false,
                dataList: item.dataList
              }
            }
          }

          if (item.dataList) {
            return {
              ...item,
              dataList: item.dataList.map(subItem => {
                if (subItem.key === key) {
                  const originParent = dataOrigin.dataList.find(origin => origin.dataList?.some(sub => sub.key === key))
                  const originSubItem = originParent?.dataList?.find(origin => origin.key === key)
                  if (originSubItem) {
                    return { ...originSubItem, isEdit: false }
                  }
                }

                return subItem
              })
            }
          }

          return item
        })

        return { dataList: newDataList }
      })
    },
    [dataOrigin]
  )

  const handleSaveClick = useCallback(
    (key: string) => {
      setDataOrigin(prev => {
        const newDataList = prev.dataList.map(item => {
          if (item.key === key) {
            const updatedItem = data.dataList.find(updated => updated.key === key)
            if (updatedItem) {
              return { ...updatedItem, isEdit: false }
            }
          }

          if (item.dataList) {
            return {
              ...item,
              dataList: item.dataList.map(subItem => {
                if (subItem.key === key) {
                  const updatedSubItem = item.dataList?.find(updated => updated.key === key)
                  if (updatedSubItem) {
                    return { ...updatedSubItem, isEdit: false }
                  }
                }

                return subItem
              })
            }
          }

          return item
        })

        return { dataList: newDataList }
      })

      setData(prev => {
        const newDataList = prev.dataList.map(item => {
          if (item.key === key) {
            return { ...item, isEdit: false }
          }

          if (item.dataList) {
            return {
              ...item,
              dataList: item.dataList.map(subItem => (subItem.key === key ? { ...subItem, isEdit: false } : subItem))
            }
          }

          return item
        })

        return { dataList: newDataList }
      })
    },
    [data]
  )

  const toggleRow = useCallback((key: string) => {
    setExpandedRows(prev => (prev.includes(key) ? prev.filter(row => row !== key) : [...prev, key]))
  }, [])

  const updateDataItem = useCallback((key: string, updates: Partial<DataItem>) => {
    setData(prev => ({
      ...prev,
      dataList: prev.dataList.map(item => {
        if (item.key === key) {
          return { ...item, ...updates }
        }

        if (item.dataList) {
          return {
            ...item,
            dataList: item.dataList.map(subItem => (subItem.key === key ? { ...subItem, ...updates } : subItem))
          }
        }

        return item
      })
    }))
  }, [])

  useEffect(() => {
    const data = {
      dataList: [
        {
          key: '1',
          systemMenuName: '방문자통계',
          dataList: [
            {
              key: '1-1',
              defaultSettingName: '금일방문객',
              modifySettingName: '금일방문자수'
            },
            {
              key: '1-2',
              defaultSettingName: '전일방문객',
              modifySettingName: '전일방문자수'
            }
          ]
        }
      ]
    }

    setData(data)
    setDataOrigin(data)
  }, [])

  const columnsTemp = generateColumns({
    columns: [
      {
        field: `toggle`,
        headerName: ``,
        type: 'string'

        // flex: 0.3
      },
      {
        field: `systemMenuName`,
        headerName: `시스템 메뉴명`,
        type: 'string'

        // flex: 0.3
      },
      {
        field: `defaultSettingName`,
        headerName: `기본설정`,
        type: 'string'
      },
      { field: 'modifySettingName', headerName: '변경설정', type: 'string' },
      { field: 'modify', headerName: '편집', type: 'string', flex: 0.3 }
    ],
    customRenderers: {
      systemMenuName: (params: any) => {
        if (!params.row.systemMenuName) return <></>

        return (
          <Box>
            {params.row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={params.value}
                onChange={e => updateDataItem(params.row.key, { systemMenuName: e.target.value })}
              />
            ) : (
              params.value
            )}
          </Box>
        )
      },
      toggle: (params: any) => {
        return (
          <>
            {params.row.systemMenuName && (
              <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                <Box sx={{ position: 'absolute', left: 0 }}>
                  <IconButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      toggleRow(params.row.key)
                    }}
                  >
                    <IconCustom
                      isCommon
                      path='table'
                      icon={expandedRows.includes(params.row.key) ? 'unfolding' : 'folding'}
                    />
                  </IconButton>
                </Box>
              </Box>
            )}
          </>
        )
      },
      defaultSettingName: (params: any) => {
        return <Box>{params.value}</Box>
      },
      modifySettingName: (params: any) => {
        if (params.row.systemMenuName) return <></>

        return (
          <Box>
            {params.row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={params.value}
                onChange={e => updateDataItem(params.row.key, { modifySettingName: e.target.value })}
              />
            ) : (
              params.value
            )}
          </Box>
        )
      },
      modify: (params: any) => {
        return (
          <Box>
            <ModifyActions
              row={params.row}
              isModify={params.row.isEdit}
              handleEditClick={() => {
                updateDataItem(params.row.key, { isEdit: true })
              }}
              handleCancelClick={() => {
                handleCancelClick(params.row.key)
              }}
              handleSaveClick={() => {
                handleSaveClick(params.row.key)
              }}
            />
          </Box>
        )
      }
    }
  })

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <HorizontalScrollBox>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 3,
                gap: 3,
                width: '100%'
              }}
            >
              <Box sx={{ display: 'flex', gap: 3 }}>
                <LayoutControlPanel
                  menuName='고객사'
                  companyId={companyId}
                  companyName={companyName}
                  onClick={() => {
                    layoutContext.setLayoutDisplay(!layoutContext.layoutDisplay)
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  variant={'outlined'}
                  onClick={async () => {
                    // 저장 로직 구현 필요
                  }}
                >
                  저장
                </Button>
                <Button
                  variant={'outlined'}
                  onClick={() => {
                    // 취소 로직 구현 필요
                  }}
                >
                  취소
                </Button>
              </Box>
            </Box>
          </HorizontalScrollBox>

          {data.dataList && <OneDepthTable data={data} columns={columnsTemp} expandedRows={expandedRows} />}
        </Card>
      </Grid>
    </Grid>
  )
}

export default CamerasClientList
