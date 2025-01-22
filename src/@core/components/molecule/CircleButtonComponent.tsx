import React, { useState } from 'react'
import styled, { css } from 'styled-components'

interface ButtonProps {
  $isActive: boolean
  $isHover: boolean
}

const CircleButton = styled.button<ButtonProps>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(145, 85, 253, 1);
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  color: #fff;
  font-size: 10px; /* 기본 크기 설정 */

  ${({ $isActive }) =>
    $isActive &&
    css`
      width: auto;
      padding: 0 10px;
      height: '20px';
      background: rgba(145, 85, 253, 1);
      border-radius: 20px;
      font-size: 14px;
      transform: scale(1);
    `}

  /* 활성화되지 않은 버튼의 hover 효과 */
  ${({ $isActive, $isHover }) =>
    !$isActive
      ? css`
          &:hover {
            transform: scale(1.2); /* 가로 세로 동시에 확대 */
          }
        `
      : css`
          ${$isHover && 'transform: scale(0.8);'};
        `}
`

const ButtonContent = styled.div<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  white-space: nowrap;
`

interface ICircleButtonComponent {
  selectNameList: string[]
  selectNameDisplayList?: string[]
  onClick: (index: number) => void
  index?: number
}

const CircleButtonComponent: React.FC<ICircleButtonComponent> = ({
  selectNameList,
  selectNameDisplayList,
  onClick,
  index = 0
}) => {
  const [activeButton, setActiveButton] = useState<number>(index)
  const [isHover, setIsHover] = useState(false)

  const handleClick = (index: number) => {
    setActiveButton(index)
    onClick(index)
    setIsHover(false)
  }

  const handleMouseEnter = (index: number) => {
    if (activeButton !== index) {
      setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHover(false)
  }

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {selectNameList.map((item, index) => (
        <CircleButton
          key={index}
          $isActive={activeButton === index}
          $isHover={isHover}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <ButtonContent $isActive={activeButton === index} $isHover={isHover}>
            {activeButton === index ? (
              <span>{item}</span>
            ) : (
              selectNameDisplayList && <span>{selectNameDisplayList[index]}</span>
            )}
          </ButtonContent>
        </CircleButton>
      ))}
    </div>
  )
}

export default CircleButtonComponent
