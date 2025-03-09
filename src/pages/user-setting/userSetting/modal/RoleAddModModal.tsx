import { FC, useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { EResultCode, YN } from 'src/enum/commonEnum'
import { MRoleList, MUserGroup } from 'src/model/userSetting/userSettingModel'
import { useUserGroupMod, useUserGroupSave } from 'src/service/setting/userSetting'

interface IRoleAddModal {
  isOpen: boolean
  groupInfo?: MUserGroup & MRoleList
  onClose: () => void
  refetch: () => void
}

export const defaultValue = {
  dataStatus: YN.Y,
  id: 0,
  name: '',
  users: 0,
  roleList: [
    {
      viewName: '고객사 관리',
      fullAccess: YN.N,
      createYn: YN.N,
      updateYn: YN.N,
      deleteYn: YN.N,
      readYn: YN.N
    },
    {
      viewName: '사용자 관리',
      fullAccess: YN.N,
      createYn: YN.N,
      updateYn: YN.N,
      deleteYn: YN.N,
      readYn: YN.N
    },
    {
      viewName: '키오스크 관리',
      fullAccess: YN.N,
      createYn: YN.N,
      updateYn: YN.N,
      deleteYn: YN.N,
      readYn: YN.N
    },
    {
      viewName: '통계 및 로그 관리',
      fullAccess: YN.N,
      createYn: YN.N,
      updateYn: YN.N,
      deleteYn: YN.N,
      readYn: YN.N
    },
    {
      viewName: '모니터링',
      fullAccess: YN.N,
      createYn: YN.N,
      updateYn: YN.N,
      deleteYn: YN.N,
      readYn: YN.N
    }
  ]
}

const RoleAddModModal: FC<IRoleAddModal> = ({ isOpen, groupInfo, onClose, refetch }) => {
  const { mutateAsync: saveGroup } = useUserGroupSave()
  const { mutateAsync: modGroup } = useUserGroupMod()

  const [rows, setRows] = useState<MUserGroup & MRoleList>(groupInfo ? groupInfo : defaultValue)

  const updateState = (viewName: string, roleType: string, checked: YN) => {
    setRows(rows => ({
      ...rows,
      roleList: rows.roleList.map(role => {
        // fullAccess 변경 시 모든 권한을 동일하게 업데이트
        if (role.viewName === viewName && roleType === 'fullAccess') {
          return {
            ...role,
            fullAccess: checked,
            readYn: checked,
            createYn: checked,
            updateYn: checked,
            deleteYn: checked
          }
        }

        // 개별 권한만 업데이트할 경우
        return role.viewName === viewName ? { ...role, [roleType]: checked } : role
      })
    }))
  }

  const columns = [
    {
      field: 'viewName',
      headerName: '메뉴',
      flex: 0.1,
      minWidth: 90
    },
    {
      field: 'fullAccess',
      headerName: 'FULL ACCESS',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: any) => {
        return (
          <Checkbox
            checked={row.fullAccess === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              updateState(row.viewName, 'fullAccess', isChecked ? YN.Y : YN.N)
            }}
          />
        )
      }
    },
    {
      field: 'readYn',
      headerName: 'Read',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: any) => {
        if (row.viewName === '모니터링') return null // "모니터링"일 때 숨기기

        return (
          <Checkbox
            disabled={row.id === 1}
            checked={row.id === 1 ? true : row.readYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              updateState(row.viewName, 'readYn', isChecked ? YN.Y : YN.N)
            }}
          />
        )
      }
    },
    {
      field: 'createYn',
      headerName: 'Add',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: any) => {
        if (row.viewName === '모니터링') return null

        return (
          <Checkbox
            checked={row.createYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              updateState(row.viewName, 'createYn', isChecked ? YN.Y : YN.N)
            }}
          />
        )
      }
    },
    {
      field: 'updateYn',
      headerName: 'Edit',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: any) => {
        if (row.viewName === '모니터링') return null

        return (
          <Checkbox
            checked={row.updateYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              updateState(row.viewName, 'updateYn', isChecked ? YN.Y : YN.N)
            }}
          />
        )
      }
    },
    {
      field: 'deleteYn',
      headerName: 'Delete',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: any) => {
        if (row.viewName === '모니터링') return null

        return (
          <Checkbox
            checked={row.deleteYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              updateState(row.viewName, 'deleteYn', isChecked ? YN.Y : YN.N)
            }}
          />
        )
      }
    }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      onClose={() => {
        onClose()
      }}
      open={isOpen}
    >
      <DialogTitle
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Typography variant='h5' component='span'>
          {groupInfo ? '권한 수정하기' : '새로운 권한 추가하기'}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(5)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', mb: 4 }}>
          <Typography variant='body1' sx={{ mr: 4 }} component='span'>
            {groupInfo ? '권한 이름' : '새로운 권한 이름'}
          </Typography>
          <TextField
            size='small'
            value={rows.name}
            placeholder='새로운 권한 이름 입력'
            onChange={e => setRows({ ...rows, name: e.target.value })}
            sx={{ p: 1 }}
          />
        </Box>

        <Box>
          <DataGrid
            autoHeight
            rows={
              rows.roleList
                ? rows.roleList.map((item, index) => ({
                    ...item,
                    id: index + 1
                  }))
                : []
            }
            columns={columns}
            hideFooterPagination
            checkboxSelection={false}
            hideFooterSelectedRowCount
            disableColumnSelector
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box className='demo-space-x'>
          <Button
            size='large'
            type='submit'
            variant='contained'
            onClick={async () => {
              if (rows.name === '') {
                alert('권한 이름을 입력해주세요')

                return
              }

              const { users, ...restData } = rows
              const newRoleList = restData.roleList.map(({ viewName, ...restRole }) => restRole)

              const param = {
                ...restData,
                roleList: newRoleList
              }

              try {
                if (rows.id > 0) {
                  // 권한 수정
                  const res = await modGroup(param)
                  console.log(res)
                  if (res.code === EResultCode.FAIL) {
                    alert('권한 수정에 실패했습니다.')

                    return
                  }
                } else {
                  // 권한 추가
                  const res = await saveGroup(param)
                  console.log(res)
                  if (res.code === EResultCode.FAIL) {
                    alert('권한 추가에 실패했습니다.')

                    return
                  }
                }

                refetch()
                onClose()
              } catch (err) {
                onClose()

                // alert(EErrorMessage.COMMON_ERROR)
              }
            }}
          >
            저장
          </Button>
          <Button
            size='large'
            color='secondary'
            variant='outlined'
            onClick={() => {
              onClose()
            }}
          >
            취소
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default RoleAddModModal
