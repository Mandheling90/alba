import { FC, useEffect, useState } from 'react'

import { Box, Button, IconButton, Switch, Typography } from '@mui/material'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomTable from 'src/@core/components/table/CustomTable'
import { CRUD, YN } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useModal } from 'src/hooks/useModal'
import { useUser } from 'src/hooks/useUser'
import IconCustom from 'src/layouts/components/IconCustom'
import { MAuthList } from 'src/model/userSetting/userSettingModel'
import { useAuthStatusMod, useDelAuth } from 'src/service/setting/userSetting'

interface IUserList {
  data: MAuthList[]
  refetch: () => void
}

const RoleList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: authDel } = useDelAuth()
  const { mutateAsync: authStatusMod } = useAuthStatusMod()
  const { selectedAuthList, setSelectedAuthList, selectedUser } = useUser()
  const [userData, setUserData] = useState<MAuthList[]>([])
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined)
  const { user } = useAuth()
  const { setSimpleDialogModalProps } = useModal()

  useEffect(() => {
    setUserData(data.map(obj => ({ ...obj, display: true })))
  }, [data])

  const authDeleteFn = async (id: number) => {
    setSimpleDialogModalProps({
      open: true,
      title: '사용자권한 삭제',
      contents: (
        <Typography variant='body2'>
          선택하신 <b>권한을</b> 정말 <b>삭제</b>하시겠습니까? 삭제 후에는 <b>복원할 수 없습니다.</b>
        </Typography>
      ),
      isConfirm: true,
      confirmFn: async () => {
        await authDel({ authId: id })

        setSimpleDialogModalProps({
          open: true,
          title: '사용자 권한 삭제 확인',
          contents: '선택하신 사용자 권한이 삭제되었습니다.'
        })

        refetch()
      }
    })
  }

  useEffect(() => {
    if (selectedUser?.authId) {
      const auth = userData.find(obj => obj.authId === selectedUser?.authId)
      if (auth) {
        setSelectedAuthList({ ...auth, type: CRUD.U })
        setSelectedRow(selectedUser.authId)
      }
    }
  }, [selectedUser])

  useEffect(() => {
    if (selectedAuthList?.authId) {
      setSelectedRow(selectedAuthList.authId)
    }
  }, [selectedAuthList])

  const columns = [
    { field: 'name', headerName: '사용자권한명', flex: 1 },
    { field: 'userAuthCount', headerName: '사용자수', flex: 1 },
    {
      field: 'status',
      headerName: '상태',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Switch
            disabled={row.authId === user?.userInfo?.authId}
            checked={row.dataStatus === YN.Y}
            onChange={event => {
              authStatusMod({ authId: row.authId, dataStatus: event.target.checked ? YN.Y : YN.N })
              const updatedList = userData.map(user => {
                if (user.authId === row.authId) {
                  return { ...user, dataStatus: event.target.checked ? YN.Y : YN.N }
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
              disabled={row.authId === user?.userInfo?.authId}
              onClick={e => {
                setSelectedAuthList({
                  authId: row.authId,
                  name: row.name,
                  userAuthCount: row.userAuthCount,
                  type: CRUD.U
                })
              }}
            >
              <IconCustom path='settingCard' icon='pen' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              disabled={row.authId === user?.userInfo?.authId}
              onClick={e => {
                authDeleteFn(row.authId)
              }}
            >
              <IconCustom path='settingCard' icon='delete' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
          </>
        )
      }
    }
  ]

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', m: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={'contained'}
            startIcon={<IconCustom isCommon icon='plus' />}
            onClick={() => {
              setSelectedAuthList({ authId: 0, name: '', userAuthCount: 0, type: CRUD.C })
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
      <Box>
        <CustomTable
          id='authId'
          showMoreButton={false}
          rows={userData}
          columns={columns}
          isAllView
          requireSingleSelection
          externalCheckboxControl
          initialSelectedRow={selectedRow}
          selectRowEvent={e => {
            // console.log(e)
          }}
        />

        <DividerBar />
      </Box>
    </>
  )
}

export default RoleList
