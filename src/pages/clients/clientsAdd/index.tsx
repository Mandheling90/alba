import { Box, Grid, IconButton, Step, StepContent, StepLabel, Stepper, Typography, styled } from '@mui/material'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import StepperCustomDot from 'src/@core/components/atom/StepperCustomDot'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClient } from 'src/model/client/clientModel'
import StepOneContent from './StepOneContent'
import StepTwoContent from './StepTwoContent'

// StepContent 커스텀
const CustomStepContent = styled(StepContent)<{ stepindex: number; activestep: number }>(
  ({ theme, stepindex, activestep }) => ({
    '&.MuiStepContent-root': {
      borderLeft: stepindex === 0 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none !important',
      borderColor: activestep === -1 ? '#BDBDBD !important' : '#9155FD !important',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      marginLeft: stepindex === 0 ? '12px' : '0 !important',
      paddingLeft: '20px',
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
  })
)

// 두 번째 스텝 컴포넌트

const Index: FC = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [clientData, setClientData] = useState<IClient | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [stepOneData, setStepOneData] = useState<Partial<IClient>>({})
  const [expandedSteps, setExpandedSteps] = useState<boolean[]>([true, true])

  useEffect(() => {
    if (router.query.mode === 'edit' && router.query.clientData) {
      const data = JSON.parse(router.query.clientData as string) as IClient
      setClientData(data)
      setStepOneData(data)
      setIsEditMode(true)
    }
  }, [router.query])

  const handleStepOneDataChange = (data: Partial<IClient>) => {
    setStepOneData(data)
  }

  console.log(clientData)

  const handleNext = () => setActiveStep(prev => prev + 1)
  const handleBack = () => setActiveStep(prev => prev - 1)
  const handleReset = () => setActiveStep(0)

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const newState = [...prev]
      newState[index] = !newState[index]

      return newState
    })
  }

  const steps = [
    {
      title: '고객사 정보등록',
      content: (
        <StepOneContent
          clientData={clientData}
          isEditMode={isEditMode}
          onDataChange={handleStepOneDataChange}
          onNext={() => {
            activeStep === 0 && handleNext()
          }}
          onBack={() => {
            activeStep > 0 && handleBack()
          }}
        />
      )
    },
    {
      title: '분석 솔루션 및 카메라 정보 등록',
      content: <StepTwoContent initialData={clientData} isEditMode={isEditMode} />
    }
  ]

  return (
    <StandardTemplate title={'고객사 관리'}>
      <StepperWrapper>
        <Stepper activeStep={activeStep} orientation='vertical' nonLinear>
          {steps.map((step, index) => {
            return (
              <Step key={index} className={clsx({ active: activeStep === index })} expanded={true}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography className='step-number'>{`0${index + 1}`}</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Typography fontWeight={500} fontSize={30}>
                        {step.title}
                      </Typography>
                      <IconButton onClick={() => toggleStep(index)}>
                        <IconCustom isCommon icon={expandedSteps[index] ? 'arrow-up' : 'arrow-down'} />
                      </IconButton>
                    </div>
                  </div>
                </StepLabel>
                <CustomStepContent stepindex={index} activestep={activeStep}>
                  <Box sx={{ py: 3, display: expandedSteps[index] ? 'block' : 'none' }}>
                    <Grid container spacing={1}>
                      <Grid item xs={7}>
                        {step.content}
                      </Grid>
                    </Grid>
                  </Box>
                </CustomStepContent>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      {/* {activeStep === steps.length && (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps are completed!</Typography>
          <Button size='small' sx={{ mt: 2 }} variant='contained' onClick={handleReset}>
            Reset
          </Button>
        </Box>
      )} */}
    </StandardTemplate>
  )
}

export default Index
