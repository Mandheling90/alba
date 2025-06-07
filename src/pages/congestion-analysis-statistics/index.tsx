import { Button, Grid } from '@mui/material'
import { FC } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import CongestionCard from './windowCard/CongestionCard'

const CongestionAnalysisStatistics: FC = (): React.ReactElement => {
  const handleRefresh = () => {
    console.log('새로고침')
  }

  const handleDelete = () => {
    console.log('삭제')
  }

  return (
    <StandardTemplate title={'아난티 레스토랑 좌석 점유률 현황'}>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <Button variant='contained' color='primary'>
            시설 추가
          </Button>
          <Button variant='contained' color='primary'>
            상태 설정
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <CongestionCard
            title='시설 A'
            maxCapacity={10}
            currentOccupancy={110}
            occupancyRate={111}
            onRefresh={handleRefresh}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default CongestionAnalysisStatistics
