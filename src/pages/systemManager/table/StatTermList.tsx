import { Box, Button, Card, Grid, IconButton } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import { CameraPageType } from 'src/context/CamerasContext'
import { useLayout } from 'src/hooks/useLayout'
import styled from 'styled-components'

import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import { generateColumns } from 'src/@core/components/table/columns/columnGenerator'
import OneDepthTable from 'src/@core/components/table/depthTable/OneDepthTable'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { EResultCode } from 'src/enum/commonEnum'
import { useModal } from 'src/hooks/useModal'
import IconCustom from 'src/layouts/components/IconCustom'
import ModifyActions from 'src/pages/cameras/table/ModifyActions'
import { useConfig, useConfigMulti, useConfigSingle } from 'src/service/statistics/statisticsService'
import { getErrorMessage } from 'src/utils/CommonUtil'

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
  const { data: configData, refetch } = useConfig(companyNo)
  const { mutateAsync: configMulti } = useConfigMulti()
  const { mutateAsync: configSingle } = useConfigSingle()

  const layoutContext = useLayout()
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [data, setData] = useState<DataState>({ dataList: [] })
  const [dataOrigin, setDataOrigin] = useState<DataState>({ dataList: [] })

  const { setSimpleDialogModalProps } = useModal()

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
    async (key: string) => {
      try {
        // 1뎁스와 2뎁스에서 key에 해당하는 항목 찾기
        let targetItem = null
        let targetValue = ''

        // 1뎁스 검색
        const depth1Item = data.dataList.find(item => item.key === key)
        if (depth1Item) {
          targetItem = depth1Item
          targetValue = depth1Item.systemMenuName || ''
        } else {
          // 2뎁스 검색
          for (const depth1Item of data.dataList) {
            if (depth1Item.dataList) {
              const depth2Item = depth1Item.dataList.find(item => item.key === key)
              if (depth2Item) {
                targetItem = depth2Item
                targetValue = depth2Item.modifySettingName || ''
                break
              }
            }
          }
        }

        if (!targetItem) {
          throw new Error('해당하는 항목을 찾을 수 없습니다.')
        }

        const res = await configSingle({
          companyNo: companyNo,
          id: parseInt(key),
          changeConfigValue: targetValue
        })

        if (res.code !== EResultCode.SUCCESS) {
          throw new Error('저장에 실패했습니다.')
        }

        setSimpleDialogModalProps({
          open: true,
          title: '저장이 완료되었습니다.'
        })

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
      } catch (error) {
        setSimpleDialogModalProps({
          open: true,
          title: getErrorMessage(error)
        })
      }
    },
    [data.dataList, configSingle, companyNo, setSimpleDialogModalProps]
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
    if (!configData?.data) return

    const dataList = configData.data.depth1List.map(item => {
      return {
        key: item.id.toString(),
        systemMenuName: item.menuName,
        dataList: item.depth2List.map(subItem => ({
          key: subItem.id.toString(),
          defaultSettingName: subItem.defaultConfigValue,
          modifySettingName: subItem.changeConfigValue
        }))
      }
    })

    setData({ dataList })
    setDataOrigin({ dataList })
  }, [configData])

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
                    try {
                      await configMulti({
                        companyNo: companyNo,
                        depth1List: data.dataList.map(item => ({
                          id: parseInt(item.key),
                          menuName: item.systemMenuName || '',
                          menuPosition: '0',
                          defaultConfigValue: '',
                          changeConfigValue: '',
                          depth2List:
                            item.dataList?.map(subItem => ({
                              id: parseInt(subItem.key),
                              menuName: '',
                              menuPosition: '0',
                              defaultConfigValue: subItem.defaultSettingName || '',
                              changeConfigValue: subItem.modifySettingName || ''
                            })) || []
                        }))
                      })

                      setSimpleDialogModalProps({
                        open: true,
                        title: '저장이 완료되었습니다.'
                      })

                      refetch()
                    } catch (error) {
                      setSimpleDialogModalProps({
                        open: true,
                        title: getErrorMessage(error)
                      })
                    }
                  }}
                >
                  저장
                </Button>
                <Button
                  variant={'outlined'}
                  onClick={() => {
                    setData(dataOrigin)
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
