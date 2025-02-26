import { Box, Button, Collapse, Step, StepLabel, Stepper, Typography } from '@mui/material'
import clsx from 'clsx'
import { FC, useState } from 'react'
import StepperCustomDot from 'src/@core/components/atom/StepperCustomDot'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import StepperWrapper from 'src/@core/styles/mui/stepper'

const Index: FC = ({}): React.ReactElement => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    { title: '단계 1', subtitle: '첫 번째 단계', description: '첫 번째 단계 설명' },
    { title: '단계 2', subtitle: '두 번째 단계', description: '두 번째 단계 설명' }
  ]

  const handleNext = () => setActiveStep(prev => prev + 1)
  const handleBack = () => setActiveStep(prev => prev - 1)
  const handleReset = () => setActiveStep(0)

  return (
    <StandardTemplate title={'고객사 추가'}>
      <StepperWrapper>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((step, index) => {
            return (
              <Step key={index} className={clsx({ active: activeStep === index })}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <Typography className='step-number'>{`0${index + 1}`}</Typography>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                      <Typography className='step-subtitle'>{step.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
                <Collapse in={true}>
                  <Box sx={{ p: 3 }}>
                    <Typography>{step.description}</Typography>
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
                </Collapse>
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
