import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import router from 'next/router'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { generateColumns } from 'src/@core/components/table/columns/columnGenerator'
import CustomTable from 'src/@core/components/table/CustomTable'
import IconCustom from 'src/layouts/components/IconCustom'
import WindowCard from '../windowCard/WindowCard'

const AddFacility: FC = (): React.ReactElement => {
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  console.log(selectedRows)

  const {
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      facilityName: '',
      maxCapacity: ''
    }
  })

  const data = [
    {
      id: 1,
      cameraName: '카메라01',
      areaInfo01: '영역정보01',
      areaInfo02: '영역정보02'
    },
    {
      id: 2,
      cameraName: '카메라01',
      areaInfo01: '영역정보01',
      areaInfo02: '영역정보02'
    },
    {
      id: 3,
      cameraName: '카메라01',
      areaInfo01: '영역정보01',
      areaInfo02: '영역정보02'
    }
  ]

  const handleAddRow = (row: any) => {
    if (!selectedRows.some(selectedRow => selectedRow.id === row.id)) {
      setSelectedRows([...selectedRows, row])
    }
  }

  const handleDeleteRow = (row: any) => {
    setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id))
  }

  const columns = generateColumns({
    columns: [
      { field: 'cameraName', headerName: '카메라명', type: 'string' },
      { field: 'areaInfo01', headerName: '영역정보01', type: 'string' },
      { field: 'areaInfo02', headerName: '영역정보02', type: 'string' },
      { field: 'groupItem', headerName: '그룹항목' }
    ],
    customRenderers: {
      groupItem: (row: any) => {
        const rowData = row.row

        console.log(rowData)

        return (
          <IconButton sx={{ gap: 2 }} onClick={() => handleAddRow(rowData)}>
            <Typography variant='body1' fontSize={14} fontWeight={600}>
              추가
            </Typography>
            <IconCustom icon='arrow_right3' isCommon />
          </IconButton>
        )
      }
    }
  })

  const columns2 = generateColumns({
    columns: [
      { field: 'cameraName', headerName: '카메라명', type: 'string' },
      { field: 'areaInfo01', headerName: '영역정보01', type: 'string' },
      { field: 'delete', headerName: '삭제' }
    ],
    customRenderers: {
      delete: (row: any) => {
        return (
          <IconButton onClick={() => handleDeleteRow(row)}>
            <IconCustom icon='DeleteOutline' isCommon />
          </IconButton>
        )
      }
    }
  })

  return (
    <StandardTemplate
      title={'시설 정보 추가 및 수정'}
      useBackButton
      onBackButtonClick={() => {
        router.back()
      }}
      height='80vh'
    >
      <Grid container spacing={3} sx={{ mb: 5, height: '100%' }}>
        <Grid item xs={8} sx={{ height: '100%' }}>
          <WindowCard
            title={'카메라 및 영역 정보'}
            titleAlign='left'
            headerColor='#F9FAFC'
            sx={{ width: '100%', height: '100%' }}
          >
            <CustomTable
              rows={data.filter(row => !selectedRows.some(selectedRow => selectedRow.id === row.id))}
              columns={columns}
              isAllView
            />
          </WindowCard>
        </Grid>
        <Grid item xs={4} sx={{ height: '100%' }}>
          <WindowCard
            title={'시설 정보'}
            titleAlign='left'
            headerColor='#F9FAFC'
            sx={{
              width: '100%',
              height: '100%',
              '&:focus-within': { border: '2px solid #9155FD' }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} container spacing={2} alignItems='center'>
                  <Grid item xs={4}>
                    <Typography variant='body1' sx={{ padding: '0 0 0 8px', fontSize: '0.9em' }}>
                      시설명
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      size='small'
                      placeholder='시설명을 입력해주세요'
                      sx={{
                        '& .MuiInputBase-input::placeholder': {
                          color: 'error.main',
                          opacity: 0.8,
                          fontSize: '0.8em'
                        }
                      }}
                      {...register('facilityName', { required: '시설명을 입력해주세요' })}
                      error={!!errors.facilityName}
                      helperText={errors.facilityName?.message}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={4}>
                      <Typography variant='body1' sx={{ padding: '0 0 0 8px', fontSize: '0.9em' }}>
                        최대수용인원수
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        size='small'
                        type='number'
                        placeholder='숫자만 입력'
                        sx={{
                          '& .MuiInputBase-input::placeholder': {
                            color: 'error.main',
                            opacity: 0.8,
                            fontSize: '0.8em'
                          }
                        }}
                        {...register('maxCapacity', {
                          required: '최대 수용인원수를 입력해주세요',
                          min: {
                            value: 1,
                            message: '1명 이상 입력해주세요'
                          }
                        })}
                        error={!!errors.maxCapacity}
                        helperText={errors.maxCapacity?.message}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Grid>
              {selectedRows.length > 0 && (
                <CustomTable rows={selectedRows} columns={columns2} isAllView showHeader={false} />
              )}
            </Grid>
          </WindowCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant='contained' color='primary'>
            저장
          </Button>
          <Button variant='outlined' color='primary' onClick={() => router.back()}>
            취소
          </Button>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default AddFacility
