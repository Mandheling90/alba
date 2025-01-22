// src/styles/scrollbarStyles.ts
import { css } from 'styled-components'

export const scrollbarStyles = css<{
  scrollbarColor?: string
}>`
  &::-webkit-scrollbar {
    width: 4px;
    opacity: 0;
    transition: opacity 0.3s; /* 스크롤바의 투명도 변환 */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* 트랙을 투명하게 설정 */
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ scrollbarColor }) =>
      scrollbarColor ? scrollbarColor : `rgba(233, 233, 233, 1)`}; /* 핸들의 배경색 */
    border-radius: 6px;
    border: 1px solid transparent; /* 핸들의 테두리 (투명) */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555; /* 핸들 호버 시 배경색 */
  }

  &:hover::-webkit-scrollbar {
    opacity: 1;
  }
`

export const scrollbarSx = {
  // 스크롤바 스타일 적용
  '&::-webkit-scrollbar': {
    width: '4px',
    opacity: 0,
    transition: 'opacity 0.3s'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
    borderRadius: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '6px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555'
  },
  '&:hover::-webkit-scrollbar': {
    opacity: 1
  }
}
