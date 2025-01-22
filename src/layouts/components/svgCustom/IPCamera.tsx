import React from 'react'
import { IconSvgSelector } from './IconSvgSelector'

const IconSvgCustom: React.FC<IconSvgSelector> = ({ fillColor, selected }) => {
  return (
    <svg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d_98_38425)'>
        <circle cx='26' cy='26' r='19' fill={fillColor} stroke={selected ? fillColor : 'white'} strokeWidth='2' />
        <path
          d='M18.836 25.6344L21.236 29.7984L18.2 33.6144L14 26.3424L18.836 25.6344ZM32 32.7984V29.5464C33.056 29.0784 33.8 28.0344 33.8 26.7984C33.8 26.1144 33.56 25.4784 33.164 24.9984L35.528 23.6184C36.74 22.9104 37.16 21.3624 36.452 20.1504L34.796 17.2704C34.4584 16.6884 33.9044 16.2634 33.2548 16.0881C32.6052 15.9128 31.9126 16.0013 31.328 16.3344L21.572 21.9984C20.432 22.6344 20.036 24.0984 20.696 25.2504L22.496 28.3704C23.156 29.5104 24.632 29.9064 25.772 29.2464L28.028 27.9504C28.328 28.6584 28.892 29.2344 29.6 29.5464V32.7984C29.6 34.1184 30.68 35.1984 32 35.1984H38V32.7984H32Z'
          fill='#9155FD'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_38425'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_98_38425' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_98_38425' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}

export default IconSvgCustom
