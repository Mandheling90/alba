import React from 'react'
import { IconSvgSelector } from './IconSvgSelector'

const IconSvgCustom: React.FC<IconSvgSelector> = ({ fillColor, selected }) => {
  return (
    <svg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d_98_38426)'>
        <circle cx='26' cy='26' r='19' fill={fillColor} stroke={selected ? fillColor : 'white'} strokeWidth='2' />
        <path
          d='M32.4 14H20.4C19.0745 14 18 15.0745 18 16.4V35.6C18 36.9255 19.0745 38 20.4 38H32.4C33.7255 38 34.8 36.9255 34.8 35.6V16.4C34.8 15.0745 33.7255 14 32.4 14Z'
          stroke='#9155FD'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M30 28.4008H30.012M22.8 18.8008H30M22.8 23.6008H30'
          stroke='#9155FD'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_38426'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_98_38426' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_98_38426' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}

export default IconSvgCustom
