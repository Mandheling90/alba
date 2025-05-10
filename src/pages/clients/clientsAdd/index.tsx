import { Box, Grid, IconButton, Step, StepContent, StepLabel, Stepper, Typography, styled } from '@mui/material'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import StepperCustomDot from 'src/@core/components/atom/StepperCustomDot'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { EResultCode, YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClientDetail } from 'src/model/client/clientModel'
import {
  useAiCompanyDetail,
  useClientDetail,
  useClientDuplicateCheck,
  useClientSave,
  useClientUpdate
} from 'src/service/client/clientService'
import StepOneContent from './StepOneContent'
import StepTwoContent from './StepTwoContent'

export const DEFAULT_CLIENT_DATA: IClientDetail = {
  companyNo: 0,
  companyId: '',
  companyName: '',
  address: '',
  brn: '',
  expireDate: '',
  companyStatus: 0,
  companyStatusStr: '',
  reportGeneration: YN.Y,
  reportGenerationStr: '',
  reportEmail: '',
  accountStatus: YN.Y,
  accountStatusStr: ''
}

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

const Index: FC = ({}) => {
  const router = useRouter()

  const [activeStep, setActiveStep] = useState<number>(0)
  const [clientData, setClientData] = useState<IClientDetail | null>(DEFAULT_CLIENT_DATA)
  const [expandedSteps, setExpandedSteps] = useState<boolean[]>([true, true])
  const [isStepOneValid, setIsStepOneValid] = useState<boolean>(true)
  const [companyNo, setCompanyNo] = useState<number>()

  const { data, refetch } = useClientDetail(companyNo)
  const { data: aiData, refetch: refetchAi } = useAiCompanyDetail(companyNo)
  const { mutateAsync: duplicateCheck } = useClientDuplicateCheck()
  const { mutateAsync: saveClient } = useClientSave()
  const { mutateAsync: updateClient } = useClientUpdate()

  useEffect(() => {
    if (router.query.id) {
      setCompanyNo(Number(router.query.id))
      setActiveStep(1)
    }
  }, [router])

  useEffect(() => {
    if (router.query.id && data?.data) {
      setActiveStep(1)
      setClientData(data.data)
    }
  }, [data])

  // 스텝 1에서 필수값 누락시 스텝 뒤로 돌아가기
  useEffect(() => {
    if (!isStepOneValid && !companyNo) {
      setActiveStep(0)
    }
  }, [isStepOneValid])

  const handleStepOneDataChange = (data: Partial<IClientDetail>) => {
    setClientData(prev => (prev ? ({ ...prev, ...data } as IClientDetail) : null))
  }

  const handleNext = () => setActiveStep(prev => prev + 1)

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const newState = [...prev]
      newState[index] = !newState[index]

      return newState
    })
  }

  const steps = [
    {
      title: companyNo ? '고객사 정보수정' : '고객사 정보등록',
      content: (
        <StepOneContent
          clientData={clientData}
          onDataChange={handleStepOneDataChange}
          onNext={async () => {
            if (clientData) {
              if (clientData?.companyNo === 0) {
                const res = await saveClient(clientData)

                if (res.code !== EResultCode.SUCCESS) {
                  alert(res.data.msg)

                  return
                } else {
                  setCompanyNo(res.data.companyNo)
                }
              } else {
                const res = await updateClient(clientData)

                if (res.code !== EResultCode.SUCCESS) {
                  alert(res.data.msg)

                  return
                }
              }

              activeStep === 0 && handleNext()
            }
          }}
          onReset={() => {
            setClientData({
              ...DEFAULT_CLIENT_DATA

              // solutions: clientData?.solutions || []
            })
          }}
          onValidationChange={(isValid: boolean) => {
            setIsStepOneValid(isValid)
          }}
          onDuplicateCheck={async () => {
            try {
              const res = await duplicateCheck(clientData?.companyId)
              alert(res.data.message)
              if (res.data.duplicateYn === YN.N) {
                return false
              } else {
                return true
              }
            } catch (error) {
              return true
            }
          }}
        />
      )
    },
    {
      title: '분석 솔루션 및 카메라 정보 등록',
      content: (
        <StepTwoContent
          aiData={aiData?.data}
          companyNo={data?.data?.companyNo ?? 0}
          onDataChange={handleStepOneDataChange}
          disabled={activeStep === 0}
          refetch={refetchAi}
        />
      )
    }
  ]

  return (
    <StandardTemplate title={'고객사 관리'}>
      <StepperWrapper>
        <Stepper activeStep={activeStep} orientation='vertical' nonLinear>
          {steps.map((step, index) => {
            return (
              <Step key={index} className={clsx({ active: activeStep === index })} expanded={true}>
                <StepLabel
                  StepIconComponent={props => (
                    <StepperCustomDot {...props} isValid={index === 0 ? isStepOneValid : false} />
                  )}
                >
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
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={8}>
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
    </StandardTemplate>
  )
}

export default Index
