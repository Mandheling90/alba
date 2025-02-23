// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useRouter } from 'next/router'
import LoginTemplate from 'src/@core/components/molecule/LoginTemplate'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main
}))

const VerifyEmail = () => {
  // ** Hook
  const router = useRouter()

  const { email } = router.query
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email) {
      router.push('/login/forgot-password/')
    } else {
      setIsLoading(true)
      auth.generateCode(
        email as string,
        errorCallback => {
          alert(errorCallback?.message)
          setIsLoading(false)
        },
        () => {
          alert('메일을 전송했습니다.')
        }
      )
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <LoginTemplate>
          <Box sx={{ mb: 8 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              이메일을 인증해 주세요 ✉️
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              비밀번호 재설정 링크가 <strong>{email}</strong> 으로 전송되었습니다. 이메일의 링크를 클릭하여 계속 진행해
              주세요
            </Typography>
          </Box>
          <Button
            fullWidth
            variant='contained'
            onClick={() => {
              router.push({
                pathname: '/login/two-steps/',
                query: { email: email }
              })
            }}
          >
            확인
          </Button>
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>메일을 받지 못하셨나요?</Typography>
            <TypographyStyled
              sx={{ cursor: 'pointer' }}
              onClick={(event: React.FormEvent) => {
                if (!isLoading) {
                  onSubmit(event)
                }
              }}
            >
              다시보내기
            </TypographyStyled>
          </Box>
        </LoginTemplate>
      </Card>
    </Box>
  )
}

VerifyEmail.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

VerifyEmail.guestGuard = true

export default VerifyEmail
