// ** React Imports
import { Fragment, SyntheticEvent, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import UserAddModModal from 'src/pages/user-setting/userSetting/modal/UserAddModModal'
import { useUserDetailInfo } from 'src/service/commonService'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  const auth = useAuth()
  const { mutateAsync: userDetailInfoMutate } = useUserDetailInfo()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Fragment>
      {auth?.user?.userInfo && (
        <UserAddModModal
          isOpen={isOpen}
          selectUser={{
            userNo: auth?.user?.userInfo.userNo,
            userId: auth?.user?.userInfo.userId,
            name: auth?.user?.userInfo?.name,
            mobileNo: auth?.user?.userInfo?.mobileNo,
            mailAddress: auth?.user?.userInfo?.mailAddress,
            authId: auth?.user?.userInfo?.authId,
            authName: auth?.user?.userInfo?.authName,
            userStatus: auth?.user?.userInfo?.userStatus,
            userStatusStr: auth?.user?.userInfo?.userStatusStr
          }}
          onClose={() => {
            setIsOpen(false)
          }}
          onSubmitAfter={async () => {
            const userInfo = await userDetailInfoMutate()

            console.log(userInfo.data)

            auth.setUser({ ...auth.user, userInfo: userInfo.data })
          }}
          isSelfUserMod
        />
      )}

      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 0, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Icon onClick={handleDropdownOpen} icon={'teenyicons:user-circle-solid'} fontSize={35} />
        {/* <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        /> */}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              {/* <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} /> */}
              <Icon onClick={handleDropdownOpen} icon={'teenyicons:user-circle-solid'} fontSize={40} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{auth?.user?.userInfo?.name}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {auth?.user?.userInfo?.authName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            setIsOpen(true)
            handleDropdownClose()
          }}
        >
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            사용자 정보수정
          </Box>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
