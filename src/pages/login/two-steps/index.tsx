// ** React Imports
import { ChangeEvent, KeyboardEvent, ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { Controller, useForm } from 'react-hook-form'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import { useRouter } from 'next/router'
import LoginTemplate from 'src/@core/components/molecule/LoginTemplate'
import { EResultCode } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useVerifyCode } from 'src/service/commonService'
import { encodeBase64 } from 'src/utils/CommonUtil'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 50,
  textAlign: 'center',
  height: '50px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: ''
}

const TwoSteps = () => {
  // ** State
  const [isBackspace, setIsBackspace] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  const router = useRouter()

  const [generateCodeMutateLoding, setGenerateCodeMutateLoding] = useState(false)
  const { mutateAsync, isLoading } = useVerifyCode()
  const { email } = router.query
  const auth = useAuth()

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }

  const onSubmit = async (data: { [key: string]: string }) => {
    if (!email) {
      router.push('/login/forgot-password/')
    } else {
      const code = Object.values(data).join('')
      const res = await mutateAsync({ code: code, email: email as string })
      if (res.code === EResultCode.SUCCESS) {
        router.push({
          pathname: '/login/reset-password/',
          query: { email: encodeBase64(email as string) }
        })
      } else {
        alert('인증에 실패했습니다.')
      }
    }
  }

  const reSend = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email) {
      router.push('/login/forgot-password/')
    } else {
      setGenerateCodeMutateLoding(true)
      auth.generateCode(
        email as string,
        errorCallback => {
          alert(errorCallback?.message)
          setGenerateCodeMutateLoding(false)
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
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              이중 인증 💬
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              이메일로 송부드린 인증코드를 아래칸에 입력해 주세요.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CleaveWrapper
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...(errorsArray.length && {
                  '& .invalid:focus': {
                    borderColor: theme => `${theme.palette.error.main} !important`,
                    boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                  }
                })
              }}
            >
              {renderInputs()}
            </CleaveWrapper>
            {errorsArray.length ? (
              <FormHelperText sx={{ color: 'error.main' }}>Please enter a valid code</FormHelperText>
            ) : null}
            <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }} disabled={isLoading}>
              확인
            </Button>
          </form>
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>메일을 받지 못하셨나요?</Typography>
            <LinkStyled
              href='/'
              onClick={(event: React.FormEvent) => {
                if (!generateCodeMutateLoding) {
                  reSend(event)
                }
              }}
            >
              다시보내기
            </LinkStyled>
          </Box>
        </LoginTemplate>
      </Card>
    </Box>
  )
}

TwoSteps.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

TwoSteps.guestGuard = true

export default TwoSteps
