import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'

interface CustomTooltipProps extends Omit<TooltipProps, 'classes'> {
  placement?: TooltipProps['placement']
  backgroundColor?: string
  color?: string
  open?: boolean
  onClose?: () => void
  arrowPosition?: 'left' | 'center' | 'right'
  offset?: number
  isToast?: boolean
  toastDuration?: number
}

// Tooltip을 위한 독립적인 컴포넌트 정의
const CustomTooltip = styled(
  ({
    className,
    placement = 'bottom',
    backgroundColor = 'rgba(231, 231, 231, 1)',
    color = '#000',
    open,
    onClose,
    arrowPosition = 'center',
    offset = 70,
    isToast = false,
    toastDuration = 1000,
    ...props
  }: CustomTooltipProps) => {
    const [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
      setIsOpen(open)
    }, [open])

    useEffect(() => {
      if (isToast && isOpen) {
        const timer = setTimeout(() => {
          setIsOpen(false)
          onClose?.()
        }, toastDuration)

        return () => clearTimeout(timer)
      }
    }, [isToast, isOpen, toastDuration, onClose])

    const getPopperProps = () => {
      if (arrowPosition === 'center') return {}

      const offsetValue = arrowPosition === 'left' ? -offset : offset

      return {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [offsetValue, 0]
            }
          }
        ]
      }
    }

    return (
      <Tooltip
        {...props}
        placement={placement}
        classes={{ popper: className }}
        arrow
        open={isOpen}
        onClose={onClose}
        disableFocusListener={!!isOpen}
        disableHoverListener={!!isOpen}
        disableTouchListener={!!isOpen}
        PopperProps={getPopperProps()}
      />
    )
  }
)(({ theme, backgroundColor, color }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: backgroundColor || 'rgba(231, 231, 231, 1)',
    color: color || '#000',
    fontSize: 14
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: backgroundColor || 'rgba(231, 231, 231, 1)'
  }
}))

export default CustomTooltip
