import { motion } from 'framer-motion'
import React, { ChangeEvent, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { ELocalStorageKey } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import styled from 'styled-components'

interface State {
  id: string
  password: string
  showPassword: boolean
}

interface LoginFormProps {
  onForgotPassword: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [values, setValues] = useState<State>({
    id: process.env.NEXT_PUBLIC_ENV_MODE === 'development' ? 'test1234' : '',
    password: process.env.NEXT_PUBLIC_ENV_MODE === 'development' ? 'Aa123456789!' : '',
    showPassword: false
  })
  const [errorMessage, setErrorMessage] = useState('')

  // ** Hooks
  const auth = useAuth()

  React.useEffect(() => {
    const savedLogin = localStorage.getItem(ELocalStorageKey.LGOIN_REMEMBER) ?? ''
    setRememberMe(savedLogin !== '')
    if (savedLogin !== '') {
      setValues(prev => ({
        ...prev,
        id: savedLogin
      }))
    }
  }, [])

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { id, password } = values

    if (!id || !password) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요')
    } else {
      auth.login({ id: id, password: password, rememberMe: rememberMe }, errorCallback => {
        setErrorMessage(errorCallback?.message)
      })
    }
  }

  const handleManualDownload = async () => {
    try {
      setIsDownloading(true)
      const fileUrl = `${process.env.NEXT_PUBLIC_API_HOST}/file/download/manual`

      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      })

      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.')
      }

      // Content-Disposition 헤더에서 파일명 추출 시도
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'Dains_Manual.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = downloadUrl
      link.download = filename

      document.body.appendChild(link)
      link.click()

      // 클린업
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(link)
    } catch (error) {
      console.error('다운로드 에러:', error)
      alert('파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <LoginContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Logo>
        <img src='/images/logo/DSInsight.svg' alt='Dains Logo' />
      </Logo>

      <Title>로그인</Title>
      <Subtitle>사용자 ID와 비밀번호를 입력하여 로그인해 주세요.</Subtitle>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor='id'>ID</Label>
          <Input
            type='text'
            id='id'
            value={values.id}
            onChange={handleChange('id')}
            placeholder='아이디를 입력하세요'
            required
          />
        </InputGroup>

        <PasswordInput>
          <Label htmlFor='password'>비밀번호</Label>
          <Input
            type={values.showPassword ? 'text' : 'password'}
            id='password'
            value={values.password}
            onChange={handleChange('password')}
            placeholder='비밀번호를 입력하세요'
            required
          />
          <PasswordToggle
            type='button'
            onClick={handleClickShowPassword}
            aria-label={values.showPassword ? 'Hide password' : 'Show password'}
          >
            {values.showPassword ? FaEyeSlash({ size: 22 }) : FaEye({ size: 22 })}
          </PasswordToggle>
        </PasswordInput>

        {errorMessage !== '' && (
          <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CheckboxContainer>
            <HiddenCheckbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} id='remember' />
            <StyledCheckbox checked={rememberMe} onClick={() => setRememberMe(!rememberMe)} />
            <CheckboxLabel htmlFor='remember'>아이디 기억하기</CheckboxLabel>
          </CheckboxContainer>

          <ForgotPasswordButton type='button' onClick={onForgotPassword}>
            비밀번호를 잊으셨나요?
          </ForgotPasswordButton>
        </div>

        <SubmitButton type='submit' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          로그인
        </SubmitButton>
      </Form>

      <DownloadButton
        onClick={handleManualDownload}
        disabled={isDownloading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ cursor: isDownloading ? 'wait' : 'pointer' }}
      >
        {isDownloading ? (
          <LoadingSpinner />
        ) : (
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M9 13.5L3.375 7.875L4.95 6.24375L7.875 9.16875V1.125H10.125V9.16875L13.05 6.24375L14.625 7.875L9 13.5ZM2.25 15.75V12.375H4.5V14.625H13.5V12.375H15.75V15.75H2.25Z'
              fill='currentColor'
            />
          </svg>
        )}
        {isDownloading ? '다운로드 중...' : '시스템 사용 매뉴얼 다운로드'}
      </DownloadButton>
    </LoginContainer>
  )
}

const LoginContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
  padding: 50px !important;
  width: 100% !important;
  max-width: 450px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  color: white !important;
  position: relative !important;
  overflow: hidden !important;
  box-sizing: border-box !important;

  /* Glass highlight effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
    border-radius: 20px 20px 0 0;
    pointer-events: none;
  }

  /* Side glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 10%;
    left: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(
      ellipse at center,
      rgba(138, 94, 244, 0.15) 0%,
      rgba(138, 94, 244, 0.05) 40%,
      rgba(0, 0, 0, 0) 70%
    );
    pointer-events: none;
    z-index: -1;
  }
`

const Logo = styled.div`
  margin-bottom: 30px;
  filter: drop-shadow(0 0 10px rgba(138, 94, 244, 0.4));
  img {
    height: 50px;
  }
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
  color: white;
  text-shadow: 0 0 10px rgba(138, 94, 244, 0.4);
`

const Subtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  text-align: center;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 2;
`

const InputGroup = styled.div`
  width: 100%;
  position: relative;
`

const Label = styled.label`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 10px;
  display: block;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 18px;
  color: white;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(139, 92, 246, 0.15);
    background: rgba(255, 255, 255, 0.12);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`

const PasswordInput = styled.div`
  position: relative;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 18px;
  top: 53px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`

const CheckboxContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`

const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  background: ${props => (props.checked ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.08)')};
  border: 1px solid ${props => (props.checked ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.25)')};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: all 0.2s;
  box-shadow: ${props => (props.checked ? '0 0 8px rgba(139, 92, 246, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)')};

  &:hover {
    border-color: ${props => (props.checked ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.5)')};
    background: ${props => (props.checked ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.12)')};
  }

  &:after {
    content: '';
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: ${props => (props.checked ? 1 : 0)};
    transition: opacity 0.2s;
    margin-bottom: 2px;
  }
`

const CheckboxLabel = styled.label`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
  }
`

const ForgotPasswordButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #a78bfa;
  text-decoration: none;
  margin-left: auto;
  position: relative;
  cursor: pointer;
  padding: 0;
  font-family: inherit;

  &:hover {
    color: #b794f4;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #b794f4;
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 18px;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.9) 0%, rgba(109, 40, 217, 0.9) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(90deg, rgba(156, 89, 255, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  }
`

const DownloadButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 35px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s;
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    filter: drop-shadow(0 0 2px rgba(138, 94, 244, 0.3));
  }

  &:hover:not(:disabled) {
    color: white;
    background: rgba(255, 255, 255, 0.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default LoginForm
