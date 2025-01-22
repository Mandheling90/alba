// ** MUI Imports
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Input, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FC, useEffect, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKioskType } from 'src/model/kiosk/kioskModel'
import { useKioskTypeListDelete, useKioskTypeListInsert, useKioskTypeListUpdate } from 'src/service/kiosk/kioskService'
import KioskTypePartList from '../kiosk-manager/kioskType/KioskTypePartList'

interface IKioskCard {
  kioskTypeData: MKioskType
  isAddMod?: boolean
  refetch: () => void
  onDelete?: () => void
}

const KioskCard: FC<IKioskCard> = ({ kioskTypeData, isAddMod = false, refetch, onDelete }): React.ReactElement => {
  const { mutateAsync: kioskTypeUpdate } = useKioskTypeListUpdate()
  const { mutateAsync: kioskTypeInsert } = useKioskTypeListInsert()
  const { mutateAsync: kioskTypeDelete } = useKioskTypeListDelete()

  const [isEditMod, setIsEditMod] = useState(false)
  const [kioskTypeDataState, setKioskTypeDataState] = useState<MKioskType>(kioskTypeData)

  useEffect(() => {
    isAddMod && setIsEditMod(true)
  }, [isAddMod])

  useEffect(() => {
    setKioskTypeDataState(kioskTypeData)
  }, [kioskTypeData])

  if (!kioskTypeDataState) {
    return <></>
  }

  return (
    <Card sx={{ width: '620px', height: '487px' }}>
      <CardHeader
        sx={{
          pb: 1,
          pt: 1,
          borderBottom: '1px solid #fff',
          background: 'rgba(249, 250, 252, 1)'
        }}
        title={
          <>
            {isEditMod || isAddMod ? (
              <Input
                placeholder='키오스크 타입명 입력'
                value={kioskTypeDataState.name}
                sx={{ fontSize: '1.4993rem', fontWeight: 700 }}
                onChange={e => {
                  setKioskTypeDataState({ ...kioskTypeDataState, name: e.target.value })
                }}
              />
            ) : (
              <Typography
                variant='h5'
                fontWeight={700}
                noWrap
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {kioskTypeDataState.name}
              </Typography>
            )}
          </>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
            <IconButton
              sx={{ display: 'inline-block' }}
              onClick={() => {
                setIsEditMod(true)
              }}
            >
              <IconCustom isCommon icon={isEditMod ? 'Edit' : 'EditDisable'} />
            </IconButton>
            <IconButton
              sx={{ display: 'inline-block' }}
              onClick={async () => {
                const result = window.confirm('정말 삭제하시겠습니까?')

                if (result) {
                  if (kioskTypeData.partList.filter(item => item.isUsed).length !== 0) {
                    alert('모든 구성품을 삭제 한 후 삭제해주세요')

                    return
                  }

                  if (kioskTypeData.kioskCount > 0) {
                    alert('해당 타입을 사용중인 키오스크를 전부 삭제 한 후 삭제해주세요')

                    return
                  }

                  if (kioskTypeData.id > 0 && kioskTypeData.partList.filter(item => item.isUsed).length === 0) {
                    await kioskTypeDelete({ id: kioskTypeData.id })
                    refetch()
                  }

                  if (isAddMod) {
                    onDelete?.()
                  }
                }
              }}
            >
              <IconCustom
                isCommon
                icon={
                  kioskTypeData.partList.filter(item => item.isUsed).length === 0
                    ? 'DeleteOutline'
                    : 'DeleteOutlineDisable'
                }
              />
            </IconButton>
          </Box>
        }
      />

      <CardContent>
        <CardContentWrapper>
          <Grid container gap={7}>
            <Grid item xs={12}>
              <Typography component='span' variant='body1' fontWeight={500}>
                {isAddMod ? (
                  <span style={{ visibility: 'hidden' }}>temp</span>
                ) : (
                  <>
                    총{' '}
                    <Typography component='span' variant='body1' fontWeight={700} color='primary'>
                      {kioskTypeData.kioskCount}
                    </Typography>
                    개의 키오스크가{' '}
                    <Typography component='span' variant='body1' fontWeight={700} color='primary'>
                      {kioskTypeData.name}
                    </Typography>{' '}
                    타입으로 등록되어 있습니다.
                  </>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component='span' variant='body1' fontWeight={500}>
                구성품
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <KioskTypePartList
                partList={kioskTypeDataState.partList}
                setPartList={partList => {
                  setKioskTypeDataState({ ...kioskTypeDataState, partList: partList })
                }}
                disabled={!isEditMod}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                disabled={!isEditMod}
                variant={isEditMod ? 'contained' : 'outlined'}
                sx={{ mr: 2 }}
                onClick={async () => {
                  if (isAddMod) {
                    const filteredPartList = kioskTypeDataState.partList
                      .filter(item => item.isUsed) // isUsed가 true인 항목만 필터링
                      .map(({ isUsed, name, ...rest }) => rest) // isUsed 속성을 제거

                    await kioskTypeInsert({
                      name: kioskTypeDataState.name,
                      partList: filteredPartList
                    })
                  } else {
                    const filteredPartList = kioskTypeDataState.partList
                      .filter(item => item.isUsed) // isUsed가 true인 항목만 필터링
                      .map(({ isUsed, ...rest }) => rest) // isUsed 속성을 제거

                    await kioskTypeUpdate({
                      id: kioskTypeDataState.id,
                      name: kioskTypeDataState.name,
                      partList: filteredPartList
                    })

                    setIsEditMod(false)
                  }

                  refetch()
                }}
              >
                저장
              </Button>
              <Button
                disabled={!isEditMod}
                variant={'outlined'}
                onClick={() => {
                  if (isAddMod) {
                    onDelete?.()
                  } else {
                    setIsEditMod(false)
                    setKioskTypeDataState(kioskTypeData)
                  }
                }}
              >
                취소
              </Button>
            </Grid>
          </Grid>
        </CardContentWrapper>
      </CardContent>
    </Card>
  )
}

const CardContentWrapper = styled('div')({
  paddingTop: '10px'
})

export default KioskCard
