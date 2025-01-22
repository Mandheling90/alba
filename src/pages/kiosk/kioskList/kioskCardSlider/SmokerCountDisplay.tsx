import { Box, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import AreaRangeLineChart from 'src/@core/components/charts/AreaRangeLineChart'
import CircleButtonComponent from 'src/@core/components/molecule/CircleButtonComponent'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKiosk } from 'src/model/kiosk/kioskModel'

interface ISmokerCountDisplay {
  kioskData: MKiosk
  isView: boolean
}

const arearangeChartConvertData = (data: any[]): [number, number, number][] => {
  return data.map(item => [item.timeStamp, item.minPeopleCount, item.maxPeopleCount])
}

const lineChartConvertData = (data: any[]): [number, number][] => {
  return data.map(item => [item.timeStamp, item.smokerCount])
}

const SmokerCountDisplay: React.FC<ISmokerCountDisplay> = ({ kioskData, isView }) => {
  const [index, setIndex] = useState(0)
  const router = useRouter()

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component='span' variant='body1' fontWeight='bold'>
          모니터링 영역 선택
        </Typography>
        <IconButton
          onClick={() => {
            router.push({
              pathname: 'kiosk/kiosk-area-setting',
              query: { ip: kioskData.ip }
            })
          }}
        >
          <IconCustom path='kiosk' icon='AnalyticSetting' />
        </IconButton>

        <CircleButtonComponent
          selectNameList={kioskData.statsList.map(item => item.areaName)}
          onClick={index => {
            setIndex(index)
          }}
        />
      </Box>

      <Box>
        {arearangeChartConvertData(kioskData.statsList[index]?.statistics ?? []).length > 0 &&
        lineChartConvertData(kioskData.statsList[index]?.statistics ?? []).length > 0 ? (
          <AreaRangeLineChart
            key={index}
            arearangeData={arearangeChartConvertData(kioskData.statsList[index]?.statistics ?? [])}
            lineData={lineChartConvertData(kioskData.statsList[index]?.statistics ?? [])}
            kioskStatus={kioskData.kioskStatus}
          />
        ) : (
          <Typography
            variant='subtitle1'
            fontWeight={600}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px' }}
          >
            No data
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default SmokerCountDisplay
