import { FC, useEffect, useState } from 'react'

import { Box, Button, Checkbox, Typography } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import DividerBar from 'src/@core/components/atom/DividerBar'
import DuplicateText from 'src/@core/components/molecule/DuplicateText'
import CustomTable from 'src/@core/components/table/CustomTable'
import { CRUD, EResultCode, YN } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useModal } from 'src/hooks/useModal'
import { useUser } from 'src/hooks/useUser'
import { MAuthMenu, MRole } from 'src/model/userSetting/userSettingModel'
import { useAddAuth, useAuthDuplicate, useModAuth } from 'src/service/setting/userSetting'

interface IRoleAddModal {
  data?: MAuthMenu
  refetch: () => void
}

const RoleAdd: FC<IRoleAddModal> = ({ data, refetch }) => {
  const { selectedAuthList } = useUser()
  const { companyNo } = useLayout()
  const { user } = useAuth()
  const { setSimpleDialogModalProps } = useModal()

  const [rows, setRows] = useState<MRole[]>([])
  const [originalRows, setOriginalRows] = useState<MRole[]>([])
  const [selectedAuthListName, setSelectedAuthListName] = useState('')
  const [originalAuthListName, setOriginalAuthListName] = useState('')
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState(
    user?.userInfo?.authId === selectedAuthList.authId || selectedAuthList.type === CRUD.V
  )

  useEffect(() => {
    setIsDisabled(user?.userInfo?.authId === selectedAuthList.authId || selectedAuthList.type === CRUD.V)
  }, [user?.userInfo?.authId, selectedAuthList.authId, selectedAuthList.type, selectedAuthList])

  useEffect(() => {
    if (data) {
      setRows(data.roles)
      setOriginalRows(data.roles)
    }
  }, [data])

  useEffect(() => {
    setIsDuplicate(selectedAuthList.authId === 0)
  }, [selectedAuthList])

  useEffect(() => {
    setSelectedAuthListName(selectedAuthList?.name ?? '')
    setOriginalAuthListName(selectedAuthList?.name ?? '')
  }, [selectedAuthList.name])

  const { mutateAsync: authDuplicate } = useAuthDuplicate()
  const { mutateAsync: addAuth } = useAddAuth()
  const { mutateAsync: modAuth } = useModAuth()

  const handleCancel = () => {
    setRows(originalRows)
    setSelectedAuthListName(originalAuthListName)
    setIsDuplicate(selectedAuthList.authId === 0)
  }

  const columns = [
    {
      field: 'menuName',
      headerName: '메뉴',
      flex: 0.1,
      minWidth: 90
    },
    {
      field: '전체권한',
      headerName: '전체권한',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: GridRenderCellParams<MRole>) => {
        return (
          <Checkbox
            checked={row.createYn === YN.Y && row.updateYn === YN.Y && row.deleteYn === YN.Y && row.readYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setRows(rows =>
                rows.map(item =>
                  item.menuId === row.menuId
                    ? {
                        ...item,
                        createYn: isChecked ? YN.Y : YN.N,
                        updateYn: isChecked ? YN.Y : YN.N,
                        deleteYn: isChecked ? YN.Y : YN.N,
                        readYn: isChecked ? YN.Y : YN.N
                      }
                    : item
                )
              )
            }}
          />
        )
      }
    },
    {
      field: '읽기',
      headerName: '읽기',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: GridRenderCellParams<MRole>) => {
        return (
          <Checkbox
            checked={row.readYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setRows(rows =>
                rows.map(item => (item.menuId === row.menuId ? { ...item, readYn: isChecked ? YN.Y : YN.N } : item))
              )
            }}
          />
        )
      }
    },
    {
      field: '추가',
      headerName: '추가',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: GridRenderCellParams<MRole>) => {
        return (
          <Checkbox
            checked={row.createYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setRows(rows =>
                rows.map(item => (item.menuId === row.menuId ? { ...item, createYn: isChecked ? YN.Y : YN.N } : item))
              )
            }}
          />
        )
      }
    },
    {
      field: '수정',
      headerName: '수정',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: GridRenderCellParams<MRole>) => {
        return (
          <Checkbox
            checked={row.updateYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setRows(rows =>
                rows.map(item => (item.menuId === row.menuId ? { ...item, updateYn: isChecked ? YN.Y : YN.N } : item))
              )
            }}
          />
        )
      }
    },
    {
      field: '삭제',
      headerName: '삭제',
      flex: 0.1,
      minWidth: 90,
      renderCell: ({ row }: GridRenderCellParams<MRole>) => {
        return (
          <Checkbox
            checked={row.deleteYn === YN.Y}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setRows(rows =>
                rows.map(item => (item.menuId === row.menuId ? { ...item, deleteYn: isChecked ? YN.Y : YN.N } : item))
              )
            }}
          />
        )
      }
    }
  ]

  if (!data) {
    return <></>
  }

  return (
    <Box
      sx={{
        pointerEvents: isDisabled ? 'none' : 'auto',
        opacity: isDisabled ? 0.5 : 1,
        position: 'relative'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', m: 5 }}>
        <Typography variant='h5' component='span' mr={5}>
          {selectedAuthList.authId === 0 ? '새로운 권한 이름' : '권한 이름'}
        </Typography>
        <DuplicateText
          value={selectedAuthListName}
          placeholder='새로운 권한 이름 입력'
          setDuplicateCheck={value => setIsDuplicate(value)}
          duplicateCheck={async (text: string) => {
            try {
              const res = await authDuplicate({ authName: text, companyNo: companyNo })

              return res.data
            } catch (err) {
              console.log(err)
            }
          }}
          onCancel={() => {
            setSelectedAuthListName('')
          }}
          onConfirm={(text: string) => {
            setSelectedAuthListName(text)
          }}
          size='small'
        />
      </Box>

      <Box>
        <Box sx={{ overflow: 'auto' }}>
          <CustomTable id='menuId' showMoreButton={true} rows={rows} columns={columns} isAllView />

          <DividerBar />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', gap: 2, my: 5 }}>
        <Button
          size='large'
          type='submit'
          variant='contained'
          onClick={async () => {
            if (isDuplicate) {
              setSimpleDialogModalProps({
                open: true,
                title: '중복체크를 해주세요'
              })

              return
            } else if (selectedAuthListName === '') {
              setSimpleDialogModalProps({
                open: true,
                title: '권한 이름을 입력해주세요'
              })

              return
            }

            // 추가
            else if (selectedAuthList.authId === 0) {
              const req = {
                companyNo: companyNo,
                authName: selectedAuthListName,
                menuRoles: rows.map(item => ({
                  menuId: item.menuId,
                  createYn: item.createYn,
                  updateYn: item.updateYn,
                  readYn: item.readYn,
                  deleteYn: item.deleteYn
                }))
              }

              const res = await addAuth(req)

              if (res.code === EResultCode.FAIL) {
                alert('권한 추가에 실패했습니다.')

                return
              }
            } else {
              // 수정
              const req = {
                authId: selectedAuthList.authId,
                authName: selectedAuthListName,
                roles: rows.map(item => ({
                  menuId: item.menuId,
                  createYn: item.createYn,
                  updateYn: item.updateYn,
                  readYn: item.readYn,
                  deleteYn: item.deleteYn
                }))
              }

              const res = await modAuth(req)

              if (res.code === EResultCode.FAIL) {
                alert('권한 수정에 실패했습니다.')

                return
              }
            }

            refetch()

            // onClose()
          }}
        >
          저장
        </Button>
        <Button size='large' color='secondary' variant='outlined' onClick={handleCancel}>
          취소
        </Button>
      </Box>
    </Box>
  )
}

export default RoleAdd
