import { FC, useEffect, useState } from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Typography } from '@mui/material'
import { useKioskManager } from 'src/hooks/useKioskManager'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'
import KioskComponentBody from './KioskComponentBody'

interface IRoleAddModal {
  isOpen: boolean
  kioskPartTypeList: MKioskPartTypeList[]
  onClose: () => void
  refetch: () => void
}

const KioskComponentModal: FC<IRoleAddModal> = ({ isOpen, kioskPartTypeList, onClose, refetch }) => {
  const kioskManager = useKioskManager()
  const [isMod, setIsMod] = useState(false)
  const [isEditName, setIsEditName] = useState(false)

  useEffect(() => {
    const selectIndex = kioskManager.selectKioskPartTypeList.selectIndex ?? -1
    setIsMod(selectIndex > -1)
  }, [isOpen])

  return (
    <Dialog
      fullWidth
      maxWidth={isMod ? 'sm' : 'lg'}
      scroll='body'
      onClose={() => {
        onClose()
      }}
      open={isOpen}
    >
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box display={'flex'} alignItems={'center'}>
            {isEditName ? (
              <TextField
                size='small'
                value={kioskManager.kioskPartTypeReq.name}
                placeholder='구성품그룹명 입력'
                name='name'
                onChange={e => {
                  kioskManager.setKioskPartTypeReq({
                    ...kioskManager.kioskPartTypeReq,
                    name: e.target.value
                  })
                }}
              />
            ) : (
              <Typography variant='h5' fontWeight={700} mr={3}>
                {isMod ? kioskManager.kioskPartTypeReq.name : '키오스크 하드웨어 구성품 추가'}
              </Typography>
            )}
            {isMod && (
              <IconButton
                sx={{ display: 'inline-block' }}
                onClick={() => {
                  setIsEditName(!isEditName)
                }}
              >
                <IconCustom isCommon icon={'Edit'} />
              </IconButton>
            )}
          </Box>

          <IconButton onClick={() => onClose()}>
            <IconCustom icon='modalClose' isCommon />
          </IconButton>
        </Box>
        <KioskComponentBody kioskPartTypeList={kioskPartTypeList} isMod={isMod} />
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box className='demo-space-x'>
          <Button
            size='large'
            type='submit'
            variant='contained'
            onClick={async e => {
              if (!isMod) {
                await kioskManager.kioskPartTypeInsertFn(kioskManager.kioskPartTypeReq, errorCallback => {
                  alert(errorCallback.message)
                })
              } else {
                const selectData = kioskPartTypeList.find(item => item.id === kioskManager.selectKioskPartTypeList.id)
                if (selectData) {
                  await kioskManager.kioskPartTypeUpdateFn(kioskManager.kioskPartTypeReq, selectData, errorCallback => {
                    alert(errorCallback.message)
                  })
                }
              }
              refetch()
              onClose()
            }}
          >
            {`${isMod ? '수정' : '저장'}`}
          </Button>
          <Button
            size='large'
            color='secondary'
            variant='outlined'
            onClick={() => {
              onClose()
            }}
          >
            취소
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default KioskComponentModal
