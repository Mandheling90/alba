import { Box, Paper, Typography } from '@mui/material'
import { FC } from 'react'
import styled from 'styled-components'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import { Grid, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface ChartDetailSwiperProps {
  height?: string | number
}

const StyledSwiper = styled(Swiper)`
  --swiper-pagination-top: 0;
  --swiper-pagination-bottom: auto;
`

const ChartDetailSwiper: FC<ChartDetailSwiperProps> = ({ height = '100%' }): React.ReactElement => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8] // 더 많은 아이템

  return (
    <Box sx={{ width: '100%', height }}>
      <StyledSwiper
        modules={[Grid, Pagination]}
        grid={{
          rows: 2,
          fill: 'row'
        }}
        pagination={{
          clickable: true,
          type: 'bullets'
        }}
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
              <Typography variant='h6'>카드 {item}</Typography>
            </Paper>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Box>
  )
}

export default ChartDetailSwiper
