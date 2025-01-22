import React from 'react'
import { IconSvgSelector } from './IconSvgSelector'

const IconSvgCustom: React.FC<IconSvgSelector> = ({ fillColor, selected }) => {
  return (
    <svg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d_98_38427)'>
        <circle cx='26' cy='26' r='19' fill={fillColor} stroke={selected ? fillColor : 'white'} strokeWidth='2' />
        <path
          d='M24.56 25.04V15.44C24.56 15.0581 24.7117 14.6918 24.9818 14.4218C25.2518 14.1517 25.6181 14 26 14C26.3819 14 26.7482 14.1517 27.0182 14.4218C27.2883 14.6918 27.44 15.0581 27.44 15.44V25.04C27.44 25.4219 27.2883 25.7882 27.0182 26.0582C26.7482 26.3283 26.3819 26.48 26 26.48C25.6181 26.48 25.2518 26.3283 24.9818 26.0582C24.7117 25.7882 24.56 25.4219 24.56 25.04ZM32.546 15.2C32.2262 15.0031 31.8422 14.9389 31.4758 15.0211C31.1094 15.1033 30.7896 15.3253 30.5846 15.6399C30.3796 15.9545 30.3055 16.3368 30.3783 16.7052C30.451 17.0735 30.6648 17.399 30.974 17.612C33.6092 19.3244 35.12 22.04 35.12 25.04C35.12 27.4588 34.1591 29.7785 32.4488 31.4888C30.7385 33.1991 28.4188 34.16 26 34.16C23.5812 34.16 21.2615 33.1991 19.5512 31.4888C17.8409 29.7785 16.88 27.4588 16.88 25.04C16.88 22.04 18.3908 19.3244 21.026 17.606C21.3188 17.3866 21.517 17.064 21.5805 16.7036C21.644 16.3433 21.568 15.9724 21.3679 15.6661C21.1678 15.3598 20.8586 15.1412 20.5031 15.0546C20.1476 14.968 19.7725 15.02 19.454 15.2C15.9872 17.4536 14 21.0428 14 25.04C14 28.2226 15.2643 31.2748 17.5147 33.5253C19.7652 35.7757 22.8174 37.04 26 37.04C29.1826 37.04 32.2348 35.7757 34.4853 33.5253C36.7357 31.2748 38 28.2226 38 25.04C38 21.0428 36.0128 17.4536 32.546 15.2Z'
          fill='#9155FD'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_38427'
          x='0'
          y='0'
          width='52'
          height='52'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='3' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0.568627 0 0 0 0 0.333333 0 0 0 0 0.992157 0 0 0 0.85 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_98_38427' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_98_38427' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}

export default IconSvgCustom
