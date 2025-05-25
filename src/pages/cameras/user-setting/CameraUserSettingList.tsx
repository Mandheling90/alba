import { Box, Button, Grid } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import { CameraPageType } from 'src/context/CamerasContext'
import { EMenuType, YN } from 'src/enum/commonEnum'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import { MClientCameraList } from 'src/model/cameras/CamerasModel'
import { useClientCameraUserAuth, useClientCameraUserAuthUpdate } from 'src/service/cameras/camerasService'
import styled from 'styled-components'

import { getCameraColumns } from 'src/@core/components/table/columns/cameraColumns'
import { getUserColumns } from 'src/@core/components/table/columns/userColumns'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { useAuth } from 'src/hooks/useAuth'
import { MUserCompanyList } from 'src/model/userSetting/userSettingModel'
import { useUserCompanyList } from 'src/service/setting/userSetting'
import { getAuthMenu } from 'src/utils/CommonUtil'

const ButtonHoverIconList = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface CamerasClientListProps {
  columnFilter?: string[]
  cameraPage?: CameraPageType
}

const CameraUserSettingList: FC<CamerasClientListProps> = ({ columnFilter, cameraPage }) => {
  const { clientCameraData, setSelectedCamera, viewType, fetchData } = useCameras()

  const { companyNo, companyId, companyName } = useLayout()
  const { data: UserCompanyList, refetch: UserCompanyListRefetch } = useUserCompanyList({ companyNo })
  const { mutateAsync: clientCameraUserAuth } = useClientCameraUserAuth()
  const { mutateAsync: clientCameraUserAuthUpdate } = useClientCameraUserAuthUpdate()

  const [userData, setUserData] = useState<MUserCompanyList[]>([])
  const layoutContext = useLayout()
  const [cameraColumns, setCameraColumns] = useState<any[]>([])
  const [userColumns, setUserColumns] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<MUserCompanyList | undefined>(undefined)
  const [accessibleCameraList, setAccessibleCameraList] = useState<number[]>([])
  const [orgAccessibleCameraList, setOrgAccessibleCameraList] = useState<number[]>([])

  const { user } = useAuth()

  useEffect(() => {
    fetchData()
    setSelectedUser(undefined)
    setAccessibleCameraList([])
    setOrgAccessibleCameraList([])
  }, [companyNo])

  useEffect(() => {
    if (UserCompanyList?.data && Array.isArray(UserCompanyList.data)) {
      setUserData(UserCompanyList.data.map(obj => ({ ...obj, display: true })))
    }
  }, [UserCompanyList])

  const fetchClientCameraUserAuthData = async () => {
    if (!selectedUser?.userNo) {
      setAccessibleCameraList([])
      setOrgAccessibleCameraList([])

      return
    }

    try {
      const res = await clientCameraUserAuth({ companyNo, userNo: selectedUser.userNo })
      setAccessibleCameraList(res.data)
      setOrgAccessibleCameraList(res.data)
    } catch (error) {
      setAccessibleCameraList([])
      setOrgAccessibleCameraList([])
    }
  }

  useEffect(() => {
    fetchClientCameraUserAuthData()
  }, [selectedUser])

  useEffect(() => {
    const newColumns = getCameraColumns({
      columnFilter: ['group', 'cameraId', 'cameraName'],
      showGroupHeader: false
    })
    setCameraColumns(newColumns)

    const newColumns2 = getUserColumns({
      userData,
      columnFilter: ['name', 'name2', 'authName'],
      isShowTooltip: true,
    })
    setUserColumns(newColumns2)
  }, [cameraPage])

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

  const handleCheckboxSelectionChange = (selectedRows: any[]) => {
    const cameraNos = selectedRows.map(row => row.cameraNo)
    setAccessibleCameraList(cameraNos)
  }

  return (
    <Grid container>
      <Grid item xs={12}>
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

            {getAuthMenu(user?.userInfo?.authMenuList ?? [], EMenuType['사용자별카메라설정'])?.createYn === YN.Y && (
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  variant={'outlined'}
                  onClick={async () => {
                    await clientCameraUserAuthUpdate({
                      companyNo,
                      userNo: selectedUser?.userNo ?? 0,
                      cameraNoList: accessibleCameraList.map(cameraNo => ({ cameraNo }))
                    })

                    fetchClientCameraUserAuthData()
                  }}
                >
                  저장
                </Button>
                <Button
                  variant={'outlined'}
                  onClick={() => {
                    setAccessibleCameraList(orgAccessibleCameraList)
                  }}
                >
                  취소
                </Button>
              </Box>
            )}
          </Box>
        </HorizontalScrollBox>
        <Box sx={{ display: 'flex', width: '100%', gap: 3 }}>
          <Box sx={{ width: '50%' }}>
            <CustomTable
              id='userNo'
              rows={userData}
              columns={userColumns}
              isAllView
              enablePointer
              selectRowEvent={e => {
                setSelectedUser(Object.keys(e).length === 0 ? undefined : e)
              }}
            />
          </Box>

          <Box sx={{ width: '50%' }}>
            <CustomTable
              combineTableId={'camera'}
              id='cameraNo'
              showMoreButton={false}
              rows={clientCameraData ?? []}
              columns={cameraColumns}
              selectRowEvent={selectRowEvent}
              isAllView
              onCheckboxSelectionChange={
                getAuthMenu(user?.userInfo?.authMenuList ?? [], EMenuType['사용자별카메라설정'])?.createYn === YN.Y
                  ? handleCheckboxSelectionChange
                  : undefined
              }
              defaultSelectedCheckboxes={accessibleCameraList}
              disableCheckboxSelection={!selectedUser}
              enablePointer
              showHeader
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default CameraUserSettingList
