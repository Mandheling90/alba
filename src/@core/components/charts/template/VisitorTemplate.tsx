import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { FC, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import BarStackedChart from 'src/@core/components/charts/BarStackedChart'
import HorizontalBarChartLocation from 'src/@core/components/charts/HorizontalBarChartLocation'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { ETableDisplayType, ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { useStatistics } from 'src/hooks/useStatistics'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICountBarChart, ICountBarPieChart, ITableData } from 'src/model/statistics/StatisticsModel'
import DashboardMenu from 'src/pages/dashboard/menu/DashboardMenu'
import { exportToExcel } from 'src/utils/CommonUtil'
import VisitorDepthTable from '../../table/depthTable/VisitorDepthTable'
import PieChart from '../PieChart'

const VisitorTemplate: FC<{
  statisticsReq: IStatisticsContextReq
  refetch: (req?: IStatisticsContextReq) => void
  barChartData?: ICountBarChart
  barPieChartData?: ICountBarPieChart
  tableData?: ITableData
}> = ({ statisticsReq, refetch, barChartData, barPieChartData, tableData }): React.ReactElement => {
  const [tableDisplayType, setTableDisplayType] = useState<ETableDisplayType>(
    statisticsReq.tableDisplayType ?? ETableDisplayType.TIME_PLACE
  )
  const { statisticsReqUpdate } = useStatistics()

  return (
    <StandardTemplate title={'방문자수 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item sm={12} xs={12}>
          <Box sx={{ mb: 3 }}>
            <DashboardMenu statisticsReq={statisticsReq} refetch={refetch} />
          </Box>
          <DividerBar />
        </Grid>

        {barChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
                title={[barChartData.chartTitle, barChartData.chartSubTitle, `총 ${barChartData?.totalPlaceCount} 곳`]}
              />
            </Grid>

            <Grid item xs={12}>
              <Card>
                <BarStackedChart data={barChartData} />
              </Card>
            </Grid>
          </>
        )}

        {barPieChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
                title={[
                  barPieChartData.chartTitle,
                  barPieChartData.chartSubTitle,
                  `총 ${barPieChartData?.totalPlaceCount} 곳`
                ]}
              />
            </Grid>
            <Grid item xs={9}>
              <Card>{barPieChartData && <HorizontalBarChartLocation data={barPieChartData.barChart} />}</Card>
            </Grid>
            <Grid item xs={3}>
              <Card> {barPieChartData && <PieChart data={barPieChartData.pieChart} />} </Card>
            </Grid>
          </>
        )}

        {tableData && (
          <>
            <Grid item xs={12}>
              <HorizontalScrollBox>
                <Box sx={{ minWidth: 'fit-content' }}>
                  <PipelineTitle
                    Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
                    title={[tableData.chartTitle, tableData.chartSubTitle, `총 ${tableData?.totalPlaceCount} 곳`]}
                  />
                </Box>

                <Box sx={{ minWidth: 'fit-content', mx: 'auto' }}>
                  <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
                    전체 입장객 수
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        border: '1px solid rgba(58, 53, 65, 0.87)',
                        borderRadius: '5px',
                        padding: '2px'
                      }}
                    >
                      {tableData?.totalInCount.toLocaleString()}
                    </Typography>
                    명
                    {(tableData?.tableHeaders as string[])?.includes('퇴장객') && (
                      <>
                        {' '}
                        | 전체 퇴장객 수
                        <Typography
                          component='span'
                          sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            border: '1px solid rgba(58, 53, 65, 0.87)',
                            borderRadius: '5px',
                            padding: '2px'
                          }}
                        >
                          {tableData?.totalOutCount.toLocaleString()}
                        </Typography>
                        명
                      </>
                    )}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 'fit-content' }}>
                  <Box display='flex' gap={2}>
                    {statisticsReq.tableType !== ETableType.WEEKDAY &&
                      statisticsReq.tableType !== ETableType.WEEKLY && (
                        <>
                          <Button
                            variant={tableDisplayType === ETableDisplayType.TIME ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => {
                              setTableDisplayType(ETableDisplayType.TIME)
                              statisticsReqUpdate({
                                ...statisticsReq,
                                tableDisplayType: ETableDisplayType.TIME
                              })
                            }}
                            sx={{ width: '120px' }}
                          >
                            {statisticsReq.tableType === ETableType.HOURLY
                              ? '시간대별'
                              : statisticsReq.tableType === ETableType.DAILY
                              ? '일별'
                              : '월별'}
                          </Button>
                          <Button
                            variant={tableDisplayType === 'timePlace' ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => {
                              setTableDisplayType(ETableDisplayType.TIME_PLACE)
                              statisticsReqUpdate({
                                ...statisticsReq,
                                tableDisplayType: ETableDisplayType.TIME_PLACE
                              })
                            }}
                            sx={{ width: '120px' }}
                          >
                            {statisticsReq.tableType === ETableType.HOURLY
                              ? '시간대 및 장소별'
                              : statisticsReq.tableType === ETableType.DAILY
                              ? '일별 및 장소별'
                              : '월별 및 장소별'}
                          </Button>
                        </>
                      )}

                    <Button
                      startIcon={<IconCustom isCommon icon='downLoad2' />}
                      variant='outlined'
                      color='primary'
                      onClick={() => {
                        if (tableData) {
                          const fileName = `방문자수_통계_${tableData.startYear}${tableData.startMonth}${tableData.startDay}`
                          exportToExcel(tableData.dataList, fileName)
                        }
                      }}
                    >
                      다운로드
                    </Button>
                  </Box>
                </Box>
              </HorizontalScrollBox>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <VisitorDepthTable
                  tableDisplayType={tableDisplayType}
                  tableType={statisticsReq.tableType ?? ETableType.HOURLY}
                  data={tableData}
                />
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorTemplate
