import React from 'react'
import { IconSvgSelector } from './IconSvgSelector'

const IconSvgCustom: React.FC<IconSvgSelector> = ({ fillColor, selected }) => {
  return (
    <svg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d_98_38424)'>
        <circle cx='26' cy='26' r='19' fill={fillColor} stroke={selected ? fillColor : 'white'} strokeWidth='2' />
        <path
          d='M22.68 14H15.72C15.3224 14 15 14.3224 15 14.72V19.28C15 19.6776 15.3224 20 15.72 20H22.68C23.0776 20 23.4 19.6776 23.4 19.28V14.72C23.4 14.3224 23.0776 14 22.68 14Z'
          fill='#9155FD'
          stroke='#9155FD'
          strokeWidth='1.5'
        />
        <path
          d='M29.2801 32H22.3201C21.9225 32 21.6001 32.3224 21.6001 32.72V37.28C21.6001 37.6776 21.9225 38 22.3201 38H29.2801C29.6777 38 30.0001 37.6776 30.0001 37.28V32.72C30.0001 32.3224 29.6777 32 29.2801 32Z'
          fill='#9155FD'
          stroke='#9155FD'
          strokeWidth='1.5'
        />
        <path
          d='M35.88 14H28.92C28.5223 14 28.2 14.3224 28.2 14.72V19.28C28.2 19.6776 28.5223 20 28.92 20H35.88C36.2776 20 36.6 19.6776 36.6 19.28V14.72C36.6 14.3224 36.2776 14 35.88 14Z'
          fill='#9155FD'
          stroke='#9155FD'
          strokeWidth='1.5'
        />
        <path
          d='M19.2 20V24.2C19.2 24.8365 19.4528 25.447 19.9029 25.8971C20.353 26.3471 20.9634 26.6 21.6 26.6H30C30.6365 26.6 31.2469 26.3471 31.697 25.8971C32.1471 25.447 32.4 24.8365 32.4 24.2V20M25.8 26.6V32'
          stroke='#9155FD'
          strokeWidth='1.5'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_38424'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_98_38424' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_98_38424' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}

export default IconSvgCustom
