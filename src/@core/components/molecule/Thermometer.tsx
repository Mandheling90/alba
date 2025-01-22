import { Typography } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface IMenuBar {
  temperature: number
}

const Thermometer: FC<IMenuBar> = ({ temperature }): React.ReactElement => {
  return (
    <>
      <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, gap: 2 }}>
        <IconCustom path='kiosk' icon='ThermometerPurple' style={{ width: '14px' }} />
        {temperature}˚C
      </Typography>
    </>
  )
}

export default Thermometer
