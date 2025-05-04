import { Box, Button, Grid, SelectChangeEvent, TextField, Typography, useTheme } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
import PickersRange from 'src/@core/components/atom/PickersRange'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import { grayTextBackground, grayTextFieldStyle, requiredTextFieldStyle } from 'src/@core/styles/TextFieldStyle'
import { YN } from 'src/enum/commonEnum'
import { IClientDetail } from 'src/model/client/clientModel'

interface IStepOneContentProps {
  clientData: IClientDetail | null
  onDataChange: (data: Partial<IClientDetail>) => void
  onNext: () => void
  onReset: () => void
  onValidationChange?: (isValid: boolean) => void
  onDuplicateCheck: () => Promise<boolean>
}

// 첫 번째 스텝 컴포넌트
const StepOneContent: FC<IStepOneContentProps> = ({
  clientData,
  onDataChange,
  onNext,
  onReset,
  onValidationChange,
  onDuplicateCheck
}) => {
  const handleChange = (field: keyof IClientDetail) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ [field]: event.target.value })
  }

  const handleSelectChange = (field: keyof IClientDetail) => (event: SelectChangeEvent) => {
    onDataChange({ [field]: event.target.value })
  }

  const handleSwitchChange = (field: keyof IClientDetail) => (selected: boolean) => {
    onDataChange({ [field]: selected })
  }

  const handleDateChange = (start: string, end: string) => {
    onDataChange({ expireDate: start })
  }

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // 필수값 체크 함수 추가
  const checkRequiredFields = (): boolean => {
    if (!clientData) return false

    const isValid = Boolean(clientData.companyId && clientData.companyName && clientData.reportEmail)
    onValidationChange?.(isValid)

    return isValid
  }

  const [companyIdOrg, setCompanyIdOrg] = useState(clientData?.companyId || '')
  const [clientDataOrg, setClientDataOrg] = useState<IClientDetail | null>(null)

  useEffect(() => {
    if ((clientData?.companyNo ?? 0) > 0) {
      if (!clientDataOrg) {
        setClientDataOrg(clientData)
      }

      if (companyIdOrg === '') {
        setCompanyIdOrg(clientData?.companyId || '')
      }
    }
  }, [clientData])

  return (
    <>
      <Box>
        <WindowCard title='고객사 정보'>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사ID
                </Typography>
                <TextField
                  disabled={(clientData?.companyNo ?? 0) > 0}
                  size='small'
                  value={clientData?.companyId || ''}
                  onChange={handleChange('companyId')}
                  placeholder='필수입력'
                  sx={{ ...requiredTextFieldStyle, ...grayTextFieldStyle }}
                />
                <Button
                  size='medium'
                  variant='contained'
                  disabled={companyIdOrg === clientData?.companyId}
                  onClick={async () => {
                    const isDuplicate = await onDuplicateCheck()

                    if (!isDuplicate) {
                      setCompanyIdOrg(clientData?.companyId || '')
                    }
                  }}
                >
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
                  sx={{ width: '100%', ...requiredTextFieldStyle, ...grayTextFieldStyle }}
                  value={clientData?.companyName || ''}
                  onChange={handleChange('companyName')}
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
                  sx={{ width: '100%', ...grayTextFieldStyle }}
                  value={clientData?.address || ''}
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
                  sx={{ width: '100%', ...grayTextFieldStyle }}
                  value={clientData?.brn || ''}
                  onChange={handleChange('brn')}
                  placeholder='선택입력'
                />
              </Box>
            </Grid>

            <Grid item xs={5}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 3 }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  사업자 현재 상태
                </Typography>
                <CustomSelectBox
                  value={String(clientData?.companyStatus || '')}
                  onChange={handleSelectChange('companyStatus')}
                  options={[
                    { key: '1', value: '0', label: '계속사업자' },
                    { key: '2', value: '1', label: '휴업' },
                    { key: '3', value: '2', label: '폐업' },
                    { key: '4', value: '3', label: '말소' },
                    { key: '5', value: '4', label: '간주폐업' }
                  ]}
                  backgroundColor={grayTextBackground}
                  placeholder='상태를 선택하세요'
                  border={false}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  계약기간설정
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <PickersRange
                    useIcon={true}
                    label={'선택입력'}
                    returnFormat='yyyy-MM-dd'
                    onChange={handleDateChange}
                    inputStyle={{ backgroundColor: grayTextBackground, border: 'none' }}
                    useNotDefaultStyle
                    isSingleDate={true}
                  />
                </Box>
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
                  selected={clientData?.reportGeneration === YN.Y}
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
                  sx={{ width: '100%', ...requiredTextFieldStyle, ...grayTextFieldStyle }}
                  value={clientData?.reportEmail || ''}
                  onChange={handleChange('reportEmail')}
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
                  selected={clientData?.accountStatus === YN.Y}
                  onChange={handleSwitchChange('accountStatus')}
                  activeColor={['#9155FD', '#F57A52']}
                />
              </Box>
            </Grid>
          </Grid>
        </WindowCard>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className='button-wrapper'>
          <Button
            size='medium'
            variant='contained'
            onClick={() => {
              if (companyIdOrg !== clientData?.companyId) {
                alert('중복확인을 해주세요')

                return
              }

              onNext()
            }}
            sx={{ mr: 4 }}
            disabled={!checkRequiredFields()}
          >
            등록
          </Button>

          <Button
            size='medium'
            color='secondary'
            variant='outlined'
            onClick={() => {
              clientDataOrg && onDataChange(clientDataOrg)
            }}
          >
            취소
          </Button>
        </div>
      </Box>
    </>
  )
}

export default StepOneContent
