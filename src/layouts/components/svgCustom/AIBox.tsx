import React from 'react'
import { IconSvgSelector } from './IconSvgSelector'

const IconSvgCustom: React.FC<IconSvgSelector> = ({ fillColor, selected }) => {
  return (
    <svg width='52' height='52' viewBox='0 0 52 52' fill={'none'} xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d_98_38421)'>
        <circle cx='26' cy='26' r='19' fill={fillColor} stroke={selected ? fillColor : 'white'} strokeWidth='2' />
        <rect x='17' y='17' width='18' height='18' rx='2' fill='#9155FD' />
        <path d='M22.25 14V38' stroke='#9155FD' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M30.5 14V38' stroke='#9155FD' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M14 29.75L38 29.75' stroke='#9155FD' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M14 23L38 23' stroke='#9155FD' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        <path
          d='M25.0329 23.7788L23.6145 28H22.6198L24.4792 23.0234H25.1149L25.0329 23.7788ZM26.2189 28L24.7937 23.7788L24.7082 23.0234H25.3474L27.217 28H26.2189ZM26.154 26.1509V26.8926H23.4846V26.1509H26.154ZM28.8812 23.0234V28H27.9412V23.0234H28.8812Z'
          fill='white'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_38421'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_98_38421' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_98_38421' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}

export default IconSvgCustom
