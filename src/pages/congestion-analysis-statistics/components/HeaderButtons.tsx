import { Box, Button } from '@mui/material'
import router from 'next/router'
import { FC, useRef } from 'react'
import { useModal } from 'src/hooks/useModal'
import IconCustom from 'src/layouts/components/IconCustom'
import RangeSettingModal, { RangeSettingModalRef } from './RangeSettingModal'
import styled from 'styled-components'

const HeaderButtons: FC = (): React.ReactElement => {
  const { setSimpleDialogModalProps } = useModal()
  const modalRef = useRef<RangeSettingModalRef>(null)

  return (
    <Box display={'flex'} gap={2}>
      <Button
        variant='contained'
        color='primary'
        startIcon={<IconCustom icon='plus-box' isCommon />}
        onClick={() => {
          router.push('/congestion-analysis-statistics/add-facility')
        }}
      >
        시설 추가
      </Button>
      <Button
        variant='contained'
        color='primary'
        startIcon={<IconCustom icon='bell-plus' isCommon />}
        onClick={() => {
          setSimpleDialogModalProps({
            open: true,
            isConfirm: true,
            size: 'small',
            title: <CustomModalTitle>점유율 단계 설정</CustomModalTitle>,
            contents: <RangeSettingModal ref={modalRef} onConfirm={ranges => console.log('저장된 범위:', ranges)} />,
            confirmFn: () => {
              const isValid = modalRef.current?.handleConfirm()

              return isValid ?? false
            },
            confirmText: '저장'
          })
        }}
      >
        상태 설정
      </Button>
    </Box>
  )
}

const CustomModalTitle = styled.span`
  font-size: 20px;
  color: #5e5b65;
  max-width: 260px;
  margin: 0 auto;
  font-weight: 600;
`

export default HeaderButtons
