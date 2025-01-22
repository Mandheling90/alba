// ** React Imports
import { ChangeEvent, ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const auth = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email) {
      setErrorMessage('이메일을 입력해주세요')
    } else {
      setIsLoading(true)
      auth.generateCode(
        email,
        errorCallback => {
          setErrorMessage(errorCallback?.message)
          setIsLoading(false)
        },
        () => {
          router.push({
            pathname: '/login/verify-email/',
            query: { email: email }
          })
        }
      )
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
              비밀번호 재설정 🔒
            </Typography>
            <Typography variant='body2'>
              사용자 계정으로 사용하신 이메일 주소를 입력하시면 비밀번호 재설정 안내를 보내드립니다.
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={onSubmit}>
            <TextField
              autoFocus
              value={email}
              type='email'
              label='이메일'
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value)
              }}
              sx={{ display: 'flex', mb: 4 }}
            />
            {errorMessage !== '' && (
              <Typography variant='inherit' sx={{ pb: 3, lineHeight: 1, color: 'red' }}>
                {errorMessage}
              </Typography>
            )}
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }} disabled={isLoading}>
              요청하기
            </Button>
            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/login/'>
                <Icon icon='mdi:chevron-left' />
                <span>로그인 화면으로 돌아가기</span>
              </LinkStyled>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
