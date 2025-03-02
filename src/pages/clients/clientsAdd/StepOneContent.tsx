import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import WindowCard from 'src/@core/components/molecule/WindowCard'

// 첫 번째 스텝 컴포넌트
const StepOneContent: FC = () => {
  return (
    <Grid item xs={10}>
      <Box>
        <WindowCard title='고객사 정보'>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사ID
                </Typography>
                <TextField size='small' value={123} placeholder='필수입력' />
                <Button size='small' variant='contained'>
                  중복확인
                </Button>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '90px' }}>
                  고객사명
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사주소
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={7}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  사업자등록번호
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={5}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 3 }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  사업자 현재 상태
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  계약기간설정
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  리포트생성
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={8}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pl: 10 }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '110px' }}>
                  리포트수신
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500} variant='h6' sx={{ minWidth: '160px' }}>
                  고객사계정
                </Typography>
                <TextField size='small' sx={{ width: '100%' }} value={123} placeholder='필수입력' />
              </Box>
            </Grid>
          </Grid>
        </WindowCard>
      </Box>
    </Grid>
  )
}

export default StepOneContent
