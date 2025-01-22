// ** MUI Imports
import { Box } from '@mui/material'
import { FC, useState } from 'react'
import { timeRangeOptions } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'

interface IZoomOption {
  onChange: (index: number) => void
}

const ZoomOption: FC<IZoomOption> = ({ onChange }): React.ReactElement => {
  const statistics = useStatistics()

  const [selected, setSelected] = useState(
    !statistics.groupSetting
      ? 0 // 디폴트는 0, 이전 화면 유지해야 할 시 이전 값 세팅
      : statistics.chartProps.time === 'hour'
      ? 0
      : statistics.chartProps.time === 'day'
      ? 1
      : 2
  )

  const handleSelect = (index: number) => {
    setSelected(index)
    onChange(index)
  }

  const days = timeRangeOptions

  return (
    <Box>
      <div style={{ display: 'flex', gap: '3px' }}>
        {days.map((day, index) => (
          <Box
            key={index}
            sx={{
              padding: '0px 10px',
              cursor: 'pointer',
              backgroundColor: selected === index ? 'rgba(158, 105, 253, 1)' : 'rgba(242, 235, 255, 1)',
              color: selected === index ? '#fff' : 'rgba(170, 122, 255, 1)',
              borderRadius: '5px'
            }}
            onClick={() => handleSelect(index)}
          >
            {day.text}
          </Box>
        ))}
      </div>
    </Box>
  )
}
export default ZoomOption
