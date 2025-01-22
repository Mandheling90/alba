import { Typography } from '@mui/material'
import { FC } from 'react'
import styled from 'styled-components'

interface IEmptyMsg {
  message: string
  height?: string // height 값을 optional로 받도록 설정
}

const EmptyMsg: FC<IEmptyMsg> = ({ message, height = '100%' }): React.ReactElement => {
  return (
    <EmptyMsgDiv height={height}>
      <Typography variant='h6' sx={{ mr: 1, fontWeight: 600, lineHeight: 1.05 }}>
        {message}
      </Typography>
    </EmptyMsgDiv>
  )
}

const EmptyMsgDiv = styled.div<{ height: string }>`
  // height prop 추가
  display: flex;
  justify-content: center;
  height: ${({ height }) => height}; // 전달된 height 값 사용
  align-items: center;
`

export default EmptyMsg
