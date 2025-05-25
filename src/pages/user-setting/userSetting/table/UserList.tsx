import { FC, useEffect, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import DividerBar from 'src/@core/components/atom/DividerBar'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import { getUserColumns } from 'src/@core/components/table/columns/userColumns'
import CustomTable from 'src/@core/components/table/CustomTable'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useModal } from 'src/hooks/useModal'
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
  const { selectedUserList, setSelectedUserList, setSelectedUser } = useUser()
  const { layoutDisplay, setLayoutDisplay, companyId, companyName } = useLayout()
  const [userData, setUserData] = useState<MUserCompanyList[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<MUserCompanyList>()
  const { mutateAsync: modStateUser } = useUserStateMod()
  const { user } = useAuth()
  const { setSimpleDialogModalProps } = useModal()

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setUserData(data.map(obj => ({ ...obj, display: true })))
    } else {
      setUserData([])
    }
  }, [data])

  const userDeleteFn = async (id: number) => {
    setSimpleDialogModalProps({
      open: true,
      title: '사용자 삭제',
      contents: (
        <Typography variant='body2'>
          선택하신 <b>사용자</b>를 정말 <b>삭제</b>하시겠습니까? 삭제 후에는 <b>복원할 수 없습니다.</b>
        </Typography>
      ),
      isConfirm: true,
      confirmFn: async () => {
        await userDel({ userNos: [id] })

        setSimpleDialogModalProps({
          open: true,
          title: '사용자 삭제 확인',
          contents: '선택하신 사용자가 삭제되었습니다.'
        })

        refetch()
      }
    })
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
    setSelectedUserList(selectedRows)
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
                      const userNos = selectedUserList.map(user => user.userNo)
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
          <Box>
            <CustomTable
              id='userNo'
              rows={userData}
              columns={columns}
              onCheckboxSelectionChange={handleCheckboxSelection}
              isAllView
              enablePointer
              selectRowEvent={e => {
                setSelectedUser(e)
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
