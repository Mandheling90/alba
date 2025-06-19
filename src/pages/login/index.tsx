import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import EmptyLayout from 'src/@core/layouts/EmptyLayout'
import styled from 'styled-components'
import ForgotPasswordForm from './forgot-password/ForgotPasswordForm'
import LoginForm from './LoginForm'
import ParticleBackground from './ParticleBackground'

type LoginStep = 'login' | 'forgot-password'

const LoginPage = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('login')

  const handleStepChange = (step: LoginStep) => {
    setCurrentStep(step)
  }

  return (
    <PageContainer>
      <ParticleBackground />

      <ContentContainer>
        <FormSection>
          <motion.div key={currentStep}>
            {currentStep === 'login' ? (
              <LoginForm onForgotPassword={() => handleStepChange('forgot-password')} />
            ) : (
              <ForgotPasswordForm onBackToLogin={() => handleStepChange('login')} />
            )}
          </motion.div>
        </FormSection>

        <WelcomeSection
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ContentWrapper>
            <TextSection>
              <CompanyLogo>
                <img src='/images/logo/DSInsight.svg' alt='Dains 주식회사' />
              </CompanyLogo>

              <WelcomeTitle>안녕하세요. 환영합니다.</WelcomeTitle>

              <WelcomeText>
                AI 영상분석 솔루션 전문기업, 다인스 주식회사의 웹뷰어 플랫폼에 오신 것을 환영합니다. 전문성과 신뢰를
                기반으로 한 차원 높은 AI 서비스를 다인스에서 경험해보세요.
              </WelcomeText>
            </TextSection>

            <LinksSection>
              <PromotionLink
                href='https://www.dains.co.kr'
                target='_blank'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM8.75 18.625C4.875 18.25 1.75 15.125 1.375 11.25C1.375 11.125 1.375 10.875 1.375 10.75H8.75V18.625ZM8.75 10H1.375C1.375 9.875 1.375 9.625 1.375 9.5C1.75 5.625 4.875 2.5 8.75 2.125V10ZM18.625 10H11.25V1.375C15.125 1.75 18.25 4.875 18.625 8.75C18.625 8.875 18.625 9.125 18.625 9.25V10ZM11.25 11.25H18.625C18.625 11.375 18.625 11.625 18.625 11.75C18.25 15.625 15.125 18.75 11.25 19.125V11.25Z'
                    fill='white'
                  />
                </svg>
                회사 홈페이지
              </PromotionLink>

              <PromotionLink href='#' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M17.5 5.625V15.625C17.5 16.3125 16.9375 16.875 16.25 16.875H3.75C3.0625 16.875 2.5 16.3125 2.5 15.625V5.625C2.5 4.9375 3.0625 4.375 3.75 4.375H6.25V3.125C6.25 2.8125 6.5625 2.5 6.875 2.5H13.125C13.4375 2.5 13.75 2.8125 13.75 3.125V4.375H16.25C16.9375 4.375 17.5 4.9375 17.5 5.625ZM7.5 4.375H12.5V3.75H7.5V4.375ZM16.25 5.625H3.75V15.625H16.25V5.625ZM10.625 6.875V13.6C10.625 14.025 10.125 14.3 9.75 14.0625L6.875 12.1875V6.875H10.625ZM13.125 6.875V12.1875L10.25 14.0625C9.875 14.3 9.375 14.025 9.375 13.6V6.875H13.125Z'
                    fill='white'
                  />
                </svg>
                솔루션 소개
              </PromotionLink>

              <PromotionLink href='#' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM10 16.875C6.25 16.875 3.125 13.75 3.125 10C3.125 6.25 6.25 3.125 10 3.125C13.75 3.125 16.875 6.25 16.875 10C16.875 13.75 13.75 16.875 10 16.875ZM10.9375 6.25C10.9375 6.75 10.5 7.1875 10 7.1875C9.5 7.1875 9.0625 6.75 9.0625 6.25C9.0625 5.75 9.5 5.3125 10 5.3125C10.5 5.3125 10.9375 5.75 10.9375 6.25ZM11.25 13.75H8.75V8.75H11.25V13.75Z'
                    fill='white'
                  />
                </svg>
                고객지원
              </PromotionLink>
            </LinksSection>
          </ContentWrapper>
        </WelcomeSection>
      </ContentContainer>
    </PageContainer>
  )
}

LoginPage.getLayout = (page: ReactNode) => <EmptyLayout>{page}</EmptyLayout>

LoginPage.guestGuard = true

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column-reverse; /* Reversed for mobile */
  align-items: center;
  width: 100%;
  max-width: 1200px; /* Increased for wider welcome section */
  z-index: 1;

  @media (min-width: 992px) {
    flex-direction: row; /* Horizontal on desktop */
    justify-content: center;
    align-items: stretch; /* Make both containers same height */
    gap: 40px;
  }
`

const FormSection = styled.div`
  width: 100%;
  max-width: 450px;
`

const WelcomeSection = styled(motion.div)`
  color: white;
  text-align: center;
  margin-top: 40px;
  width: 100%;
  max-width: 900px; /* Doubled from 450px */
  position: relative;
  padding: 50px 70px; /* Increased horizontal padding */
  border-radius: 20px;
  display: flex;
  flex-direction: column;

  @media (min-width: 992px) {
    text-align: left;
    margin-top: 0;
  }

  /* Add glow effect behind the section */
  &::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -20%;
    width: 140%;
    height: 160%;
    background: radial-gradient(
      ellipse at center,
      rgba(138, 94, 244, 0.15) 0%,
      rgba(138, 94, 244, 0.05) 50%,
      rgba(0, 0, 0, 0) 70%
    );
    z-index: -1;
    pointer-events: none;
    border-radius: 100%;
  }

  /* Add a subtle purple background to the whole welcome section */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(138, 94, 244, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(138, 94, 244, 0.15);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const TextSection = styled.div`
  margin-bottom: auto;
`

const WelcomeTitle = styled.h1`
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;

  /* Gradient text */
  background: linear-gradient(90deg, #d6bcfa 0%, #a78bfa 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Text shadow for better visibility */
  text-shadow: 0 0 30px rgba(168, 139, 250, 0.5);

  @media (min-width: 1200px) {
    font-size: 48px;
  }
`

const WelcomeText = styled.p`
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.2px;
  max-width: 700px; /* Limit text width for readability */

  @media (min-width: 1200px) {
    font-size: 20px;
    line-height: 1.8;
  }
`

const CompanyLogo = styled.div`
  margin-bottom: 40px;
  img {
    height: 50px;
    filter: drop-shadow(0 0 10px rgba(138, 94, 244, 0.5));
  }
`

const LinksSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: auto; /* Push to bottom to align with login button */
`

const PromotionLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  padding: 16px 24px;
  background: rgba(138, 94, 244, 0.1);
  border: 1px solid rgba(138, 94, 244, 0.3);
  border-radius: 14px;
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(138, 94, 244, 0.2);
    border-color: rgba(138, 94, 244, 0.5);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
    filter: drop-shadow(0 0 3px rgba(138, 94, 244, 0.5));
  }
`

export default LoginPage
