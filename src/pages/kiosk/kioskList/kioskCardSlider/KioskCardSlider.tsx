import { Box } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import Slider from 'react-slick'
import SlideHeader from 'src/@core/components/molecule/SlideHeader'
import { useKiosk } from 'src/hooks/useKiosk'
import { MKiosk, MKioskCardSlider } from 'src/model/kiosk/kioskModel'
import KioskPartList from '../KioskPartList'
import KioskPromoInfo from './KioskPromoInfo'
import SmokerCountDisplay from './SmokerCountDisplay'

interface ISlideHeader {
  kioskData: MKiosk
}

const updateOrInsert = (array: MKioskCardSlider[], newItem: MKioskCardSlider): MKioskCardSlider[] => {
  const foundIndex = array.findIndex(item => item.kioskId === newItem.kioskId)

  if (foundIndex !== -1) {
    // 이미 존재하면 업데이트
    const updatedArray = [...array]
    updatedArray[foundIndex] = newItem

    return updatedArray
  } else {
    // 존재하지 않으면 새로 삽입
    return [...array, newItem]
  }
}

// 기존 코드 생략

const KioskCardSlider: React.FC<ISlideHeader> = ({ kioskData }) => {
  const kiosk = useKiosk()
  const sliderRef = useRef<Slider | null>(null) // Slider ref

  const cardSubtitle = ['키오스크 홍보물 정보', '유동인구 및 흡연자수', '키오스크 하드웨어 정보']

  const settings = {
    dots: false,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    draggable: false,
    arrows: false,
    afterChange: (current: number) =>
      kiosk.setKioskCardSlider(updateOrInsert(kiosk.kioskCardSlider, { kioskId: kioskData.id, index: current }))
  }

  // 부모 컴포넌트의 값이 바뀔 때 슬라이더 위치를 업데이트하는 useEffect 추가
  useEffect(() => {
    const initialSlideIndex = kiosk.kioskCardSlider.find(slide => slide.kioskId === kioskData.id)?.index || 0
    sliderRef.current?.slickGoTo(initialSlideIndex)
  }, [kioskData.id])

  return (
    <Slider ref={sliderRef} {...settings}>
      {cardSubtitle.map((item, index) => (
        <Box key={`cardSubtitle-${index}`}>
          <SlideHeader
            isFirst={index === 0}
            isEnd={index === cardSubtitle.length - 1}
            onClick={isNext => {
              isNext ? sliderRef.current?.slickNext() : sliderRef.current?.slickPrev()
            }}
            title={item}
          />

          {index === 0 ? (
            <KioskPromoInfo key={index} kioskId={kioskData.id} isView={index === 0} />
          ) : index === 1 ? (
            <SmokerCountDisplay kioskData={kioskData} isView={index === 1} />
          ) : (
            <KioskPartList kioskData={kioskData} isView={index === 2} />
          )}
        </Box>
      ))}
    </Slider>
  )
}

export default KioskCardSlider
