import { Box, IconButton, Switch, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import IconCustom from 'src/layouts/components/IconCustom'
import { MUserInfo } from 'src/model/commonModel'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'

interface UserColumnsProps {
  modStateUser?: (params: { userNo: number; userStatus: number }) => void
  userData: any[]
  setUserData?: (data: any[]) => void
  setSelectUser?: (user: any) => void
  setIsOpen?: (isOpen: boolean) => void
  userDeleteFn?: (userNo: number) => void
  columnFilter?: string[]
  userInfo?: MUserInfo,
  isShowTooltip?: boolean
}

const createColumnDefinitions = (props: UserColumnsProps): Record<string, GridColDef> => {
  const { modStateUser, userData, setUserData, setSelectUser, setIsOpen, userDeleteFn, userInfo, isShowTooltip } = props

  return {
    name: {
      field: 'name',
      headerName: '사용자명',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <>
            <IconCustom
              path='avatars'
              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              icon={`${(row.userNo % 7) + 1}`}
              isCommon
              usePng
            />
            <Box sx={{ maxWidth:'calc(100% - 30px)' }} style={{paddingLeft: '5px'}} >
            {isShowTooltip ? (
              <CustomTooltip title={row.name} key={row.userNo} placement='top' >
                <Typography noWrap sx={{ color: 'text.secondary', }}>
                  {row.name}
                </Typography>
              </CustomTooltip>
            ): (
                <Typography noWrap sx={{ color: 'text.secondary', }}>
                  {row.name}
                </Typography>
            )}
            </Box>
          </>
        )
      }
    },
    name2: {
      field: 'name2',
      headerName: '사용자 ID',
      headerAlign: 'center',
      flex: 0.8,
      align: 'center',
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
            {row.userId}
          </Typography>
        )
      }
    },
    mailAddress: {
      field: 'mailAddress',
      headerName: '이메일 주소',
      headerAlign: 'center',
      flex: 1.2,
      align: 'center',
      type: 'string'
    },
    authName: {
      field: 'authName',
      headerName: '권한',
      headerAlign: 'center',
      flex: 0.6,
      align: 'center',
      type: 'string'
    },
    userStatus: {
      field: 'userStatus',
      headerName: '상태',
      headerAlign: 'center',
      flex: 0.6,
      align: 'center',
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              checked={row.userStatus === 1}
              onChange={event => {
                modStateUser?.({ userNo: row.userNo, userStatus: event.target.checked ? 1 : 0 })
                const updatedList = userData.map(user => {
                  if (user.userId === row.userId) {
                    return { ...user, userStatus: event.target.checked ? 1 : 0 }
                  }

                  return user
                })
                setUserData?.(updatedList)
              }}

              // disabled={row.userId === userInfo?.userId}
            />
          </Box>
        )
      }
    },
    updateDelete: {
      field: 'updateDelete',
      headerName: '수정 및 삭제',
      headerAlign: 'center',
      flex: 0.6,
      align: 'center',
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                setSelectUser?.(row)
                setIsOpen?.(true)
              }}

              // disabled={row.userId === userInfo?.userId}
            >
              <IconCustom path='settingCard' icon='pen' />
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                userDeleteFn?.(row.userNo)
              }}

              // disabled={row.userId === userInfo?.userId}
            >
              <IconCustom path='settingCard' icon='delete' />
            </IconButton>
          </Box>
        )
      }
    }
  }
}

export const getUserColumns = (props: UserColumnsProps): GridColDef[] => {
  const { columnFilter } = props
  const columnDefinitions = createColumnDefinitions(props)

  if (columnFilter && columnFilter.length > 0) {
    return columnFilter.map(field => columnDefinitions[field as keyof typeof columnDefinitions])
  }

  return Object.values(columnDefinitions)
}
