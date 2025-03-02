import { Box, Button, Grid, Step, StepContent, StepLabel, Stepper, Typography, styled } from '@mui/material'
import clsx from 'clsx'
import { FC, useState } from 'react'
import StepperCustomDot from 'src/@core/components/atom/StepperCustomDot'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepOneContent from './StepOneContent'
import StepTwoContent from './StepTwoContent'

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

// 두 번째 스텝 컴포넌트

const Index: FC = ({}): React.ReactElement => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    { title: '고객사 정보등록', content: <StepOneContent /> },
    { title: '분석 솔루션 및 카메라 정보 등록', content: <StepTwoContent /> }
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
                      <Typography fontWeight={500} fontSize={30}>
                        {step.title}
                      </Typography>
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
