import { ToggleButton } from '@mui/material'
import { FC } from 'react'

interface IIconToggleButton {
  selected: boolean
  icon: string
  fontSize?: number
  width?: number
  onClick: () => void
}

const IconToggleButton: FC<IIconToggleButton> = ({
  selected,
  icon,
  fontSize = 30,
  width = 40,
  onClick
}): React.ReactElement => {
  return (
    <ToggleButton
      value='check'
      selected={selected}
      sx={{
        border: 'none', // 테두리 없애기
        p: 0, // 패딩 없애기
        '&.Mui-selected': {
          // 선택된 상태에 대한 스타일 지정
          // backgroundColor: 'transparent' // 선택된 상태 배경색을 투명하게 설정
          backgroundColor: '#9155fd5e' // 선택된 상태 배경색을 투명하게 설정
        }
      }}
      onClick={onClick}
    >
      <img style={{ width: `${width}px` }} src={icon} alt={'togle'} />
    </ToggleButton>
  )
}

export default IconToggleButton
