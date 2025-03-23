import { Typography } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import ButtonHover from '../atom/ButtonHover'

interface ICustomAddCancelButton {
  onSaveClick: () => void
  onCancelClick: () => void
}

const CustomAddCancelButton: React.FC<ICustomAddCancelButton> = ({ onSaveClick, onCancelClick }) => {
  return (
    <>
      <ButtonHover
        display={<IconCustom isCommon path='camera' icon='save' />}
        hover={
          <Typography component='span' variant='inherit' sx={buttonStyle} onClick={onSaveClick}>
            저장
          </Typography>
        }
      />

      <ButtonHover
        display={<IconCustom isCommon path='camera' icon='cancel' />}
        hover={
          <Typography component='span' variant='inherit' sx={buttonStyle} onClick={onCancelClick}>
            취소
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
