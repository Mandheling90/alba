import { Box, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FC, useEffect, useRef, useState } from 'react'
import AutocompleteSearch from 'src/@core/components/molecule/AutocompleteSearch'
import { useKiosk } from 'src/hooks/useKiosk'
import IconCustom from 'src/layouts/components/IconCustom'
import styled from 'styled-components'

import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { excludeId } from 'src/utils/CommonUtil'
import KioskButtonList from './KioskButtonList'

interface IKioskMenu {
  refetch: () => void
}

const KioskMenu: FC<IKioskMenu> = ({ refetch }) => {
  const theme = useTheme()
  const kiosk = useKiosk()
  const { sort } = kiosk.kioskSort

  const [labelArray, setLabelArray] = useState(
    kiosk.initialKioskList.map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
  )

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
            if (kiosk.kioskViewType === 'card') {
              kiosk.setKioskSort({ field: 'name', sort: sort === 'asc' ? 'desc' : 'asc' })
            }
            kiosk.setKioskViewType('card')
          }}
        >
          {sort ? (
            kiosk.kioskViewType === 'card' ? (
              <IconCustom
                path='monitoring'
                icon={sort === 'asc' ? 'PropertyAscending' : 'PropertyDescending'}
                style={{ width: '30px' }}
              />
            ) : (
              <IconCustom
                path='monitoring'
                icon={sort === 'asc' ? 'PropertyAscendingDis' : 'PropertyDescendingDis'}
                style={{ width: '30px' }}
              />
            )
          ) : (
            <IconCustom
              path='kiosk'
              icon={kiosk.kioskViewType === 'card' ? 'card-mode-on' : 'card-mode-off'}
              style={{ width: '30px' }}
            />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
            kiosk.setKioskViewType('list')
          }}
        >
          <IconCustom
            path='kiosk'
            icon={kiosk.kioskViewType === 'list' ? 'list-mode-on' : 'list-mode-off'}
            style={{ width: '30px' }}
          />
        </IconButton>
      </Box>

      <Select
        sx={{ background: theme.palette.background.paper, mr: 2, minWidth: '185px', height: '40px' }}
        value={String(kiosk.kioskListReq.status ?? KIOSK_STATUS.ALL)}
        size='small'
        onChange={(event: SelectChangeEvent) => {
          handleClear()
          kiosk.setKioskListReq(
            excludeId(
              excludeId(excludeId({ ...kiosk.kioskListReq, status: Number(event.target.value) }, 'keyword'), 'id'),
              'status',
              KIOSK_STATUS.ALL
            )
          )
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

      <AutocompleteSearch
        ref={autocompleteRef}
        label={'키오스크명, 위치'}
        minWidth='300px'
        data={labelArray}
        isTextSearch
        defultValue={kiosk.kioskListReq.keyword}
        onChange={value => {
          if (value) {
            if (typeof value === 'string') {
              kiosk.setKioskListReq(excludeId({ ...kiosk.kioskListReq, keyword: value }, 'id'))
            } else {
              const target = value.label.split(',')[0]
              kiosk.setKioskListReq(excludeId({ ...kiosk.kioskListReq, keyword: target }, 'id'))

              // kiosk.setKioskListReq(excludeId({ ...kiosk.kioskListReq, id: value.id }, 'keyword'))
            }
          } else {
            kiosk.setKioskListReq(excludeId(excludeId({ ...kiosk.kioskListReq }, 'id'), 'keyword'))
          }
        }}
      />

      <Box sx={{ marginLeft: 'auto' }}>
        <KioskButtonList refetch={refetch} />
      </Box>
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

export default KioskMenu
