import { Accordion, AccordionSummary, Typography } from '@mui/material'
import React, { useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ICustomAccordion {
  id: number
  title: string | React.ReactNode
  expanded?: boolean
  AccordionDetails?: React.ReactNode
  onClick?: (id: number) => void
}

const CustomAccordion: React.FC<ICustomAccordion> = ({ id, title, expanded, AccordionDetails, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <Accordion
      key={id}
      sx={{
        margin: 0,
        '&.Mui-expanded': {
          margin: 0
        }
      }}
      expanded={isExpanded}
    >
      <AccordionSummary
        expandIcon={
          <div onClick={handleIconClick}>
            {expanded === undefined ? <IconCustom isCommon icon='arrow_right_disable' /> : <></>}
          </div>
        }
        aria-controls={`panel${id}-content`}
        id={`panel${id}-header`}
        sx={{
          margin: 0,
          '&.Mui-expanded': {
            margin: 0,
            minHeight: '48px',
            height: '48px',
            '& .MuiAccordionSummary-expandIconWrapper': {
              transform: 'rotate(90deg)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(145, 85, 253, 0.1)'
          },
          minHeight: '48px',
          height: '48px'
        }}
        onClick={event => {
          onClick && onClick(id)
          event.stopPropagation()
        }}
      >
        {typeof title === 'string' ? <Typography>{title}</Typography> : title}
      </AccordionSummary>
      {AccordionDetails && AccordionDetails}
    </Accordion>
  )
}

export default CustomAccordion
