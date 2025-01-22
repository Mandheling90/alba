import React, { useState } from 'react'
import styled from 'styled-components'

interface CheckboxProps {
  $isChecked: boolean
}

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transformorigin: 'center';
`

const CheckboxButton = styled.button<CheckboxProps>`
  width: 20px; /* 기본 크기 */
  height: 20px; /* 기본 크기 */
  border-radius: 50%;
  background-color: ${({ $isChecked }) =>
    $isChecked ? 'rgba(145, 85, 253, 1)' : '#ccc'}; /* 체크 상태에 따라 색상 변경 */
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, width 0.3s ease, background-color 0.3s ease; /* 크기 및 배경색 애니메이션 */

  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0; /* padding을 0으로 설정해서 버튼 크기를 정확히 맞춥니다 */

  /* 마우스 오버 시 크기 확장 및 스타일 변경 */
  &:hover {
    width: auto; /* 마우스 오버 시 너비 증가 */
    transform: scale(1.2);
    padding: 0 10px;
    border-radius: 20px; /* 원형이 아니라 타원형으로 변형 */
    background-color: ${({ $isChecked }) =>
      $isChecked ? 'rgba(145, 85, 253, 0.8)' : '#bbb'}; /* hover 시 배경색 변경 */
  }

  transformorigin: 'center';
`

const LabelText = styled.span`
  font-size: 10px; /* 기본 텍스트 크기 */
  color: white; /* 글씨 색상 */
  font-weight: bold;
  white-space: nowrap; /* 한 줄로 텍스트 유지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 텍스트가 길면 생략 부호(...) 표시 */

  /* hover 시 텍스트 크기 및 애니메이션 */
  ${CheckboxButton}:hover & {
    font-size: 10px; /* 텍스트 크기 증가 */
    white-space: normal; /* 텍스트가 여러 줄로 표시되도록 설정 */
  }
`

// 두 개의 label을 받도록 수정
interface ICheckbox {
  labelNormal: string
  labelHovered: string
  isChecked: boolean
  onChange: (checked: boolean) => void
}

const CircleCheckBox: React.FC<ICheckbox> = ({ labelNormal, labelHovered, isChecked, onChange }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    onChange(!isChecked) // 체크 상태 변경
  }

  return (
    <CheckboxWrapper>
      <CheckboxButton
        $isChecked={isChecked}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <LabelText>
          {isHovered ? labelHovered : labelNormal} {/* 마우스 오버 상태에 따라 다른 텍스트 표시 */}
        </LabelText>
      </CheckboxButton>
    </CheckboxWrapper>
  )
}

export default CircleCheckBox
