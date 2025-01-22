import React from 'react'

interface ImageDisplayProps {
  base64Image: string
  width?: number
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ base64Image, width = 0 }) => {
  const imageUrl = `data:image/png;base64,${base64Image}`

  return <img src={imageUrl} alt='Base64 이미지' style={{ width: width > 0 ? `${width}px` : '100%' }} loading='lazy' />
}

export default ImageDisplay
