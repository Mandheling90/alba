import React from 'react'
import { IconSvgSelector } from './IconSvgSelector'

const IconSvgCustom: React.FC<IconSvgSelector> = ({ fillColor, selected }) => {
  return (
    <svg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d_98_38428)'>
        <circle cx='26' cy='26' r='19' fill={fillColor} stroke={selected ? fillColor : 'white'} strokeWidth='2' />
        <path
          d='M37.1429 25.4286H35.4286V20.8571C35.4286 20.2509 35.1878 19.6696 34.7591 19.2409C34.3304 18.8122 33.7491 18.5714 33.1429 18.5714H28.5714V16.8571C28.5714 16.0994 28.2704 15.3727 27.7346 14.8368C27.1988 14.301 26.472 14 25.7143 14C24.9565 14 24.2298 14.301 23.694 14.8368C23.1582 15.3727 22.8571 16.0994 22.8571 16.8571V18.5714H18.2857C17.6795 18.5714 17.0981 18.8122 16.6695 19.2409C16.2408 19.6696 16 20.2509 16 20.8571V25.2H17.7143C19.4286 25.2 20.8 26.5714 20.8 28.2857C20.8 30 19.4286 31.3714 17.7143 31.3714H16V35.7143C16 36.3205 16.2408 36.9019 16.6695 37.3305C17.0981 37.7592 17.6795 38 18.2857 38H22.6286V36.2857C22.6286 34.5714 24 33.2 25.7143 33.2C27.4286 33.2 28.8 34.5714 28.8 36.2857V38H33.1429C33.7491 38 34.3304 37.7592 34.7591 37.3305C35.1878 36.9019 35.4286 36.3205 35.4286 35.7143V31.1429H37.1429C37.9006 31.1429 38.6273 30.8418 39.1632 30.306C39.699 29.7702 40 29.0435 40 28.2857C40 27.528 39.699 26.8012 39.1632 26.2654C38.6273 25.7296 37.9006 25.4286 37.1429 25.4286Z'
          fill='#9155FD'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_38428'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_98_38428' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_98_38428' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}

export default IconSvgCustom
