import { Box, Button, Card, Grid, IconButton } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import { useLayout } from 'src/hooks/useLayout'

import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import { generateColumns } from 'src/@core/components/table/columns/columnGenerator'
import OneDepthTable from 'src/@core/components/table/depthTable/OneDepthTable'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { EResultCode } from 'src/enum/commonEnum'
import { useModal } from 'src/hooks/useModal'
import IconCustom from 'src/layouts/components/IconCustom'
import { IConfig, IDepth1List, IDepth2List } from 'src/model/statistics/StatisticsModel'
import ModifyActions from 'src/pages/cameras/table/ModifyActions'
import { useConfig, useConfigMulti, useConfigSingle } from 'src/service/statistics/statisticsService'
import { getErrorMessage } from 'src/utils/CommonUtil'

const StatTermList: FC = () => {
  const { companyNo, companyId, companyName } = useLayout()
  const { data: configData, refetch } = useConfig(companyNo)
  const { mutateAsync: configMulti } = useConfigMulti()
  const { mutateAsync: configSingle } = useConfigSingle()

  const layoutContext = useLayout()
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [data, setData] = useState<IConfig>({ dataList: [] })
  const [dataOrigin, setDataOrigin] = useState<IConfig>({ dataList: [] })

  const { setSimpleDialogModalProps } = useModal()

  const handleCancelClick = useCallback(
    (id: number) => {
      setData(prev => {
        const newDataList = prev.dataList.map(item => {
          if (item.id === id) {
            const originItem = dataOrigin.dataList.find(origin => origin.id === id)
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
                if (subItem.id === id) {
                  const originParent = dataOrigin.dataList.find(origin => origin.dataList?.some(sub => sub.id === id))
                  const originSubItem = originParent?.dataList?.find(origin => origin.id === id)
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
    async (id: number) => {
      try {
        // 1뎁스와 2뎁스에서 key에 해당하는 항목 찾기
        let targetItem = null
        let targetValue = ''

        // 1뎁스 검색
        const depth1Item = data.dataList.find(item => item.id === id)
        if (depth1Item) {
          targetItem = depth1Item
          targetValue = depth1Item.changeConfigValue || ''
        } else {
          // 2뎁스 검색
          for (const depth1Item of data.dataList) {
            if (depth1Item.dataList) {
              const depth2Item = depth1Item.dataList.find(item => item.id === id)
              if (depth2Item) {
                targetItem = depth2Item
                targetValue = depth2Item.changeConfigValue || ''
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
          id: id,
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
            if (item.id === id) {
              const updatedItem = data.dataList.find(updated => updated.id === id)
              if (updatedItem) {
                return { ...updatedItem, isEdit: false }
              }
            }

            if (item.dataList) {
              return {
                ...item,
                dataList: item.dataList.map(subItem => {
                  if (subItem.id === id) {
                    const updatedSubItem = item.dataList?.find(updated => updated.id === id)
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
            if (item.id === id) {
              return { ...item, isEdit: false }
            }

            if (item.dataList) {
              return {
                ...item,
                dataList: item.dataList.map(subItem => (subItem.id === id ? { ...subItem, isEdit: false } : subItem))
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

  const toggleRow = useCallback((id: number) => {
    setExpandedRows(prev => (prev.includes(id) ? prev.filter(row => row !== id) : [...prev, id]))
  }, [])

  const updateDataItem = useCallback((id: number, updates: Partial<IDepth1List | IDepth2List>) => {
    setData(prev => ({
      ...prev,
      dataList: prev.dataList.map(item => {
        if (item.id === id) {
          return { ...item, ...updates }
        }

        if (item.dataList) {
          return {
            ...item,
            dataList: item.dataList.map(subItem => (subItem.id === id ? { ...subItem, ...updates } : subItem))
          }
        }

        return item
      })
    }))
  }, [])

  useEffect(() => {
    if (!configData?.data) return

    setData(configData.data)
    setDataOrigin(configData.data)
  }, [configData])

  const columnsTemp = generateColumns({
    columns: [
      {
        field: `toggle`,
        headerName: ``,
        type: 'string'
      },
      {
        field: `menuName`,
        headerName: `시스템 메뉴명`,
        type: 'string'
      },
      {
        field: `menuPosition`,
        headerName: `메뉴 위치`,
        type: 'string'
      },
      {
        field: `defaultConfigValue`,
        headerName: `기본설정`,
        type: 'string'
      },
      { field: 'changeConfigValue', headerName: '변경설정', type: 'string' },
      { field: 'modify', headerName: '편집', type: 'string', flex: 0.3 }
    ],
    customRenderers: {
      toggle: (params: any) => {
        return (
          <>
            {params.row.menuName && (
              <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
                <Box sx={{ position: 'absolute', left: 0 }}>
                  <IconButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      toggleRow(params.row.id)
                    }}
                  >
                    <IconCustom
                      isCommon
                      path='table'
                      icon={expandedRows.includes(params.row.id) ? 'unfolding' : 'folding'}
                    />
                  </IconButton>
                </Box>
              </Box>
            )}
          </>
        )
      },
      defaultConfigValue: (params: any) => {
        return <>{!params.row.menuName && <Box>{params.value}</Box>}</>
      },
      changeConfigValue: (params: any) => {
        return (
          <Box>
            {params.row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={params.value}
                onChange={e => {
                  updateDataItem(params.row.id, { changeConfigValue: e.target.value })
                }}
                onKeyDown={e => {
                  if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.stopPropagation()
                  }
                }}
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
                updateDataItem(params.row.id, { isEdit: true })
              }}
              handleCancelClick={() => {
                handleCancelClick(params.row.id)
              }}
              handleSaveClick={() => {
                handleSaveClick(params.row.id)
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
                        dataList: data.dataList
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

          {data && <OneDepthTable data={data} columns={columnsTemp} expandedRows={expandedRows} keyField='id' />}
        </Card>
      </Grid>
    </Grid>
  )
}

export default StatTermList
