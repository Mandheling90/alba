import { motion } from 'framer-motion'
import React, { ChangeEvent, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import styled from 'styled-components'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // ** Hooks
  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setErrorMessage('이메일을 입력해주세요')

      return
    }

    setIsLoading(true)
    setErrorMessage('')

    auth.generateCode(
      email,
      (errorCallback: any) => {
        setErrorMessage(errorCallback?.message)
        setIsLoading(false)
      },
      () => {
        setIsSuccess(true)
        setIsLoading(false)

        // 성공 시 이메일 인증 페이지로 이동
        // setTimeout(() => {
        //   window.location.href = `/login/verify-email/?email=${encodeURIComponent(email)}`
        // }, 2000)
      }
    )
  }

  return (
    <FormContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <BackButton onClick={onBackToLogin}>
        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M12.5 15L7.5 10L12.5 5'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        로그인으로 돌아가기
      </BackButton>

      <Logo>
        <img src='/images/logo/DSInsight.svg' alt='Dains Logo' />
      </Logo>

      <Title>비밀번호 재설정 🔒</Title>
      <Subtitle>사용자 계정으로 사용하신 이메일 주소를 입력하시면 비밀번호 재설정 안내를 보내드립니다.</Subtitle>

      {!isSuccess ? (
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor='email'>이메일</Label>
            <Input
              type='email'
              id='email'
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder='이메일을 입력하세요'
              required
            />
          </InputGroup>

          {errorMessage !== '' && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <SubmitButton type='submit' disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {isLoading ? '요청 중...' : '비밀번호 재설정 요청'}
          </SubmitButton>
        </Form>
      ) : (
        <SuccessMessage>
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>요청이 완료되었습니다!</SuccessTitle>
          <SuccessText>
            입력하신 이메일 주소로 비밀번호 재설정 안내를 보내드렸습니다. 이메일을 확인하여 비밀번호를 재설정해주세요.
          </SuccessText>
        </SuccessMessage>
      )}
    </FormContainer>
  )
}

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
  padding: 50px !important;
  width: 100% !important;
  max-width: 450px !important;
  position: relative;
`

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
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
  line-height: 1.6;
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
  box-sizing: border-box;

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

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
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
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, rgba(156, 89, 255, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
`

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
`

const SuccessTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
`

const SuccessText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`

export default ForgotPasswordForm
