import { Box, Button, Card, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import ButtonHover from 'src/@core/components/atom/ButtonHover'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import { CameraPageType } from 'src/context/CamerasContext'
import { YN } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList, MClientGroupCameraList } from 'src/model/cameras/CamerasModel'
import { useClientGroupAdd, useClientGroupStatus } from 'src/service/cameras/camerasService'
import styled from 'styled-components'

import { getCameraColumns } from 'src/@core/components/table/columns/cameraColumns'
import GroupList from './GroupList'

const ButtonHoverIconList = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface CamerasClientListProps {
  columnFilter?: string[]
  cameraPage?: CameraPageType
}

const CamerasClientList: FC<CamerasClientListProps> = ({ columnFilter, cameraPage }) => {
  const {
    clientCameraData,
    setClientCameraData,
    clientGroupCameraData,
    setClientGroupCameraData,
    groupModifyId,
    setGroupModifyId,
    isGroupModifyMode,
    setIsGroupModifyMode,
    updateClientCameraData,
    handleSaveClick,
    handleCancelClick,
    setSelectedCamera,
    mapModifyModCameraId,
    setMapModifyModCameraId,
    viewType,
    clientCameraDataOrigin,
    fetchData,
    removeDuplicateCameras,
    handleGroupSaveClick,
    addGroupCamera,
    handleGroupCancelClick
  } = useCameras()

  const { companyNo, companyId, companyName } = useLayout()
  const { user } = useAuth()

  const layoutContext = useLayout()
  const [draggedRow, setDraggedRow] = useState<MClientCameraList | null>(null)
  const [isGroupMode, setIsGroupMode] = useState<boolean>(false)
  const [columns, setColumns] = useState<any[]>([])

  const { mutateAsync: clientGroupAdd } = useClientGroupAdd()
  const { mutateAsync: clientGroupStatus } = useClientGroupStatus()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [companyNo])

  useEffect(() => {
    const newColumns = getCameraColumns({
      isGroupMode,
      setIsGroupMode,
      updateClientCameraData,
      handleCancelClick,
      handleSaveClick,
      isGroupModifyMode,
      viewType,
      setMapModifyModCameraId,
      mapModifyModCameraId,
      clientGroupStatus,
      companyNo,
      columnFilter,
      showGroupHeader: cameraPage !== 'user-setting'
    })
    setColumns(newColumns)
  }, [cameraPage])

  const handleDragStart = (row: MClientCameraList) => {
    setDraggedRow(row)
  }

  const handleDragEnd = () => {
    setDraggedRow(null)
  }

  const handleDrop = () => {
    if (draggedRow && clientCameraData && groupModifyId) {
      addGroupCamera(groupModifyId, draggedRow)
    }
  }

  const selectRowEvent = (row: MClientCameraList) => {
    if (viewType.type === 'image' && row.flowPlanBindingYN === YN.N) {
      return
    }

    if (Object.keys(row).length === 0) {
      setSelectedCamera(null)
    } else {
      setSelectedCamera([row])
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3, gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <LayoutControlPanel
                menuName='고객사'
                companyId={companyId}
                companyName={companyName}
                onClick={() => {
                  layoutContext.setLayoutDisplay(!layoutContext.layoutDisplay)
                }}
              />
              {cameraPage !== 'user-setting' && (
                <>
                  <ButtonHover
                    display={
                      <Button
                        variant={'contained'}
                        sx={{ width: '160px', height: '40px' }}
                        startIcon={<IconCustom isCommon path='camera' icon='cameraAddDel' />}
                      >
                        등록 및 수정
                      </Button>
                    }
                    hover={
                      <Button
                        variant={'contained'}
                        sx={{ width: '160px', height: '40px', display: 'flex', justifyContent: 'space-between' }}
                        onClick={() => {
                          router.push({
                            pathname: '/clients/clientsAdd',
                            query: {
                              mode: 'edit',
                              id: companyNo
                            }
                          })
                        }}
                      >
                        <ButtonHoverIconList

                        // onClick={() => {
                        //   console.log('add')
                        // }}
                        >
                          <IconCustom isCommon path='camera' icon='cameraAdd' />
                        </ButtonHoverIconList>
                        <ButtonHoverIconList

                        // onClick={() => {
                        //   console.log('del')
                        // }}
                        >
                          <IconCustom isCommon path='camera' icon='cameraDel' />
                        </ButtonHoverIconList>
                        <ButtonHoverIconList

                        // onClick={() => {
                        //   console.log('mod')
                        // }}
                        >
                          <IconCustom isCommon path='camera' icon='cameraMod' />
                        </ButtonHoverIconList>
                      </Button>
                    }
                  />

                  <ButtonHover
                    display={
                      <Button variant={'contained'} startIcon={<IconCustom isCommon path='camera' icon='group-add' />}>
                        그룹생성
                      </Button>
                    }
                    hover={
                      <Button
                        variant={'contained'}
                        startIcon={<IconCustom isCommon path='camera' icon='group-open-blank' />}
                        onClick={async () => {
                          if (!clientGroupCameraData) return

                          try {
                            // const res = await clientGroupAdd({ userNo: user?.userInfo?.userNo ?? 0, name: '새로운 그룹' })
                            // console.log(res.data.groupId)

                            // 새로운 그룹 ID 생성 (기존 그룹 ID 중 최대값 + 1)
                            const newGroupId = clientGroupCameraData.length + 1

                            // 새로운 그룹 생성
                            const newGroup: MClientGroupCameraList = {
                              groupId: newGroupId,
                              userNo: user?.userInfo?.userNo ?? 0,
                              groupName: '새로운 그룹',
                              groupItemList: []
                            }

                            // 그룹 데이터 업데이트
                            setClientGroupCameraData(prevData => {
                              if (!prevData) return [newGroup]

                              return [...prevData, newGroup]
                            })

                            // 그룹 수정 모드 활성화
                            setGroupModifyId(newGroupId)
                            setIsGroupModifyMode(true)
                          } catch (error) {
                            console.log(error)
                          }
                        }}
                      >
                        그룹생성
                      </Button>
                    }
                  />
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant={'outlined'}
                onClick={async () => {
                  if (!isGroupMode) {
                    handleSaveClick(undefined)
                  } else {
                    handleGroupSaveClick(undefined)
                  }
                }}
              >
                저장
              </Button>
              <Button
                variant={'outlined'}
                onClick={() => {
                  setSelectedCamera(null)

                  if (!isGroupMode) {
                    handleCancelClick(undefined)
                  } else {
                    handleGroupCancelClick(undefined)
                  }
                }}
              >
                취소
              </Button>
            </Box>
          </Box>

          <CustomTable
            combineTableId={'camera'}
            id='cameraId'
            showMoreButton={false}
            rows={isGroupModifyMode ? removeDuplicateCameras() : clientCameraData ?? []}
            columns={columns}
            selectRowEvent={selectRowEvent}
            isAllView
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            enablePointer
            showHeader
            hideRows={isGroupModifyMode ? false : isGroupMode}
          />

          {isGroupMode &&
            clientGroupCameraData?.map((group, index) => (
              <>
                <GroupList
                  key={index}
                  group={group}
                  clientColumns={columns}
                  handleClose={() => {
                    setIsGroupModifyMode(false)
                    setClientCameraData(clientCameraDataOrigin ?? [])
                    setGroupModifyId(null)
                  }}
                  handleGroupModifyId={() => {
                    setIsGroupModifyMode(true)
                    setGroupModifyId(group.groupId)
                  }}
                  onDrop={() => handleDrop()}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  selectRowEvent={selectRowEvent}
                />
              </>
            ))}
        </Card>
      </Grid>
    </Grid>
  )
}

export default CamerasClientList
