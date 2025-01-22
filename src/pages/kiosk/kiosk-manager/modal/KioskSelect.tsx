// ** MUI Imports
import { MenuItem, Select, TextField, useTheme } from '@mui/material'
import { FC } from 'react'
import { useKioskManager } from 'src/hooks/useKioskManager'
import { MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'

interface IKioskSelect {
  kioskPartTypeList: MKioskPartTypeList[]
  isMod: boolean
}

const KioskSelect: FC<IKioskSelect> = ({ kioskPartTypeList, isMod }) => {
  const theme = useTheme()
  const kioskManager = useKioskManager()

  return (
    <>
      <Select
        name='name'
        sx={{ background: theme.palette.background.paper, minWidth: '185px' }}
        value={String(kioskManager.kioskPartTypeReq.id)}
        size='small'
        displayEmpty
        renderValue={value => {
          if (Number(value) === 0) {
            return isMod ? '구성품명 수정' : '신규생성'
          } else if (value === '') {
            return '구성품명 선택'
          }

          const selectedItem = kioskPartTypeList.find(item => item.id === kioskManager.kioskPartTypeReq.id)

          return selectedItem ? selectedItem.name : '구성품명 선택'
        }}
        onChange={e => {
          const isNew = Number(e.target.value) === 0

          kioskManager.setKioskPartTypeReq({
            ...kioskManager.kioskPartTypeReq,
            id: Number(e.target.value),
            name: isNew ? '' : kioskPartTypeList.find(item => item.id === Number(e.target.value))?.name ?? '',
            iconFileName: kioskPartTypeList.find(item => item.id === Number(e.target.value))?.iconFileName
          })
        }}
      >
        {kioskPartTypeList?.map((item, index) => (
          <MenuItem key={index} value={item.id}>
            {item.name}
          </MenuItem>
        )) ?? []}

        <MenuItem value={0}>{isMod ? '구성품명 수정' : '신규생성'}</MenuItem>
      </Select>

      {kioskManager.kioskPartTypeReq.id === 0 && (
        <TextField
          sx={{ ml: 3 }}
          size='small'
          value={kioskManager.kioskPartTypeReq.name}
          label='구성품명 입력'
          placeholder='구성품명 입력'
          name='name'
          onChange={e => {
            kioskManager.setKioskPartTypeReq({ ...kioskManager.kioskPartTypeReq, name: e.target.value })
          }}
        />
      )}
    </>
  )
}

export default KioskSelect
