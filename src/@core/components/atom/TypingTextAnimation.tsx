import { Box, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface ITypingTextAnimation {
  text: string
  interval?: number
}

const TypingTextAnimation: FC<ITypingTextAnimation> = ({ text, interval = 300 }): React.ReactElement => {
  const [displayedText, setDisplayedText] = useState('') // 현재 표시 중인 텍스트
  const [index, setIndex] = useState(0) // 현재 글자 인덱스

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedText(prev => prev + text[index]) // 한 글자 추가
      setIndex(prevIndex => {
        const nextIndex = prevIndex + 1

        return nextIndex < text.length ? nextIndex : 0
      })

      if (index >= text.length - 1) {
        // 모든 글자가 나타났을 때 초기화
        setDisplayedText('')
        setIndex(0)
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [index, interval, text])

  return (
    <Box
      display='flex'
      justifyContent='flex-start' // 왼쪽 정렬로 설정
      alignItems='center'
      height='100%'
      width='100%'
      marginLeft={'30%'}
    >
      <Typography
        variant='body1'
        fontWeight='bold'
        fontSize={16}
        color='rgba(112, 111, 111, 1)'
        sx={{ textAlign: 'left' }} // 텍스트 정렬 왼쪽으로 설정
      >
        {displayedText}
      </Typography>
    </Box>
  )
}

export default TypingTextAnimation
