import { Button, ButtonProps } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'

interface AnimatedButtonProps extends Omit<ButtonProps, 'onClick'> {
  expandDuration?: number
  collapseDuration?: number
  expandedText?: string
  collapsedText?: string
  onAnimationComplete?: () => void
  textPadding?: number // 텍스트 좌우 패딩
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<boolean> | boolean
}

const AnimatedButton: FC<AnimatedButtonProps> = ({
  expandDuration = 0.3,
  collapseDuration = 0.8,
  expandedText,
  collapsedText,
  children,
  onClick,
  onAnimationComplete,
  textPadding = 20, // 기본 패딩값
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [buttonText, setButtonText] = useState(collapsedText || children)
  const [buttonWidth, setButtonWidth] = useState<number>(0)
  const textRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 텍스트 크기 측정 및 버튼 너비 설정
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth
      setButtonWidth(textWidth + textPadding) // 텍스트 너비 + 좌우 패딩
    }
  }, [buttonText, textPadding])

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      const result = await onClick(event)
      if (!result) {
        return
      }
    }

    setIsAnimating(true)
    if (expandedText) {
      setButtonText(expandedText)
    }

    // 애니메이션 완료 후 콜백 실행
    setTimeout(() => {
      setIsAnimating(false)
      setButtonText(collapsedText || children)
      if (onAnimationComplete) {
        onAnimationComplete()
      }
    }, expandDuration * 1000 + 2000) // 확장 시간 + 2초 대기
  }

  return (
    <Button
      {...props}
      ref={buttonRef}
      onClick={handleClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: isAnimating ? `${buttonWidth}px` : `${buttonWidth}px`,
        minWidth: isAnimating ? `${buttonWidth}px` : `${buttonWidth}px`,
        transition: isAnimating
          ? `all ${expandDuration}s cubic-bezier(0.4, 0, 0.2, 1)`
          : `all ${collapseDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
        '&:hover': {
          width: isAnimating ? `${buttonWidth}px` : `${buttonWidth}px`,
          minWidth: isAnimating ? `${buttonWidth}px` : `${buttonWidth}px`
        },
        ...props.sx
      }}
    >
      <span
        ref={textRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.3s ease-in-out',
          opacity: 1,
          padding: `0 ${textPadding / 2}px`
        }}
      >
        {buttonText}
      </span>
    </Button>
  )
}

export default AnimatedButton
