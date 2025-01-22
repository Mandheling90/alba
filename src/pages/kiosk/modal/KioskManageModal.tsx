import { FC, useEffect, useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useKiosk } from 'src/hooks/useKiosk'
import { IPartList, MKioskUpdateReq } from 'src/model/kiosk/kioskModel'
import { useKioskTypeList } from 'src/service/kiosk/kioskService'
import KioskTypePartList from '../kiosk-manager/kioskType/KioskTypePartList'

interface IKioskManageModal {
  isOpen: boolean
  onClose: () => void
  refetch?: () => void
}

const KioskManageModal: FC<IKioskManageModal> = ({ isOpen, onClose, refetch }) => {
  const theme = useTheme()
  const kiosk = useKiosk()

  const [kioskReqData, setKioskReqData] = useState<Partial<MKioskUpdateReq>>({})

  const { data } = useKioskTypeList()

  const [status, setStatus] = useState(false)

  useEffect(() => {
    const isNonEmptyObject = kiosk.selectedKioskInfo && Object.keys(kiosk.selectedKioskInfo).length > 0
    setStatus(isNonEmptyObject)
  }, [kiosk.selectedKioskInfo])

  useEffect(() => {
    setKioskReqData({
      id: kiosk.selectedKioskInfo.id,
      name: kiosk.selectedKioskInfo.name,
      location: kiosk.selectedKioskInfo.location,
      kioskTypeId: kiosk.selectedKioskInfo.kioskType?.typeId,
      ip: kiosk.selectedKioskInfo.ip,
      relayIp: kiosk.selectedKioskInfo.relayIp
    })
  }, [kiosk.selectedKioskInfo])

  const handleChange = (e: any) => {
    setKioskReqData({
      ...kioskReqData,
      [e.target.name]: e.target.value
    })
  }

  // 구성품 세팅
  const [partList, setPartList] = useState<IPartList[]>([])

  useEffect(() => {
    const selectedItem = data?.data?.find(item => item.id === Number(kioskReqData.kioskTypeId))
    setPartList(selectedItem?.partList ?? [])

    // if (kiosk.selectedKioskInfo.kioskType?.typeId === kioskReqData.kioskTypeId) {
    //   setPartList(kiosk.selectedKioskInfo.kioskPartList ?? [])
    // } else if (kioskReqData.kioskTypeId) {
    //   const selectedItem = data?.data?.find(item => item.id === Number(kioskReqData.kioskTypeId))
    //   setPartList(selectedItem?.partList ?? [])
    // }
  }, [kioskReqData.kioskTypeId])

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      scroll='body'
      onClose={() => {
        onClose()
      }}
      open={isOpen}
    >
      <DialogTitle
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Typography variant='h5' component='span'>
          {status ? '키오스크 수정' : '키오스크 추가'}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(5)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <Grid container spacing={6} alignItems='center' sx={{ pt: 3 }}>
          <Grid item xs={3}>
            <Typography variant='body1' component='span'>
              키오스크명
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size='small'
              value={kioskReqData?.name ?? ''}
              label='키오스크명 입력'
              placeholder='키오스크명 입력'
              sx={{ width: '100%' }}
              name='name'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant='body1' component='span'>
              키오스크 위치
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size='small'
              value={kioskReqData?.location ?? ''}
              label='키오스크 위치 입력'
              placeholder='키오스크 위치 입력'
              sx={{ width: '100%' }}
              name='location'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant='body1' component='span'>
              키오스크 타입
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Select
              name='kioskTypeId'
              sx={{ background: theme.palette.background.paper, minWidth: '185px' }}
              value={String(kioskReqData?.kioskTypeId) ?? ''}
              size='small'
              displayEmpty
              renderValue={value => {
                if (value === '') {
                  return '타입선택'
                }
                const selectedItem = data?.data?.find(item => item.id === Number(value))

                return selectedItem ? selectedItem.name : '타입선택'
              }}
              onChange={handleChange}
            >
              {data?.data?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.name}
                </MenuItem>
              )) ?? []}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='body1' component='span'>
              구성품
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <KioskTypePartList partList={partList} disabled={true} size='small' />
            {/* <TextField
              placeholder='구성품 입력' // 라벨 대신 placeholder 사용
              multiline
              rows={7}
              variant='outlined' // 테두리 스타일 유지
              sx={{ width: '100%', mt: -3 }}
            /> */}
          </Grid>

          <Grid item xs={3}>
            <Typography variant='body1' component='span'>
              관리 PC IP
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size='small'
              value={kioskReqData?.ip ?? ''}
              label='관리 PC IP'
              placeholder='관리 PC IP 입력'
              sx={{ width: '100%' }}
              name='ip'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant='body1' component='span'>
              전원관리장치 IP
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size='small'
              value={kioskReqData?.relayIp ?? ''}
              label='전원관리장치 IP'
              placeholder='전원관리장치 IP 입력'
              sx={{ width: '100%' }}
              name='relayIp'
              onChange={handleChange}
            />
          </Grid>
        </Grid>
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
              await kiosk.kioskUpsert(kioskReqData, !status, errorCallback => {
                alert(errorCallback.message)
              })
              refetch?.()
              onClose()
            }}
          >
            저장
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

export default KioskManageModal
