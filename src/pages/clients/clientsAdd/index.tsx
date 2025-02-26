import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  styled
} from '@mui/material'
import clsx from 'clsx'
import { FC, useState } from 'react'
import StepperCustomDot from 'src/@core/components/atom/StepperCustomDot'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import StepperWrapper from 'src/@core/styles/mui/stepper'

// StepContent 커스텀
const CustomStepContent = styled(StepContent)(({ theme }) => ({
  '&.MuiStepContent-root': {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    marginLeft: 12,
    paddingLeft: 20,
    transition: 'none',
    display: 'block !important',
    visibility: 'visible !important',
    height: 'auto !important',
    transform: 'none !important'
  },
  '& .MuiCollapse-root': {
    display: 'block !important',
    visibility: 'visible !important',
    height: 'auto !important',
    transform: 'none !important'
  }
}))

// 첫 번째 스텝 컴포넌트
const StepOneContent: FC = () => {
  return (
    <Grid item xs={8}>
      <Box>
        <Card sx={{ width: '100%' }}>
          <Box sx={{ background: '#F9FAFC', p: 3 }}>
            <Typography variant='h6' fontWeight='500' fontSize={20}>
              고객사 정보
            </Typography>
          </Box>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    고객사ID
                  </Typography>
                  <TextField size='small' value={123} placeholder='필수입력' />
                  <Button size='small' variant='contained'>
                    중복확인
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '90px' }}>
                    고객사명
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    고객사주소
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={7}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    사업자등록번호
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={5}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 3 }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    사업자 현재 상태
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    계약기간설정
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    리포트생성
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={8}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 10 }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '110px' }}>
                    리포트수신
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                    고객사계정
                  </Typography>
                  <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  )
}

// 두 번째 스텝 컴포넌트
const StepTwoContent: FC = () => {
  return (
    <Box>
      <Typography variant='body1' gutterBottom>
        두 번째 단계에서는 고객사의 상세 정보를 입력합니다.
      </Typography>
      {/* 여기에 필요한 폼 컴포넌트들을 추가할 수 있습니다 */}
    </Box>
  )
}

const Index: FC = ({}): React.ReactElement => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    { title: '단계 1', subtitle: '첫 번째 단계', content: <StepOneContent /> },
    { title: '단계 2', subtitle: '두 번째 단계', content: <StepTwoContent /> }
  ]

  const handleNext = () => setActiveStep(prev => prev + 1)
  const handleBack = () => setActiveStep(prev => prev - 1)
  const handleReset = () => setActiveStep(0)

  return (
    <StandardTemplate title={'고객사 관리'}>
      <StepperWrapper>
        <Stepper activeStep={activeStep} orientation='vertical' nonLinear>
          {steps.map((step, index) => {
            return (
              <Step key={index} className={clsx({ active: activeStep === index })} expanded={true}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <Typography className='step-number'>{`0${index + 1}`}</Typography>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                      <Typography className='step-subtitle'>{step.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
                <CustomStepContent>
                  <Box sx={{ py: 3 }}>
                    <Grid container spacing={1}>
                      {step.content}
                    </Grid>

                    <div className='button-wrapper'>
                      <Button
                        size='small'
                        color='secondary'
                        variant='outlined'
                        onClick={handleBack}
                        disabled={activeStep === 0}
                      >
                        Back
                      </Button>
                      <Button size='small' variant='contained' onClick={handleNext} sx={{ ml: 4 }}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </Box>
                </CustomStepContent>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      {activeStep === steps.length && (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps are completed!</Typography>
          <Button size='small' sx={{ mt: 2 }} variant='contained' onClick={handleReset}>
            Reset
          </Button>
        </Box>
      )}
    </StandardTemplate>
  )
}

export default Index
