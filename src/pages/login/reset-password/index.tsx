import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, ReactNode, useState } from 'react'
import Icon from 'src/@core/components/icon'
import LoginTemplate from 'src/@core/components/molecule/LoginTemplate'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { EErrorMessage, EResultCode } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useChangePassword } from 'src/service/commonService'
import { decodeBase64, isValidEmail, isValidPassword } from 'src/utils/CommonUtil'

interface State {
  newPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showConfirmNewPassword: boolean
  passwordError: string
  confirmPasswordError: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const ResetPassword = () => {
  const [values, setValues] = useState<State>({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false,
    passwordError: '',
    confirmPasswordError: ''
  })

  const router = useRouter()
  const { email } = router.query
  const { mutateAsync, isLoading } = useChangePassword()
  const auth = useAuth()

  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    let passwordError = ''
    if (!isValidPassword(password)) {
      passwordError = '비밀번호는 대소문자, 숫자, 특수문자를 포함한 8~16자여야 합니다.'
    }

    setValues({ ...values, [prop]: password, passwordError })
  }

  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = event.target.value
    let confirmPasswordError = ''
    if (confirmPassword !== values.newPassword) {
      confirmPasswordError = '비밀번호가 일치하지 않습니다.'
    }

    setValues({ ...values, [prop]: confirmPassword, confirmPasswordError })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (values.passwordError || values.confirmPasswordError) {
      return
    }

    const emailDecode = decodeBase64(email as string)
    if (!email || !isValidEmail(emailDecode)) {
      router.push('/login/forgot-password/')
    } else {
      try {
        const res = await mutateAsync({ email: emailDecode, newPassword: values.newPassword })
        if (res.code === EResultCode.SUCCESS) {
          auth.login({ id: emailDecode, password: values.newPassword }, errorCallback => {
            alert(errorCallback?.message)
          })
        } else {
          alert(res.msg)
        }
      } catch (e) {
        alert(EErrorMessage.COMMON_ERROR)
      }
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <LoginTemplate>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
              비밀번호 재설정 🔒
            </Typography>
            <Typography variant='body2'>새 비밀번호는 이전에 사용한 비밀번호와 달라야 합니다.</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => onSubmit(e)}>
            <FormControl sx={{ display: 'flex', mb: 4 }} error={!!values.passwordError}>
              <InputLabel htmlFor='auth-reset-password-new-password'>New Password</InputLabel>
              <OutlinedInput
                autoFocus
                label='새 비밀번호'
                value={values.newPassword}
                id='auth-reset-password-new-password'
                onChange={handleNewPasswordChange('newPassword')}
                type={values.showNewPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => setValues({ ...values, showNewPassword: !values.showNewPassword })}
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <Icon icon={values.showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {values.passwordError && (
                <Typography variant='caption' color='error'>
                  {values.passwordError}
                </Typography>
              )}
            </FormControl>

            <FormControl sx={{ display: 'flex', mb: 4 }} error={!!values.confirmPasswordError}>
              <InputLabel htmlFor='auth-reset-password-confirm-password'>Confirm Password</InputLabel>
              <OutlinedInput
                label='비밀번호 확인'
                value={values.confirmNewPassword}
                id='auth-reset-password-confirm-password'
                type={values.showConfirmNewPassword ? 'text' : 'password'}
                onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                      onClick={() => setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })}
                    >
                      <Icon icon={values.showConfirmNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {values.confirmPasswordError && (
                <Typography variant='caption' color='error'>
                  {values.confirmPasswordError}
                </Typography>
              )}
            </FormControl>

            <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }}>
              확인
            </Button>

            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/login/'>
                <Icon icon='mdi:chevron-left' />
                <span>로그인 화면으로 돌아가기</span>
              </LinkStyled>
            </Typography>
          </form>
        </LoginTemplate>
      </Card>
    </Box>
  )
}

ResetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ResetPassword.guestGuard = true

export default ResetPassword
