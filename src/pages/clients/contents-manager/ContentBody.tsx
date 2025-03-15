// ** MUI Imports
import { Box, Button, Card, Checkbox, FormControlLabel, Grid, TextField, Typography, useTheme } from '@mui/material'

import { FC, useCallback, useEffect } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
import CustomCard from 'src/@core/components/atom/CustomCard'
import CustomRadioGroup from 'src/@core/components/atom/CustomRadioGroup'
import CustomTextField from 'src/@core/components/atom/CustomTextField'
import PickersRange from 'src/@core/components/atom/PickersRange'
import { scrollbarSx } from 'src/@core/components/atom/scrollbarStyles'
import SelectedContentsView from 'src/@core/components/molecule/SelectedContentsView'
import { checkFileType, PROMO } from 'src/enum/contentsEnum'
import { useContents } from 'src/hooks/useContents'

import { useKioskList } from 'src/service/kiosk/kioskService'
import { extractFileName } from 'src/utils/CommonUtil'
import styled from 'styled-components'

interface IContentBody {
  isDisabled?: boolean
}

const ContentBody: FC<IContentBody> = ({ isDisabled = false }) => {
  const contents = useContents()

  const selectedContent = contents.selectedContent
  const setSelectedContent = contents.setSelectedContent

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { data } = useKioskList({})

  useEffect(() => {
    //초기값 세팅
    if (JSON.stringify(selectedContent) === '{}') {
      setSelectedContent({
        ...selectedContent,
        type: PROMO.GENERIC_PROMO,
        priorityType: 0,
        expireType: 1,
        kioskIdList: selectedContent?.kioskList?.map(kiosk => kiosk.id)
      })
    } else {
      setSelectedContent({
        ...selectedContent,
        kioskIdList: selectedContent?.kioskList?.map(kiosk => kiosk.id)
      })
    }
  }, [])

  const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, files } = e.target

      if (files) {
        const file = files[0]
        if (file.size > MAX_FILE_SIZE) {
          alert('파일 용량은 500MB를 초과할 수 없습니다.')

          return
        }
        setSelectedContent({ ...selectedContent, [name]: file, contentsTypeId: checkFileType(file) })
      } else {
        setSelectedContent({ ...selectedContent, [name]: value })
      }
    },
    [selectedContent, setSelectedContent]
  )

  const handleDateChange = useCallback(
    (start: string, end: string) => {
      setSelectedContent({ ...selectedContent, postStartDate: start, postEndDate: end })
    },
    [selectedContent, setSelectedContent]
  )

  const handleCheckboxChange = (id: number) => {
    const kioskIdList = selectedContent.kioskIdList || [] // undefined일 경우 빈 배열로 대체
    const isChecked = kioskIdList.includes(id)
    const newKioskIdList = isChecked ? kioskIdList.filter(kioskId => kioskId !== id) : [...kioskIdList, id]

    setSelectedContent({ ...selectedContent, kioskIdList: newKioskIdList })
  }

  return (
    <GridContainer
      container
      spacing={2}
      style={{ height: '78vh' }} // 전체 높이를 78vh로 설정
    >
      {/* 왼쪽 영역 */}
      <Grid item xs={7} container direction='column' spacing={2} style={{ height: '100%' }}>
        {/* 왼쪽 행 1 - 높이 370px 고정 */}
        <Grid item style={{ height: '370px', width: '100%' }}>
          <CustomCard title='홍보물 설정 정보' style={{ height: '100%' }}>
            <Grid container alignItems='center' spacing={2}>
              <CustomRadioGroup
                isDisabled={isDisabled}
                label='홍보물 종류'
                name='type'
                value={selectedContent?.type}
                onChange={handleInputChange}
                options={[
                  { value: PROMO.NO_SMOKING_PROMO, label: '금연 홍보물' },
                  { value: PROMO.GENERIC_PROMO, label: '일반 홍보물' }
                ]}
              />

              <CustomTextField
                label='홍보물 명'
                name='name'
                value={selectedContent?.name ?? ''}
                onChange={handleInputChange}
                isDisabled={isDisabled}
                placeholder={'필수입력'}
                placeholderColor={'red'}
              />

              <Grid item md={1.8}>
                <Typography variant='subtitle1' fontWeight={600}>
                  홍보물 파일선택
                </Typography>
              </Grid>
              <Grid item md={9}>
                <TextField
                  fullWidth
                  size='small'
                  value={
                    selectedContent?.file
                      ? selectedContent?.file.name
                      : selectedContent?.filePath
                      ? extractFileName(selectedContent.filePath)
                      : ''
                  }
                  InputProps={{ readOnly: true }}
                  disabled={isDisabled}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      color: 'red', // 원하는 색상으로 변경
                      opacity: 0.5 // placeholder의 투명도 조정 (기본값은 0.5)
                    }
                  }}
                  placeholder={'필수입력'}
                />
              </Grid>
              <Grid item md={1.2} sx={{ display: 'inline-grid' }}>
                <Button component='label' variant='contained' disabled={isDisabled}>
                  Browse
                  <VisuallyHiddenInput name='file' type='file' onChange={handleInputChange} />
                </Button>
              </Grid>

              <Grid item md={1.8}>
                <Typography variant='subtitle1' fontWeight={600}>
                  게시날짜 선택
                </Typography>
              </Grid>
              <Grid item md={10.2}>
                <PickersRange
                  useFrontIcon
                  label='게시날짜'
                  placeholder='필수입력'
                  placeholderColor={'red'}
                  onChange={handleDateChange}
                  selectedStartDate={selectedContent?.postStartDate}
                  selectedEndDate={selectedContent?.postEndDate}
                  isDisabled={isDisabled}
                  returnFormat='yyyy-MM-dd'
                />
              </Grid>

              <CustomRadioGroup
                label='게시 우선순위'
                name='priorityType'
                value={selectedContent?.priorityType}
                onChange={handleInputChange}
                options={[
                  { value: 0, label: '일반' },
                  { value: 1, label: '우선' }
                ]}
                isDisabled={isDisabled}
              />

              <CustomTextField
                label='태그'
                name='tag'
                iconPath='contents'
                iconName='tag'
                value={selectedContent?.tag ?? ''}
                onChange={handleInputChange}
                isDisabled={isDisabled}
                placeholder={'선택입력'}
              />
            </Grid>
          </CustomCard>
        </Grid>

        {/* 왼쪽 행 2 - 남은 영역 모두 차지 */}
        <Grid item style={{ flex: '1 1 0', minHeight: 0, width: '100%' }}>
          <CustomCard
            title='홍보물 게시 위치 선택'
            subTitle='| 선택입력'
            style={{ height: '100%' }} // 스크롤을 추가
            contentStyle={{ height: '100%', padding: 0, marginLeft: '10px' }}
          >
            <Box
              sx={{
                ...scrollbarSx,

                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                height: '100%',
                overflowY: 'auto',
                width: '100%',

                paddingBottom: '40px',
                gap: '8px'
              }}
            >
              {data?.data?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: '150px',
                    boxSizing: 'border-box'
                  }}
                >
                  <FormControlLabel
                    disabled={isDisabled}
                    control={
                      <Checkbox
                        value={item.id}
                        onChange={() => handleCheckboxChange(item.id)}
                        checked={selectedContent?.kioskIdList?.includes(item.id) || false}
                        sx={{
                          padding: '4px'
                        }}
                      />
                    }
                    label={item.name || '키오스크위치'}
                    sx={{
                      margin: 0,
                      padding: '2px 0',
                      minHeight: '32px',
                      '.MuiFormControlLabel-label': {
                        fontSize: '0.85rem',
                        lineHeight: '1.2'
                      }
                    }}
                  />
                </Box>
              )) || null}
            </Box>
          </CustomCard>
        </Grid>

        {/* 왼쪽 행 3 - 높이 105px 고정 */}
        <Grid item style={{ height: '105px', width: '100%' }}>
          <CustomCard title='게시만료 홍보물 관리' style={{ height: '100%' }}>
            <Grid container alignItems='center' spacing={5}>
              <CustomRadioGroup
                isDisabled={isDisabled}
                label='게시기간 만료 시'
                name='expireType'
                value={selectedContent?.expireType}
                onChange={handleInputChange}
                options={[
                  { value: 0, label: '파일 유지' },
                  { value: 1, label: '파일 삭제' }
                ]}
              />
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>

      {/* 오른쪽 영역 */}
      <Grid item xs={5} style={{ height: '100%' }} pb={2}>
        <Card sx={{ height: '100%' }}>
          <SelectedContentsView
            contentsTypeId={selectedContent.contentsTypeId}
            title={'홍보물 미리보기'}
            filePath={selectedContent.filePath}
          />
        </Card>
      </Grid>
    </GridContainer>
  )
}

const GridContainer = styled(Grid)({
  '& .MuiTypography-root': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default ContentBody
