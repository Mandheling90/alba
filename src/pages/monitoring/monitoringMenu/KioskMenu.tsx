import { Box, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FC, useEffect, useRef, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import styled from 'styled-components'

import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useKiosk } from 'src/hooks/useKiosk'
import { useMonitoring } from 'src/hooks/useMonitoring'

interface IMonitoringMenu {
  refetch?: () => void
}

const MonitoringMenu: FC<IMonitoringMenu> = ({ refetch }) => {
  const theme = useTheme()
  const monitoring = useMonitoring()
  const kiosk = useKiosk()

  const [labelArray, setLabelArray] = useState(
    kiosk.initialKioskList.map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
  )

  const [text, setText] = useState('')

  useEffect(() => {
    if (typeof kiosk.kioskListReq.status === 'number') {
      setLabelArray(
        kiosk.initialKioskList
          .filter(list => list.kioskStatus === kiosk.kioskListReq.status)
          .map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
      )
    }
  }, [kiosk.kioskListReq.status, kiosk.initialKioskList])

  const autocompleteRef = useRef<any>(null)

  const handleClear = () => {
    // 자식 컴포넌트의 clearInput 함수를 호출
    autocompleteRef.current?.clearInput()
  }

  return (
    <KioskMenuList>
      <Box sx={{ mr: 10 }}>
        <IconButton
          onClick={() => {
            monitoring.setMonitoringFilter({
              ...monitoring.monitoringFilter,
              sort: monitoring.monitoringFilter.sort === 'asc' ? 'desc' : 'asc'
            })
          }}
        >
          <IconCustom
            path='monitoring'
            icon={monitoring.monitoringFilter.sort === 'asc' ? 'PropertyAscending' : 'PropertyDescending'}
            style={{ width: '30px' }}
          />
        </IconButton>
      </Box>

      <Select
        sx={{ background: theme.palette.background.paper, mr: 2, minWidth: '185px', height: '40px' }}
        value={String(monitoring.monitoringFilter.status ?? KIOSK_STATUS.ALL)}
        size='small'
        onChange={(event: SelectChangeEvent) => {
          monitoring.setMonitoringFilter({
            ...monitoring.monitoringFilter,
            status: Number(event.target.value)
          })
        }}
      >
        <MenuItem key={1} value={KIOSK_STATUS.ALL}>
          전체
        </MenuItem>
        <MenuItem key={2} value={KIOSK_STATUS.ENABLED}>
          동작중
        </MenuItem>
        <MenuItem key={3} value={KIOSK_STATUS.DISABLED}>
          동작중지
        </MenuItem>
        <MenuItem key={4} value={KIOSK_STATUS.ERROR}>
          동작오류
        </MenuItem>
      </Select>

      <TextField
        size='small'
        value={text}
        onChange={e => {
          setText(e.target.value)
        }}
        label={'키오스크명'}
        sx={{ minWidth: '300px', background: '#fff' }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            monitoring.setMonitoringFilter({
              ...monitoring.monitoringFilter,
              keyWord: (e.target as HTMLInputElement).value
            })
          }
        }}
      />
    </KioskMenuList>
  )
}

const KioskMenuList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%; /* 전체 너비를 차지하도록 설정 */
`

export default MonitoringMenu
