import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import { scrollbarStyles } from './scrollbarStyles'

interface IScrollCustomProps {
  maxHeight: number
  children: React.ReactNode
  ref?: any
}

export interface ScrollCustomRef {
  scrollToTop: () => void
  scrollToBottom: () => void
  keepSelectedItemAtTop: (element: HTMLElement) => void
}

const ScrollCustom: FC<IScrollCustomProps> = forwardRef<ScrollCustomRef, IScrollCustomProps>(
  ({ children, maxHeight }, ref) => {
    const [scrollbarVisible, setScrollbarVisible] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollToTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }
    const scrollToBottom = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
      }
    }
    const keepSelectedItemAtTop = (element: HTMLElement) => {
      if (element && scrollContainerRef.current) {
        const containerTop = scrollContainerRef.current.getBoundingClientRect().top
        const elementTop = element.getBoundingClientRect().top
        const scrollOffset = elementTop - containerTop
        scrollContainerRef.current.scrollTop += scrollOffset - 10
      }
    }

    // 부모 컴포넌트에서 호출 가능한 메서드를 정의
    useImperativeHandle(ref, () => ({
      scrollToTop,
      scrollToBottom,
      keepSelectedItemAtTop
    }))

    return (
      <ScrollCustomDiv ref={scrollContainerRef} $maxHeight={maxHeight} $scrollbarVisible={scrollbarVisible}>
        {children}
      </ScrollCustomDiv>
    )
  }
)

export const ScrollCustomDiv = styled.div<{
  $maxHeight?: number
  $minHeight?: number
  $scrollbarVisible: boolean
  $isboder?: boolean
  boderColor?: string
  pb?: number
  scrollbarColor?: string
}>`
  ${({ $isboder, boderColor }) =>
    $isboder && `border: 1px solid ${boderColor ? boderColor : 'rgba(233, 233, 233, 1)'};`}
  ${({ $maxHeight }) => ($maxHeight ? `max-height: ${$maxHeight}px;` : `height : 100%;`)}
  ${({ $minHeight }) => $minHeight && `min-height: ${$minHeight}px;`}
  ${({ pb }) => pb && `padding-bottom: ${pb}px;`}

  overflow-y: scroll;
  margin-right: -4px;

  ${scrollbarStyles}/* scrollbarStyles를 템플릿 리터럴 내에 삽입 */
`

export default ScrollCustom
