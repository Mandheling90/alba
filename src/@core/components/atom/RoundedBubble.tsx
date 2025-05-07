import { Box, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

interface IRoundedBubble {
  title: string
  content: string
  background?: string
  color?: string
  tailDirection?: '5' | '7'
}

const BubbleContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: visible;
`

const Bubble = styled.div<{ background?: string; color?: string }>`
  background-color: ${({ background }) => background || '#f0f0f0'};
  border-radius: 50%;
  width: 120px;
  height: 120px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible; /* 꼬리가 잘리지 않도록 */
`

const Tail = styled.div<{ background?: string; tailDirection?: '5' | '7' }>`
  position: absolute;
  bottom: -6px;
  left: ${({ tailDirection }) => (tailDirection === '5' ? '75%' : '25%')};
  transform: translateX(-50%) rotate(${({ tailDirection }) => (tailDirection === '5' ? '-35deg' : '35deg')});
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 20px solid ${({ background }) => background || '#f0f0f0'};
  z-index: 1;
`

const RoundedBubble: React.FC<IRoundedBubble> = ({ title, content, background, color = '#fff', tailDirection }) => {
  return (
    <BubbleContainer>
      <Bubble background={background} color={color}>
        <Box>
          <Typography color={color}>{title}</Typography>
          <Typography fontSize={25} color={color}>
            {content}
          </Typography>
        </Box>
      </Bubble>
      <Tail background={background} tailDirection={tailDirection} />
    </BubbleContainer>
  )
}

export default RoundedBubble
