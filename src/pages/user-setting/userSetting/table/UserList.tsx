import { FC, useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import DividerBar from 'src/@core/components/atom/DividerBar'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import { getUserColumns } from 'src/@core/components/table/columns/userColumns'
import CustomTable from 'src/@core/components/table/CustomTable'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useUser } from 'src/hooks/useUser'
import IconCustom from 'src/layouts/components/IconCustom'
import { MUserCompanyList } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel, useUserStateMod } from 'src/service/setting/userSetting'
import UserAddModModal from '../modal/UserAddModModal'

interface IUserList {
  data: MUserCompanyList[]
  refetch: () => void
}

const UserList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: userDel } = useUserArrDel()
  const { selectedUser, setSelectedUser } = useUser()
  const { layoutDisplay, setLayoutDisplay, companyId, companyName } = useLayout()
  const [userData, setUserData] = useState<MUserCompanyList[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<MUserCompanyList>()
  const { mutateAsync: modStateUser } = useUserStateMod()
  const { user } = useAuth()

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setUserData(data.map(obj => ({ ...obj, display: true })))
    } else {
      setUserData([])
    }
  }, [data])

  const userDeleteFn = async (id: number) => {
    const result = window.confirm('정말삭제 하시겠습니까?')

    if (result) {
      await userDel({ userNos: [id] })
      refetch()
    }
  }

  const columns = getUserColumns({
    modStateUser,
    userData,
    setUserData,
    setSelectUser,
    setIsOpen,
    userDeleteFn,
    userInfo: user?.userInfo
  })

  const handleCheckboxSelection = (selectedRows: any[]) => {
    setSelectedUser(selectedRows)
  }

  return (
    <>
      {isOpen && (
        <UserAddModModal
          isOpen={isOpen}
          selectUser={selectUser}
          onClose={() => {
            setIsOpen(false)
          }}
          onSubmitAfter={() => {
            refetch()
          }}
        />
      )}

      <Grid container>
        <Grid item xs={12}>
          <HorizontalScrollBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3, width: '100%' }}>
              <LayoutControlPanel
                menuName='고객사'
                companyId={companyId}
                companyName={companyName}
                onClick={() => {
                  setLayoutDisplay(!layoutDisplay)
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={'contained'}
                  startIcon={<IconCustom isCommon icon='plus' />}
                  onClick={() => {
                    setSelectUser(undefined)
                    setIsOpen(true)
                  }}
                >
                  사용자 추가
                </Button>

                <Button
                  variant={'contained'}
                  startIcon={<IconCustom isCommon icon='minus' />}
                  onClick={async () => {
                    const result = window.confirm('정말삭제 하시겠습니까?')

                    if (result) {
                      const userNos = selectedUser.map(user => user.userNo)
                      await userDel({ userNos })
                      refetch()
                    }
                  }}
                >
                  사용자 삭제
                </Button>
              </Box>
            </Box>
          </HorizontalScrollBox>
          <Box sx={{ maxHeight: '33.5vh', overflow: 'auto' }}>
            <CustomTable
              id='userNo'
              rows={userData}
              columns={columns}
              onCheckboxSelectionChange={handleCheckboxSelection}
              isAllView
              enablePointer
              selectRowEvent={e => {
                // userContext.setSelectedGroupId(e.group.id)
              }}
            />
            <DividerBar />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default UserList
