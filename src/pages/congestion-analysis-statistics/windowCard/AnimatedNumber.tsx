import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, useEffect, useState } from 'react'
import { BorderInput } from 'src/@core/styles/StyledComponents'

const slideUpAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
`

const slideDownAnimation = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`

const AnimatedBorderInput = styled(BorderInput)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NumberWrapper = styled.div<{ isAnimating: boolean; isIncreasing: boolean }>`
  animation: ${props => (props.isAnimating ? (props.isIncreasing ? slideUpAnimation : slideDownAnimation) : 'none')}
    0.3s ease-out;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface AnimatedNumberProps {
  number: number
  fontSize?: string
  padding?: string
  minWidth?: string
  backgroundColor?: string
  color?: string
}

const AnimatedNumber: FC<AnimatedNumberProps> = ({
  number,
  fontSize = '1.5rem',
  padding = '0px',
  minWidth = 'auto',
  backgroundColor = 'transparent',
  color = 'inherit'
}) => {
  const [prevNumber, setPrevNumber] = useState(number)
  const [animatingDigits, setAnimatingDigits] = useState<boolean[]>([])
  const [isIncreasingDigits, setIsIncreasingDigits] = useState<boolean[]>([])

  useEffect(() => {
    if (prevNumber !== number) {
      const prevDigits = formatNumber(prevNumber)
      const currentDigits = formatNumber(number)

      // 각 자릿수별로 변화 여부와 증가/감소 여부를 확인
      const newAnimatingDigits = currentDigits.map((digit, index) => digit !== prevDigits[index])
      const newIsIncreasingDigits = currentDigits.map((digit, index) => parseInt(digit) > parseInt(prevDigits[index]))

      setAnimatingDigits(newAnimatingDigits)
      setIsIncreasingDigits(newIsIncreasingDigits)
      setPrevNumber(number)

      // 애니메이션 상태 초기화
      setTimeout(() => {
        setAnimatingDigits(newAnimatingDigits.map(() => false))
      }, 300)
    }
  }, [number])

  const formatNumber = (num: number): string[] => {
    return num.toString().padStart(3, '0').split('')
  }

  return (
    <>
      {formatNumber(number).map((digit, index) => (
        <AnimatedBorderInput
          key={index}
          fontSize={fontSize}
          padding={padding}
          minWidth={minWidth}
          backgroundColor={backgroundColor}
          color={color}
        >
          <NumberWrapper isAnimating={animatingDigits[index]} isIncreasing={isIncreasingDigits[index]}>
            {digit}
          </NumberWrapper>
        </AnimatedBorderInput>
      ))}
    </>
  )
}

export default AnimatedNumber
