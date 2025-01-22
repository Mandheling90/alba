// ** MUI Imports
import { Box, IconButton } from '@mui/material'
import { FC, useRef, useState } from 'react'
import Slider from 'react-slick'
import SlideContents from 'src/@core/components/molecule/SlideContents'
import { useKioskManager } from 'src/hooks/useKioskManager'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'

interface IKioskSlider {
  kioskPartTypeList: MKioskPartTypeList[]
  onClick?: () => void
}

const KioskSlider: FC<IKioskSlider> = ({ kioskPartTypeList, onClick }) => {
  const kioskManager = useKioskManager()
  const selectKioskPartTypeList = kioskManager.selectKioskPartTypeList

  const selectedItem = kioskPartTypeList.find(item => item.id === kioskManager.kioskPartTypeReq.id)
  const cardSubtitle = selectedItem?.partList.map(item => item.name) ?? []

  const [currentSlide, setCurrentSlide] = useState(selectKioskPartTypeList.selectIndex ?? 0) // 현재 슬라이드 상태 관리
  const sliderRef = useRef<Slider | null>(null) // Slider ref

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    draggable: false,
    arrows: false,
    initialSlide: currentSlide,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex) // 슬라이드 인덱스 추적
      kioskManager.setSelectKioskPartTypeList({ ...selectKioskPartTypeList, selectIndex: newIndex })
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* 왼쪽 버튼 */}
      <IconButton
        onClick={() => {
          sliderRef.current?.slickPrev()
        }}
        sx={{ visibility: currentSlide > 0 ? 'visible' : 'hidden' }} // 버튼을 숨기지만 공간은 유지
      >
        <IconCustom isCommon icon='arrow_left2' />
      </IconButton>

      {/* 슬라이더 영역 */}
      <Box sx={{ width: '300px', mx: 2 }}>
        {' '}
        {/* mx로 좌우 마진을 추가하여 버튼과 슬라이드 사이 간격을 유지 */}
        <Slider ref={sliderRef} {...settings}>
          {cardSubtitle.map((item, index) => (
            <SlideContents
              key={index}
              isFirst={index === 0}
              isEnd={index === cardSubtitle.length - 1}
              onClick={isNext => {
                isNext ? sliderRef.current?.slickNext() : sliderRef.current?.slickPrev()
              }}
              title={item}
            />
          ))}
        </Slider>
      </Box>

      {/* 오른쪽 버튼 */}
      <IconButton
        onClick={() => {
          sliderRef.current?.slickNext()
        }}
        sx={{ visibility: currentSlide < cardSubtitle.length - 1 ? 'visible' : 'hidden' }} // 버튼을 숨기지만 공간은 유지
      >
        <IconCustom isCommon icon='arrow_right2' />
      </IconButton>
    </Box>
  )
}

export default KioskSlider
