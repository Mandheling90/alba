import { Box, Paper } from '@mui/material'
import { FC } from 'react'
import { ICardInfo } from 'src/model/statistics/StatisticsModel'
import { calculateChangeRate } from 'src/utils/CommonUtil'
import styled from 'styled-components'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Grid, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import BoxContents from './BoxContents'

interface ChartDetailSwiperProps {
  height?: string | number
  data: ICardInfo[]
}

const StyledSwiper = styled(Swiper)`
  --swiper-pagination-top: 0;
  --swiper-pagination-bottom: auto;
  --swiper-navigation-color: #000;

  .swiper-button-prev,
  .swiper-button-next {
    width: 30px;
    height: 30px;
    top: 0;
    margin-top: 0;

    &::after {
      font-size: 15px;
    }
  }

  .swiper-pagination {
    position: absolute;
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    z-index: 1;
  }

  .swiper-button-prev {
    left: calc(50% - 60px);
  }

  .swiper-button-next {
    right: calc(50% - 60px);
  }

  .swiper-pagination-bullet {
    margin: 0 4px;
  }
`

const ChartDetailSwiper: FC<ChartDetailSwiperProps> = ({ data, height = '100%' }): React.ReactElement => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <></>
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <StyledSwiper
        modules={[Grid, Pagination, Navigation]}
        grid={{
          rows: 2,
          fill: 'row'
        }}
        pagination={{
          clickable: true,
          type: 'bullets'
        }}
        navigation={true}
        slidesPerView={2}
        slidesPerGroup={2}
        spaceBetween={8}
        style={{
          width: '100%',
          height: '100%',
          padding: '30px 4px 1px 4px',

          position: 'relative'
        }}
      >
        <Box className='swiper-pagination' />
        {data?.map((item, index) => {
          return Array.from({ length: 4 }).map((_, subIndex) => (
            <SwiperSlide
              key={`${item.currentDate}-${subIndex}`}
              style={{
                height: 'calc(50% - 4px)'
              }}
            >
              <Paper
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                <BoxContents
                  titles={
                    subIndex === 0
                      ? [item.lastDate, item.lastLabel]
                      : subIndex === 1
                      ? [item.currentDate, item.currentLabel]
                      : subIndex === 2
                      ? [item.rateLabel]
                      : [item.weatherDate, item.weatherLabel]
                  }
                  centerText={
                    subIndex === 0
                      ? item.lastCount.toLocaleString()
                      : subIndex === 1
                      ? item.currentCount.toLocaleString()
                      : subIndex === 2
                      ? `${calculateChangeRate(item.currentCount, item.lastCount)}`
                      : ''
                  }
                  bottomTexts={
                    subIndex === 3
                      ? [`오전 : ${item.morningLabel ?? ''}`, `오후 : ${item.afternoonLabel ?? ''}`, item.dustValue]
                      : []
                  }
                  color={index % 2 === 0 ? '#38A3FA' : '#544FC5'}
                  onClick={val => {
                    console.log(val)
                    console.log('clicked')
                  }}
                />
              </Paper>
            </SwiperSlide>
          ))
        })}
      </StyledSwiper>
    </Box>
  )
}

export default ChartDetailSwiper
