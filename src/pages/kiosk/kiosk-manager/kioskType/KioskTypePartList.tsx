import { Box, Checkbox, FormControlLabel, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { IPartList } from 'src/model/kiosk/kioskModel'

interface IKioskTypePartList {
  partList: IPartList[]
  disabled?: boolean
  size?: 'small' | 'medium'
  setPartList?: (partList: IPartList[]) => void
}

const KioskTypePartList: React.FC<IKioskTypePartList> = ({
  partList,
  disabled = false,
  size = 'medium',
  setPartList
}) => {
  // 수량 증가 및 감소 핸들러
  const handleQuantityChange = (index: number, delta: number) => {
    const updatedItems = partList
    const newQuantity = updatedItems[index].quantity + delta

    // 수량이 1보다 작아지지 않도록 설정
    if (newQuantity >= 1) {
      updatedItems[index].quantity = newQuantity
      setPartList?.(updatedItems)
    }
  }

  return (
    <Box
      sx={{
        background: 'rgba(234, 234, 234, 1)',
        height: '212px',
        maxHeight: '212px',
        overflow: 'auto',
        p: 3,
        fontSize: size === 'small' ? '12px' : '14px' // size에 따른 폰트 크기 설정
      }}
    >
      <Grid container spacing={2}>
        {partList
          .filter(item => !disabled || item.isUsed) // disabled가 false면 전체, true면 isUsed가 true인 항목만 필터링
          .map((item, index) => (
            <Grid item xs={6} key={index}>
              <Box display='flex' justifyContent='space-between' alignItems='center' ml={3} mr={3}>
                {/* 체크박스 및 이름 */}
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => {
                        // 체크박스가 변경될 때 해당 항목의 isUsed 값을 업데이트
                        const updatedItems = partList.map((el, idx) =>
                          idx === index ? { ...el, isUsed: e.target.checked } : el
                        )
                        setPartList?.(updatedItems) // 상태 업데이트
                      }}
                      checked={item.isUsed}
                      disabled={disabled}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: size === 'small' ? 18 : 24 } }} // 체크박스 크기 조정
                    />
                  }
                  label={
                    <Typography
                      color={disabled ? 'rgba(58, 53, 65, 0.26)' : 'rgba(58, 53, 65, 0.87)'}
                      noWrap
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '110px',
                        fontSize: size === 'small' ? '12px' : 'inherit' // 폰트 사이즈 조정
                      }}
                    >
                      {item.name}
                    </Typography>
                  }
                />

                {/* 수량 변경 영역 - 오른쪽으로 정렬 */}
                <Box display='flex' alignItems='center'>
                  {/* 수량이 1보다 클 때만 감소 버튼을 표시 */}
                  {item.quantity > 1 && (
                    <IconButton
                      onClick={() => handleQuantityChange(index, -1)}
                      disabled={disabled || !item.isUsed}
                      sx={{ padding: size === 'small' ? '4px' : '8px' }} // 아이콘 버튼 크기 조정
                    >
                      <IconCustom isCommon icon={disabled || !item.isUsed ? 'arrow_left_disable' : 'arrow_left'} />
                    </IconButton>
                  )}

                  {/* 숫자를 원으로 감싸는 부분 */}
                  <Box
                    sx={{
                      mx: 2,
                      width: size === 'small' ? 16 : 20, // 원의 너비
                      height: size === 'small' ? 16 : 20, // 원의 높이
                      borderRadius: '50%', // 원형 모양
                      background: disabled || !item.isUsed ? 'rgba(175, 173, 177, 1)' : 'rgba(158, 105, 253, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        color: disabled || !item.isUsed ? 'rgba(234, 234, 234, 1)' : '#fff',
                        fontSize: size === 'small' ? '10px' : 'inherit' // 폰트 크기 조정
                      }}
                    >
                      {item.quantity}
                    </Typography>
                  </Box>

                  {/* 수량 증가 버튼 */}
                  <IconButton
                    onClick={() => handleQuantityChange(index, 1)}
                    disabled={disabled || !item.isUsed}
                    sx={{ padding: size === 'small' ? '4px' : '8px' }} // 아이콘 버튼 크기 조정
                  >
                    <IconCustom isCommon icon={disabled || !item.isUsed ? 'arrow_right_disable' : 'arrow_right'} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

export default KioskTypePartList
