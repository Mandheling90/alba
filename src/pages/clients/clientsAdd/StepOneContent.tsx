import { Box, Button, Grid, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import AnimatedButton from 'src/@core/components/atom/AnimatedButton'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import PickersRange from 'src/@core/components/atom/PickersRange'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import { grayTextBackground, grayTextFieldStyle, requiredTextFieldStyle } from 'src/@core/styles/TextFieldStyle'
import { YN } from 'src/enum/commonEnum'
import { useModal } from 'src/hooks/useModal'
import { IClientDetail } from 'src/model/client/clientModel'
import { MAuthDuplicate } from 'src/model/commonModel'
import { useClientDuplicateCheck } from 'src/service/client/clientService'
import { getErrorMessage } from 'src/utils/CommonUtil'
import styled from 'styled-components'

interface IStepOneContentProps {
  clientData: IClientDetail | null
  onDataChange: (data: Partial<IClientDetail>) => void
  onNext: () => Promise<boolean>
  onValidationChange?: (isValid: boolean) => void
  useExitDisplay: boolean
}

// 첫 번째 스텝 컴포넌트
const StepOneContent: FC<IStepOneContentProps> = ({
  clientData,
  onDataChange,
  onNext,
  onValidationChange,
  useExitDisplay
}) => {
  const { mutateAsync: duplicateCheck } = useClientDuplicateCheck()

  const { setSimpleDialogModalProps, showModal } = useModal()

  const handleChange = (field: keyof IClientDetail) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ [field]: event.target.value })
  }

  const handleSelectChange = (field: keyof IClientDetail) => (event: SelectChangeEvent) => {
    onDataChange({ [field]: event.target.value })
  }

  const handleSwitchChange = (field: keyof IClientDetail) => (selected: boolean) => {
    onDataChange({ [field]: selected ? YN.Y : YN.N })
  }

  const handleDateChange = (start: string, end: string) => {
    onDataChange({ expireDate: start })
  }

  // 필수값 체크 함수 추가
  const checkRequiredFields = (): boolean => {
    if (!clientData) return false

    const isValid = Boolean(clientData.companyId && clientData.companyName && clientData.reportEmail)
    onValidationChange?.(isValid)

    return isValid
  }

  const [companyIdOrg, setCompanyIdOrg] = useState(clientData?.companyId || '')
  const [clientDataOrg, setClientDataOrg] = useState<IClientDetail | null>(null)

  const [duplicateResult, setDuplicateResult] = useState<MAuthDuplicate | null>(null)

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

  const handleSaveClick = async (): Promise<boolean> => {
    if (companyIdOrg !== clientData?.companyId) {
      setSimpleDialogModalProps({
        open: true,
        title: '중복확인을 해주세요'
      })

      return false
    }

    if (clientData.brn && (!/^\d+$/.test(clientData.brn) || clientData.brn.length !== 10)) {
      setSimpleDialogModalProps({
        open: true,
        title: !/^\d+$/.test(clientData.brn)
          ? `사업자등록번호는 숫자만 입력 가능합니다.`
          : `사업자등록번호는 10자리이어야 합니다.`
      })

      return false
    }

    const result = await onNext()

    return result
  }

  return (
    <WindowCard title='고객사 정보'>
      <ScrollContainer>
        <ScrollContainerInner>
          <Grid container spacing={3}>
            <Grid item xs={7}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'left'}
                >
                  고객사ID
                </Typography>
                <CustomTooltip
                  title={
                    <>
                      {duplicateResult?.duplicateYn === YN.Y ? (
                        duplicateResult.message
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          사용 가능한 ID입니다.
                          <CustomAddCancelButton
                            onCancelClick={() => {
                              onDataChange({ companyId: '' })
                              setDuplicateResult(null)
                            }}
                            onSaveClick={() => {
                              setCompanyIdOrg(clientData?.companyId || '')
                              setDuplicateResult(null)
                            }}
                          />
                        </Box>
                      )}
                    </>
                  }
                  placement='bottom'
                  backgroundColor='#9155fd4a'
                  open={duplicateResult !== null}
                  onClose={() => {
                    setDuplicateResult(null)
                  }}
                >
                  <TextField
                    disabled={(clientData?.companyNo ?? 0) > 0}
                    size='small'
                    value={clientData?.companyId || ''}
                    onChange={handleChange('companyId')}
                    placeholder='필수입력'
                    sx={{ ...requiredTextFieldStyle, ...grayTextFieldStyle }}
                  />
                </CustomTooltip>
                <Button
                  size='medium'
                  variant='contained'
                  disabled={companyIdOrg === clientData?.companyId}
                  onClick={async () => {
                    try {
                      const res = await duplicateCheck(clientData?.companyId)
                      setDuplicateResult(res.data)
                    } catch (error) {
                      showModal({
                        title: getErrorMessage(error)
                      })
                    }
                  }}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    minWidth: '100px'
                  }}
                >
                  중복확인
                </Button>
              </Box>
            </Grid>

            <Grid item xs={5}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '90px', whiteSpace: 'nowrap' }}
                  align={'right'}
                >
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
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'left'}
                >
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
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'left'}
                >
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
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'right'}
                >
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
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'left'}
                >
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
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'left'}
                >
                  리포트생성
                </Typography>
                <SwitchCustom
                  width={90}
                  switchName={['사용', '미사용']}
                  selected={clientData?.reportGeneration === YN.Y}
                  onChange={handleSwitchChange('reportGeneration')}
                  activeColor={['#9155FD', '#a5a5a5']}
                />
              </Box>
            </Grid>

            <Grid item xs={8}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '110px', whiteSpace: 'nowrap' }}
                  align={'right'}
                >
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
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '160px', whiteSpace: 'nowrap' }}
                  align={'left'}
                >
                  고객사계정
                </Typography>
                <SwitchCustom
                  width={90}
                  switchName={['활성', '비활성']}
                  selected={clientData?.accountStatus === YN.Y}
                  onChange={handleSwitchChange('accountStatus')}
                  activeColor={['#9155FD', '#a5a5a5']}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  variant='h6'
                  sx={{ minWidth: '110px', whiteSpace: 'nowrap' }}
                  align={'right'}
                >
                  퇴장객 분석
                </Typography>
                <SwitchCustom
                  disabled={!useExitDisplay}
                  width={90}
                  switchName={['활성', '비활성']}
                  selected={clientData?.exitDisplayYn === YN.Y}
                  onChange={handleSwitchChange('exitDisplayYn')}
                  activeColor={['#9155FD', '#a5a5a5']}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AnimatedButton
                  size='medium'
                  variant='contained'
                  onClick={handleSaveClick}
                  expandedText='고객사정보가 저장되었습니다'
                  collapsedText='저장'
                  sx={{ mr: 4 }}
                  disabled={!checkRequiredFields()}
                />

                <Button
                  size='medium'
                  color='secondary'
                  variant='outlined'
                  onClick={() => {
                    setSimpleDialogModalProps({
                      open: true,
                      title: '취소확인',
                      contents: '저장되지 않은 모든정보가 삭제됩니다. \n 정말 취소하시겠습니까?',
                      isConfirm: true,
                      confirmFn: () => {
                        clientDataOrg && onDataChange(clientDataOrg)
                      }
                    })
                    clientDataOrg && onDataChange(clientDataOrg)
                  }}
                >
                  취소
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ScrollContainerInner>
      </ScrollContainer>
    </WindowCard>
  )
}

const ScrollContainer = styled.div`
  overflow-x: auto;
  max-width: 100%;
`
const ScrollContainerInner = styled.div`
  // 100% 의 값과 1000px의 값 중 큰 값을 사용
  width: max(1000px, 100%);
`

export default StepOneContent
