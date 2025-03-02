import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { styled } from '@mui/material/styles'

interface CustomTooltipProps extends Omit<TooltipProps, 'classes'> {
  placement?: TooltipProps['placement']
}

// Tooltip을 위한 독립적인 컴포넌트 정의
const CustomTooltip = styled(({ className, placement = 'bottom', ...props }: CustomTooltipProps) => (
  <Tooltip {...props} placement={placement} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(231, 231, 231, 1)', // 배경색
    color: '#000', // 텍스트 색상
    fontSize: 14
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'rgba(231, 231, 231, 1)' // 화살표 색상
  }
}))

export default CustomTooltip
