// ** MUI Imports
import { Box, Grid, styled, TextField, Typography } from '@mui/material'

import { FC, useEffect } from 'react'

import { useKioskManager } from 'src/hooks/useKioskManager'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'
import KioskInsertPrev from './KioskInsertPrev'
import IocnList from './KioskIocnList'
import KioskSelect from './KioskSelect'
import KioskSlider from './KioskSlider'

// import KioskContentsList from './KioskContentsList'

interface IContentBody {
  kioskPartTypeList: MKioskPartTypeList[]
  isMod: boolean
}

const KioskComponentBody: FC<IContentBody> = ({ kioskPartTypeList, isMod }) => {
  const kioskManager = useKioskManager()

  // 수정시 선택한 키오스크 그룹 정보
  const selectKioskPartTypeList = kioskManager.selectKioskPartTypeList

  useEffect(() => {
    if (selectKioskPartTypeList.id) {
      const selectData = kioskPartTypeList.find(item => item.id === selectKioskPartTypeList.id)
      const selectPartList = selectData?.partList[selectKioskPartTypeList.selectIndex ?? 0]

      kioskManager.setKioskPartTypeReq({
        id: selectKioskPartTypeList.id,
        name: selectKioskPartTypeList.name,
        iconFileName: selectKioskPartTypeList.iconFileName,
        partListId: selectPartList?.id,
        partListName: selectPartList?.name,
        specification: selectPartList?.specification
      })
    }
  }, [selectKioskPartTypeList.selectIndex])

  return (
    <GridContainer isMod={isMod}>
      <GridItem>
        <Grid container spacing={3}>
          <Grid item xs={2.5} sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
            <Box>
              <Typography variant='body1' fontWeight={500} component='span'>
                구성품 종류
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={9.5} sx={{ display: 'flex' }}>
            {isMod ? (
              <KioskSlider kioskPartTypeList={kioskPartTypeList} />
            ) : (
              <KioskSelect isMod={isMod} kioskPartTypeList={kioskPartTypeList} />
            )}
          </Grid>
          <Grid item xs={2.5} sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
            <Typography variant='body1' fontWeight={500} component='span'>
              구성품 명
            </Typography>
          </Grid>

          <Grid item xs={9.5}>
            <Box>
              <TextField
                size='small'
                value={kioskManager.kioskPartTypeReq.partListName ?? ''}
                placeholder='구성품명 입력'
                name='name'
                onChange={e => {
                  kioskManager.setKioskPartTypeReq({
                    ...kioskManager.kioskPartTypeReq,
                    partListName: e.target.value
                  })
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={2.5} sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
            <Typography variant='body1' fontWeight={500} component='span'>
              구성품 아이콘
            </Typography>
          </Grid>

          <Grid item xs={9.5}>
            <Box display={'flex'} alignItems={'center'}>
              <IconCustom
                path='kioskSetting'
                icon={kioskManager.kioskPartTypeReq.iconFileName ?? 'AI-Box'}
                style={{ width: '40px' }}
              />

              <IocnList
                disable={kioskManager.kioskPartTypeReq.id !== 0 && !isMod}
                onClick={icon => {
                  kioskManager.setKioskPartTypeReq({
                    ...kioskManager.kioskPartTypeReq,
                    iconFileName: icon
                  })
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
            <Typography variant='body1' fontWeight={500} component='span'>
              구성품 사양
            </Typography>
          </Grid>

          <Grid item xs={12} mt={4}>
            <TextField
              placeholder='구성품 상세 입력' // 라벨 대신 placeholder 사용
              multiline
              rows={8}
              variant='outlined' // 테두리 스타일 유지
              sx={{ width: '100%', mt: -3 }}
              value={kioskManager.kioskPartTypeReq.specification ?? ''}
              onChange={e => {
                const inputValue = e.target.value

                // 두 번 이상의 개행이 있을 경우, 하나의 개행만 남기고 모두 제거
                const sanitizedValue = inputValue.replace(/\n{2,}/g, '\n')

                // 상태 업데이트
                kioskManager.setKioskPartTypeReq({
                  ...kioskManager.kioskPartTypeReq,
                  specification: sanitizedValue
                })
              }}
            />
          </Grid>
        </Grid>
      </GridItem>
      {!isMod && <LargeCard>{<KioskInsertPrev kioskPartTypeList={kioskPartTypeList} />}</LargeCard>}
      {/* <LargeCard>{isMod ? <KioskUpdatePrev /> : <KioskInsertPrev kioskPartTypeList={kioskPartTypeList} />}</LargeCard> */}
    </GridContainer>
  )
}

const GridContainer = styled(Box)<{ isMod: boolean }>(({ isMod }) => ({
  display: 'grid',
  gridTemplateColumns: !isMod ? '50% 50%' : '100%',
  width: '100%',
  height: '45vh',

  '& .MuiTypography-root': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

const GridItem = styled(Box)({
  marginRight: '20px'
})

const LargeCard = styled(Box)({})

export default KioskComponentBody
