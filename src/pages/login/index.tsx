// ** React Imports
import { ChangeEvent, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { Checkbox } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, ThemeProvider, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FileDownLoadForm from 'src/@core/components/molecule/FileDownLoadForm'
import LoginTemplate from 'src/@core/components/molecule/LoginTemplate'
import { ELocalStorageKey } from 'src/enum/commonEnum'

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

interface State {
  id: string
  password: string
  showPassword: boolean
}

const LoginPage = () => {
  const LGOIN_REMEMBER = window.localStorage.getItem(ELocalStorageKey.LGOIN_REMEMBER) ?? ''

  const [rememberMe, setRememberMe] = useState<boolean>(LGOIN_REMEMBER !== '')

  const [values, setValues] = useState<State>({
    id: rememberMe ? LGOIN_REMEMBER : '',
    password: '',
    showPassword: false
  })
  const [errorMessage, setErrorMessage] = useState('')

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const { id, password } = values

    if (!id || !password) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요')
    } else {
      auth.login({ id: id, password: password, rememberMe: rememberMe }, errorCallback => {
        setErrorMessage(errorCallback?.message)
      })
    }
  }

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <LoginTemplate>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
              로그인
            </Typography>
            <Typography variant='body2'>사용자 이메일 계정으로 로그인해 주세요. </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={onSubmit}>
            <TextField
              value={values.id}
              autoFocus
              fullWidth
              id='Email'
              label='이메일'
              sx={{ mb: 4 }}
              onChange={handleChange('id')}
            />

            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>비밀번호</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <Icon icon={values.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errorMessage !== '' && (
              <Typography variant='inherit' sx={{ pt: 1, lineHeight: 1, color: 'red' }}>
                {errorMessage}
              </Typography>
            )}
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={() => {
                      setRememberMe(!rememberMe)
                    }}
                  />
                }
                label='아이디 기억하기'
              />
              <LinkStyled href='/login/forgot-password/'>비밀번호를 잊었나요?</LinkStyled>
            </Box>

            <ThemeProvider theme={theme}>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                로그인
              </Button>
            </ThemeProvider>
          </form>
          <FileDownLoadForm label='시스템 사용 매뉴얼 다운로드' />
        </LoginTemplate>
      </Card>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
