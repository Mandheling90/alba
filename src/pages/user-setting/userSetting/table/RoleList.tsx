import { FC, useEffect, useState } from 'react'

import { Box, Button, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useAuth } from 'src/hooks/useAuth'
import { useUser } from 'src/hooks/useUser'
import IconCustom from 'src/layouts/components/IconCustom'
import { MUserGroup, UserListAll } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel, useUserMod } from 'src/service/setting/userSetting'
import UserAddModModal from '../modal/UserAddModModal'

interface IUserList {
  data: MUserGroup[]
  refetch: () => void
}

const RoleList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: userDel } = useUserArrDel()
  const { mutateAsync: modUser } = useUserMod()

  const userContext = useUser()

  const [userData, setUserData] = useState<MUserGroup[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<UserListAll>()

  const auth = useAuth()

  useEffect(() => {
    setUserData(data.map(obj => ({ ...obj, display: true })))
  }, [data])

  const userDeleteFn = async (id: string) => {
    const result = window.confirm('정말삭제 하시겠습니까?')

    if (result) {
      await userDel({ idList: [id] })
      refetch()
    }
  }

  const columns = [
    { field: 'name', headerName: '사용자권한명명', flex: 1 },
    { field: 'users', headerName: '사용자수', flex: 1 },
    {
      field: 'status',
      headerName: '상태',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Switch
            checked={row.dataStatus === 'Y'}
            onChange={event => {
              modUser({ id: row.id, status: event.target.checked ? 1 : 0 })
              const updatedList = userData.map(user => {
                if (user.id === row.id) {
                  return { ...user, status: event.target.checked ? 1 : 0 }
                }

                return user
              })
              setUserData(updatedList)
            }}
          />
        )
      }
    },
    {
      field: 'updateDelete',
      headerName: '수정 및 삭제',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <>
            <IconButton
              sx={{ color: 'text.secondary' }}
              disabled={row.id === auth?.user?.userInfo?.id}
              onClick={e => {
                setSelectUser(row)
                setIsOpen(true)
              }}
            >
              {row.id !== auth?.user?.userInfo?.id && <IconCustom path='settingCard' icon='pen' />}

              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              disabled={row.id === auth?.user?.userInfo?.id}
              onClick={e => {
                userDeleteFn(row.id)
              }}
            >
              {row.id !== auth?.user?.userInfo?.id && <IconCustom path='settingCard' icon='delete' />}

              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
          </>
        )
      }
    }
  ]

  const handleCheckboxSelection = (selectedRows: any[]) => {
    console.log(selectedRows)
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

      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', m: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={'contained'}
              startIcon={<IconCustom isCommon icon='plus' />}
              onClick={() => {
                // setIsOpen(true)
              }}
              sx={{
                clipPath: 'polygon(0 0, 80% 0, 95% 50%, 80% 100%, 0 100%, 0% 50%)',
                paddingRight: '2rem'
              }}
            >
              권한 추가
            </Button>
          </Box>
        </Box>
        <Box sx={{ minHeight: '32vh', maxHeight: '32vh', overflow: 'auto' }}>
          <CustomTable
            showMoreButton={false}
            rows={userData}
            columns={columns}
            isAllView
            checkboxSelection={false}

            // enablePointer
            // selectRowEvent={handleCheckboxSelection}
          />
        </Box>
      </Card>
    </>
  )
}

export default RoleList
