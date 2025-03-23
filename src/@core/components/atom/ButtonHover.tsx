import { Box } from '@mui/material'
import React, { useState } from 'react'

interface IButtonHover {
  display: React.ReactNode
  hover: React.ReactNode
}

const ButtonHover: React.FC<IButtonHover> = ({ display, hover }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ display: 'flex', alignItems: 'center' }}>
      {isHovered ? hover : display}
    </Box>
  )
}

export default ButtonHover
