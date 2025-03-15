import { Box, Paper } from '@mui/material'
import { FC } from 'react'
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

const ChartDetailSwiper: FC<ChartDetailSwiperProps> = ({ height = '100%' }): React.ReactElement => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8] // 더 많은 아이템

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
        {items.map(item => (
          <SwiperSlide
            key={item}
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
                justifyContent: 'center'
              }}
            >
              <BoxContents
                titles={['카드 1', '카드 2']}
                centerText={`카드 ${item}`}
                bottomTexts={['오전 : 눈 많이', '오후 : 구름 많이', '111111']}
                color={item % 2 === 0 ? '#38A3FA' : '#544FC5'}
                onClick={val => {
                  console.log(val)
                  console.log('clicked')
                }}
              />
            </Paper>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Box>
  )
}

export default ChartDetailSwiper
