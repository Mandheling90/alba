import { Box, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import TypingTextAnimation from 'src/@core/components/atom/TypingTextAnimation'
import { KIOSK_STATUS, POWER_TYPE } from 'src/enum/kisokEnum'
import { KioskItem } from 'src/model/monitoring/monitoringModel'
import { useMonitoringTcpRelay } from 'src/service/kiosk/kioskService'
import { cardSxFn, IContentsTypeStyle } from '../util/kioskStyles'

interface IMonitoringContentCard {
  type: KIOSK_STATUS
  useSwitch?: boolean
  name: string
  id: number
  desc?: string
  items?: KioskItem[]
  powerType?: POWER_TYPE
  relayIp: string
  port?: number
}

const MonitoringContentCard: FC<IMonitoringContentCard> = ({
  id,
  type,
  useSwitch = false,
  name,
  desc,
  items = [],
  powerType = POWER_TYPE.OFF,
  relayIp,
  port = 0
}): React.ReactElement => {
  const [styleInfo, setStyleInfo] = useState<IContentsTypeStyle>()
  const [isLoding, setIsLoding] = useState(false)
  const isItems = items.length > 0

  useEffect(() => {
    console.log(
      `name : ${name} port : ${port} relayIp : ${relayIp} powerType : ${powerType !== POWER_TYPE.ON ? 'stop' : 'start'}`
    )

    setStyleInfo(
      cardSxFn(useSwitch && powerType === POWER_TYPE.OFF ? KIOSK_STATUS.DISABLED : desc ? type : KIOSK_STATUS.DISABLED)
    )
  }, [isItems, type, powerType])

  const { mutateAsync } = useMonitoringTcpRelay()

  const handleSwitchChange = async () => {
    setIsLoding(true)
    console.log(`req : ${powerType === POWER_TYPE.ON ? 'stop' : 'start'} port : ${port} relayIp : ${relayIp} `)
    await mutateAsync({ cmd: powerType === POWER_TYPE.ON ? 'stop' : 'start', port: port, ip: relayIp })

    setTimeout(() => {
      setIsLoding(false)
    }, 5000)
  }

  return (
    <Box
      sx={{
        ...styleInfo?.contentSx,
        position: 'relative',
        borderRadius: '7px',
        p: 3,
        mb: 4,
        paddingBottom: isItems ? '1px' : undefined
      }}
    >
      <Box mb={1}>
        {desc && (
          <Typography component='span' variant='subtitle2' fontSize={10} pb={3}>
            {desc}:{' '}
            <Typography component='span' variant='body1' fontWeight='bold' fontSize={10} sx={{ ...styleInfo?.fontSx }}>
              {styleInfo?.typeMsg}
            </Typography>
          </Typography>
        )}
      </Box>

      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        {isItems ? (
          <Typography component='span' variant='body1' fontSize={11} fontWeight='bold'>
            {name}
          </Typography>
        ) : (
          <Typography variant='body1' fontWeight='bold' fontSize={15}>
            {name}
          </Typography>
        )}

        {useSwitch && (
          <SwitchCustom
            width={70}
            switchName={['OFF', 'ON']}
            activeColor={['rgba(112, 111, 111, 1)', 'rgba(255, 14, 14, 1)']}
            selected={!(powerType === POWER_TYPE.ON)}
            superSelected={false}
            onChange={handleSwitchChange}
          />
        )}
      </Box>

      <Box mt={isItems ? 3 : 0}>
        {items.map(item => (
          <MonitoringContentCard
            key={item.id}
            id={item.id}
            type={powerType === POWER_TYPE.OFF ? KIOSK_STATUS.DISABLED : item.status}
            desc={item.desc ?? undefined}
            name={item.name}
            relayIp={relayIp}
          />
        ))}
      </Box>

      {/* 로딩 상태일 때만 표시되는 오버레이 */}
      {isLoding && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '7px',
            zIndex: 1
          }}
        >
          <TypingTextAnimation text='Waiting...' interval={200} />
        </Box>
      )}
    </Box>
  )
}

export default MonitoringContentCard
