import { Box, Button, Grid, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import { requiredTextFieldStyle } from 'src/@core/styles/TextFieldStyle'
import { IClient, SERVICE_TYPE, SOLUTION_TYPE } from 'src/model/client/clientModel'
import ClientsStateSelect from './ClientsStateSelect'

interface IStepOneContentProps {
  clientData: IClient | null
  isEditMode: boolean
  onDataChange: (data: Partial<IClient>) => void
}

interface IFormData {
  clientId: string
  clientName: string
  address: string
  businessNumber: string
  businessStatus: string
  contractPeriod: string
  reportGeneration: boolean
  reportReceiver: string
  clientAccount: string
  serviceTypes: SERVICE_TYPE[]
  solutionTypes: SOLUTION_TYPE[]
  analysisChannels: number
  reportEmail: string
  accountStatus: boolean
}

// 첫 번째 스텝 컴포넌트
const StepOneContent: FC<IStepOneContentProps> = ({ clientData, isEditMode, onDataChange }) => {
  const [formData, setFormData] = useState<IFormData>({
    clientId: '',
    clientName: '',
    address: '',
    businessNumber: '',
    businessStatus: '',
    contractPeriod: '',
    reportGeneration: false,
    reportReceiver: '',
    clientAccount: '',
    serviceTypes: [],
    solutionTypes: [],
    analysisChannels: 0,
    reportEmail: '',
    accountStatus: false
  })

  useEffect(() => {
    if (clientData && isEditMode) {
      setFormData({
        clientId: clientData.clientId || '',
        clientName: clientData.clientName || '',
        address: clientData.address || '',
        businessNumber: clientData.businessNumber || '',
        businessStatus: clientData.businessStatus || '1',
        contractPeriod: clientData.contractPeriod || '',
        reportGeneration: clientData.reportGeneration || false,
        reportReceiver: clientData.reportReceiver || '',
        clientAccount: clientData.clientAccount || '',
        serviceTypes: clientData.serviceTypes || [],
        solutionTypes: clientData.solutionTypes || [],
        analysisChannels: clientData.analysisChannels || 0,
        reportEmail: clientData.reportEmail || '',
        accountStatus: clientData.accountStatus || false
      })
    }
  }, [clientData, isEditMode])

  const handleChange = (field: keyof IFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setFormData(prev => {
      const newData = { ...prev, [field]: newValue }
      onDataChange(newData)

      return newData
    })
  }

  const handleSelectChange = (field: keyof IFormData) => (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setFormData(prev => {
      const newData = { ...prev, [field]: newValue }
      onDataChange(newData)

      return newData
    })
  }

  const handleSwitchChange = (field: keyof IFormData) => (selected: boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: selected }
      onDataChange(newData)

      return newData
    })
  }

  return (
    <Grid item xs={8}>
      <Box>
        <WindowCard title='고객사 정보'>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사ID
                </Typography>
                <TextField
                  size='small'
                  value={formData.clientId}
                  onChange={handleChange('clientId')}
                  placeholder='필수입력'
                  sx={requiredTextFieldStyle}
                />
                <Button size='medium' variant='contained'>
                  중복확인
                </Button>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '90px' }}>
                  고객사명
                </Typography>
                <TextField
                  size='small'
                  sx={{ width: '100%', ...requiredTextFieldStyle }}
                  value={formData.clientName}
                  onChange={handleChange('clientName')}
                  placeholder='필수입력'
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사주소
                </Typography>
                <TextField
                  size='small'
                  sx={{ width: '100%' }}
                  value={formData.address}
                  onChange={handleChange('address')}
                  placeholder='선택입력'
                />
              </Box>
            </Grid>

            <Grid item xs={7}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  사업자등록번호
                </Typography>
                <TextField
                  size='small'
                  sx={{ width: '100%' }}
                  value={formData.businessNumber}
                  onChange={handleChange('businessNumber')}
                  placeholder='선택입력'
                />
              </Box>
            </Grid>

            <Grid item xs={5}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 3 }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  사업자 현재 상태
                </Typography>
                <ClientsStateSelect
                  value={formData.businessStatus ?? '1'}
                  onChange={handleSelectChange('businessStatus')}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  계약기간설정
                </Typography>
                <TextField
                  size='small'
                  sx={{ width: '100%' }}
                  value={formData.contractPeriod}
                  onChange={handleChange('contractPeriod')}
                  placeholder='선택입력'
                />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  리포트생성
                </Typography>
                <SwitchCustom
                  width={100}
                  switchName={['사용', '미사용']}
                  selected={formData.reportGeneration}
                  onChange={handleSwitchChange('reportGeneration')}
                  activeColor={['#9155FD', '#696969']}
                />
              </Box>
            </Grid>

            <Grid item xs={8}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 10 }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '110px' }}>
                  리포트수신
                </Typography>
                <TextField
                  size='small'
                  sx={{ width: '100%', ...requiredTextFieldStyle }}
                  value={formData.reportReceiver}
                  onChange={handleChange('reportReceiver')}
                  placeholder='이메일 주소입력 필수'
                />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사계정
                </Typography>
                <SwitchCustom
                  width={100}
                  switchName={['활성', '비활성']}
                  selected={formData.accountStatus}
                  onChange={handleSwitchChange('accountStatus')}
                  activeColor={['#9155FD', '#F57A52']}
                />
              </Box>
            </Grid>
          </Grid>
        </WindowCard>
      </Box>
    </Grid>
  )
}

export default StepOneContent
