import { FC, useEffect, useState } from 'react'

import { Box, Button, IconButton, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import DividerBar from 'src/@core/components/atom/DividerBar'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useUser } from 'src/hooks/useUser'
import IconCustom from 'src/layouts/components/IconCustom'
import { MUserCompanyList } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel } from 'src/service/setting/userSetting'
import UserAddModModal from '../modal/UserAddModModal'

interface IUserList {
  data: MUserCompanyList[]
  refetch: () => void
}

const UserList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: userDel } = useUserArrDel()

  const { setUserGroupInfo } = useUser()

  const layoutContext = useLayout()

  const [userData, setUserData] = useState<MUserCompanyList[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<MUserCompanyList>()

  const auth = useAuth()

  useEffect(() => {
    if (data) {
      setUserData(data.map(obj => ({ ...obj, display: true })))
    }
  }, [data])

  const userDeleteFn = async (id: string) => {
    const result = window.confirm('정말삭제 하시겠습니까?')

    if (result) {
      await userDel({ idList: [id] })
      refetch()
    }
  }

  const columns = [
    { field: 'name', headerName: '사용자명', flex: 1 },
    {
      field: 'name2',
      headerName: '사용자 ID',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.name}
          </Typography>
        )
      }
    },
    { field: 'mailAddress', headerName: '이메일 주소', flex: 1 },
    {
      field: 'authName',
      headerName: '권한',
      flex: 1
    },
    {
      field: 'userStatus',
      headerName: '상태',
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return (
          <Switch
            checked={row.userStatus === 1}
            onChange={event => {
              // modUser({ id: row.id, userStatus: event.target.checked ? 1 : 0 })
              // const updatedList = userData.map(user => {
              //   if (user.id === row.id) {
              //     return { ...user, userStatus: event.target.checked ? 1 : 0 }
              //   }
              //   return user
              // })
              // setUserData(updatedList)
            }}

            // disabled={row.id === auth?.user?.userInfo?.id}
          />
        )
      }
    },
    {
      field: 'updateDelete',
      headerName: '수정 및 삭제',
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                setSelectUser(row)
                setIsOpen(true)
              }}
            >
              <IconCustom path='settingCard' icon='pen' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                userDeleteFn(row.id)
              }}
            >
              <IconCustom path='settingCard' icon='delete' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
          </Box>
        )
      }
    }
  ]

  const handleCheckboxSelection = (selectedRows: any[]) => {
    setUserGroupInfo(selectedRows)
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3 }}>
            <LayoutControlPanel
              menuName='사용자'
              id='user'
              selectedTarget='user'
              onClick={() => {
                layoutContext.setLayoutDisplay(!layoutContext.layoutDisplay)
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
                    // await userDel({ idList: userCheck })
                    // refetch()
                  }
                }}
              >
                사용자 삭제
              </Button>
            </Box>
          </Box>
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
