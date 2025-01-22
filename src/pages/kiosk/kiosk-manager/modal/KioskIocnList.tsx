// ** MUI Imports
import { Box, Button, IconButton } from '@mui/material'
import { FC, useState } from 'react'
import { icons } from 'src/enum/kisokEnum'
import IconCustom from 'src/layouts/components/IconCustom'

interface IContentBody {
  disable?: boolean
  onClick: (icon: string) => void
}

const KioskIconList: FC<IContentBody> = ({ disable = false, onClick }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null) // 선택된 버튼의 인덱스를 저장
  const [isEditing, setIsEditing] = useState<boolean>(false) // 편집 모드 여부 (아이콘 목록 가시성 제어)

  // 아이콘 클릭 핸들러
  const handleIconClick = (index: number) => {
    setSelectedIndex(index) // 선택된 인덱스를 업데이트
    onClick(icons[index]) // 클릭 시 실행할 함수 호출
  }

  // 버튼 클릭 시 확인/수정 모드 전환
  const handleToggle = () => {
    setIsEditing(!isEditing) // 편집 모드 토글
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={3}>
      <Box
        sx={{
          border: isEditing ? '0.5px solid rgba(210, 209, 211, 1)' : '',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden', // 애니메이션 범위 제한을 위해 사용
          width: isEditing ? '100%' : 0, // 아이콘 목록의 가시성을 width로 제어
          transition: 'width 0.5s ease' // 애니메이션 속성 (왼쪽에서 오른쪽으로 나타남)
        }}
        ml={isEditing ? 3 : 0}
      >
        {icons.map((icon, index) => (
          <IconButton
            key={icon}
            sx={{
              p: 0,
              bgcolor: selectedIndex === index ? 'rgba(0, 0, 0, 0.3)' : 'transparent', // 선택된 버튼 강조 (더 진한 색)
              borderRadius: '4px', // 모서리 둥글게
              '&:hover': {
                bgcolor: selectedIndex === index ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)' // 호버 시 색상 변경
              },
              transform: isEditing ? 'translateX(0)' : 'translateX(-100%)', // 왼쪽에서 오른쪽으로 나타남
              transition: 'transform 0.5s ease' // 슬라이드 애니메이션
            }}
            onClick={() => handleIconClick(index)} // 클릭 시 선택된 인덱스 설정
          >
            <IconCustom path='kioskSetting' icon={icon} />
          </IconButton>
        ))}
      </Box>

      <Button
        disabled={disable}
        variant='contained'
        size='small'
        sx={{ padding: '4px 8px', minWidth: '45px' }}
        onClick={handleToggle} // 버튼 클릭 시 모드 전환
      >
        {isEditing ? '확인' : '수정'}
      </Button>
    </Box>
  )
}

export default KioskIconList
