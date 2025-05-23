import { Typography } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import ButtonHover from '../atom/ButtonHover'

interface ICustomAddCancelButton {
  onSaveClick: () => void
  onCancelClick: () => void
  text?: string[]
}

const CustomAddCancelButton: React.FC<ICustomAddCancelButton> = ({ onSaveClick, onCancelClick, text }) => {
  return (
    <>
      <ButtonHover
        display={<IconCustom isCommon path='camera' icon='save' />}
        hover={
          <Typography
            component='span'
            variant='inherit'
            sx={buttonStyle}
            onClick={e => {
              e.stopPropagation()
              onSaveClick()
            }}
          >
            {text?.[0] ?? '저장'}
          </Typography>
        }
      />

      <ButtonHover
        display={<IconCustom isCommon path='camera' icon='cancel' />}
        hover={
          <Typography
            component='span'
            variant='inherit'
            sx={buttonStyle}
            onClick={e => {
              e.stopPropagation()
              onCancelClick()
            }}
          >
            {text?.[1] ?? '취소'}
          </Typography>
        }
      />
    </>
  )
}

// 스타일 객체 정의
const buttonStyle = {
  backgroundColor: '#9155FD',
  color: 'white',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '2px 5px',
  borderRadius: '5px'
}

export default CustomAddCancelButton
