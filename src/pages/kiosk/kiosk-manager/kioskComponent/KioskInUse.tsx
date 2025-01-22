import { Box, IconButton, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { pastelColors } from 'src/enum/kisokEnum'
import IconSvgSelector from 'src/layouts/components/svgCustom/IconSvgSelector'
import { IPartTypeList, MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'

interface IKioskInUse {
  data: MKioskPartTypeList
  isDetail: boolean
  partList: IPartTypeList
  readOnly: boolean
  setPartList: (partList: IPartTypeList, selectIndex: number) => void
}

const KioskInUse: FC<IKioskInUse> = ({ data, isDetail, partList, readOnly, setPartList }) => {
  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(readOnly ? data.partList.length : 0)

  useEffect(() => {
    if (readOnly) {
      setSelectedIconIndex(data.partList.length)
    }
  }, [data])

  // 각 아이콘의 색상을 결정하기 위한 배열 생성
  // const iconColorMap: Record<string, number> = {} // 각 아이콘의 중복 개수를 저장할 객체
  // const iconColors: string[] = icons.map(icon => {
  //   const currentCount = (iconColorMap[icon] || 0) + 1 // 현재 아이콘의 중복 개수 증가
  //   iconColorMap[icon] = currentCount // 중복 개수 저장

  //   // 중복 아이콘의 색상 결정
  //   return pastelColors[Math.min(currentCount - 1, pastelColors.length - 1)] // 색상 인덱스 설정
  // })

  return (
    <Box
      sx={{
        mb: 3,
        display: isDetail ? 'none' : 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Typography variant='body2'>{` 총 ${partList?.inUse ?? 0}개 키오스크에 사용중`}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {data?.partList?.map((item, index) => {
          return (
            <IconButton
              key={index}
              sx={{
                p: 0,
                ml: index === 0 ? 0 : -4,
                width: '45px',
                zIndex: selectedIconIndex !== null ? 10 - Math.abs(selectedIconIndex - index) : 1,
                position: 'relative',
                transition: 'z-index 0.3s ease'
              }}
              onClick={() => {
                if (!readOnly) {
                  setPartList(item, index)
                  setSelectedIconIndex(index)
                }
              }}
            >
              <IconSvgSelector
                name={data.iconFileName}
                fillColor={pastelColors[index]} // 선택된 아이콘 색상 설정
                selected={selectedIconIndex === index}
              />
            </IconButton>
          )
        })}

        <Box
          sx={{
            ml: -3,
            width: '40px',
            height: '40px',
            background: 'rgba(238, 238, 238, 1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant='body2'>+{partList?.inUse}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default KioskInUse
