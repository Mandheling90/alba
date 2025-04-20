import styled from '@emotion/styled'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { IScheduleBatchConfig } from 'src/service/schedule/scheduleService'
import BatchItem from './BatchItem'
import GateSelect from './GateSelect'

const ScheduleConfig = () => {
  const [selectedGates, setSelectedGates] = useState<string[]>([])
  const methods = useForm<IScheduleBatchConfig>()

  const { control, watch, setValue, handleSubmit } = methods

  console.log(watch())

  return (
    <FormProvider {...methods}>
      <Container>
        <GateSelect
          fullWidth
          label='스케쥴 적용장소'
          multiple
          value={selectedGates}
          onChange={event => setSelectedGates(event.target.value as string[])}
        />
        <BatchItem>
          <BatchItem.Container onChangeApplyStatus={status => status === 'notApplied' && setValue('days', [])}>
            <BatchItem.Title number='01' title='매주 휴업 요일 지정' />
            <BatchItem.Content>
              <SpaceBetween>
                <Controller
                  rules={{
                    required: {
                      value: true,
                      message: '요일을 선택해 주세요'
                    }
                  }}
                  control={control}
                  render={({ field }) => (
                    <BatchItem.DaySelect onChange={days => field.onChange(days)} selectedDays={field.value} />
                  )}
                  name='days'
                />
                <BatchItem.Handler
                  validCheck={async () => {
                    return new Promise(resolve => {
                      handleSubmit(
                        () => resolve(undefined),
                        error => resolve(error.days?.message)
                      )()
                    })
                  }}
                />
              </SpaceBetween>
            </BatchItem.Content>
          </BatchItem.Container>
        </BatchItem>
        <BatchItem>
          <BatchItem.Container
            onChangeApplyStatus={status => {
              if (status === 'notApplied') {
                setValue('repeatPeriod.startDate', '')
                setValue('repeatPeriod.endDate', '')
                setValue('repeatPeriod.workType', undefined)
              }
            }}
          >
            <BatchItem.Title number='02' title='비정기 휴업 및 영업일 지정' />
            <BatchItem.Content>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: '날짜를 선택해 주세요'
                  }
                }}
                render={({ field }) => {
                  return (
                    <BatchItem.DateRangePicker
                      onChange={(startDate, endDate) => {
                        field.onChange(startDate)
                        setValue('repeatPeriod.endDate', endDate)
                      }}
                      selectedStartDate={field.value}
                      selectedEndDate={watch('repeatPeriod.endDate')}
                    />
                  )
                }}
                name='repeatPeriod.startDate'
              />
              <SpaceBetween>
                <Controller
                  rules={{
                    required: {
                      value: true,
                      message: '영업일 휴업일 여부를 선택해 주세요.'
                    }
                  }}
                  control={control}
                  render={({ field }) => (
                    <BatchItem.WorkTypeRadio workType={field.value} onChange={workType => field.onChange(workType)} />
                  )}
                  name='repeatPeriod.workType'
                />
                <BatchItem.Handler
                  validCheck={() => {
                    return new Promise(resolve => {
                      handleSubmit(
                        () => resolve(undefined),
                        error =>
                          resolve(error.repeatPeriod?.startDate?.message || error.repeatPeriod?.workType?.message)
                      )()
                    })
                  }}
                />
              </SpaceBetween>
            </BatchItem.Content>
          </BatchItem.Container>
        </BatchItem>
        <BatchItem>
          <BatchItem.Container
            isDisabled={watch('repeatPeriod.workType') === 'holiday'}
            onChangeApplyStatus={status => {
              if (status === 'notApplied') {
                setValue('repeatPeriod.startTime', '')
                setValue('repeatPeriod.endTime', '')
              }
            }}
          >
            <BatchItem.Title number='03' title='전체 영업시간 일괄 적용' />
            <BatchItem.Content>
              <SpaceBetween>
                <Controller
                  control={control}
                  rules={
                    watch('repeatPeriod.workType') === 'work'
                      ? {
                          required: {
                            value: true,
                            message: '영업 시작시간을 선택해 주세요'
                          },
                          validate: {
                            endTime: (value, context) => {
                              if (!context.repeatPeriod?.endTime) {
                                return '영업 종료시간을 선택해 주세요'
                              } else {
                                return true
                              }
                            }
                          }
                        }
                      : {}
                  }
                  render={({ field }) => (
                    <BatchItem.WorkTimeSelect
                      onChangeStartTime={startTime => {
                        field.onChange(startTime)
                      }}
                      onChangeEndTime={endTime => {
                        setValue('repeatPeriod.endTime', endTime)
                      }}
                      selectedStartTime={field.value}
                      selectedEndTime={watch('repeatPeriod.endTime')}
                    />
                  )}
                  name='repeatPeriod.startTime'
                />
                <BatchItem.Handler
                  validCheck={() => {
                    return new Promise(resolve => {
                      handleSubmit(
                        () => resolve(undefined),
                        error => resolve(error.repeatPeriod?.startTime?.message || error.repeatPeriod?.endTime?.message)
                      )()
                    })
                  }}
                />
              </SpaceBetween>
            </BatchItem.Content>
          </BatchItem.Container>
        </BatchItem>
        <BatchItem>
          <BatchItem.Container
            onChangeApplyStatus={status => {
              if (status === 'notApplied') {
                setValue('specialPeriod.startDate', '')
                setValue('specialPeriod.endDate', '')
                setValue('specialPeriod.startTime', '')
                setValue('specialPeriod.endTime', '')
              }
            }}
          >
            <BatchItem.Title number='04' title='특정 기간 영업시간 일괄 적용' />
            <BatchItem.Content>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: '날짜를 선택해 주세요'
                  }
                }}
                render={({ field }) => {
                  return (
                    <BatchItem.DateRangePicker
                      onChange={(startDate, endDate) => {
                        field.onChange(startDate)
                        setValue('specialPeriod.endDate', endDate)
                      }}
                      selectedStartDate={field.value}
                      selectedEndDate={watch('repeatPeriod.endDate')}
                    />
                  )
                }}
                name='specialPeriod.startDate'
              />
              <SpaceBetween>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: '특정기간 영업 시작시간을 선택해 주세요'
                    },
                    validate: {
                      endTime: (value, context) => {
                        if (!context.specialPeriod?.endTime) {
                          return '특정기간 영업 종료시간을 선택해 주세요'
                        } else {
                          return true
                        }
                      }
                    }
                  }}
                  render={({ field }) => (
                    <BatchItem.WorkTimeSelect
                      onChangeStartTime={startTime => {
                        field.onChange(startTime)
                      }}
                      onChangeEndTime={endTime => {
                        setValue('specialPeriod.endTime', endTime)
                      }}
                      selectedStartTime={field.value}
                      selectedEndTime={watch('specialPeriod.endTime')}
                    />
                  )}
                  name='specialPeriod.startTime'
                />
                <BatchItem.Handler
                  validCheck={() => {
                    return new Promise(resolve => {
                      handleSubmit(
                        () => resolve(undefined),
                        error =>
                          resolve(error.specialPeriod?.startTime?.message || error.specialPeriod?.endTime?.message)
                      )()
                    })
                  }}
                />
              </SpaceBetween>
            </BatchItem.Content>
          </BatchItem.Container>
        </BatchItem>
      </Container>
    </FormProvider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  height: 100%;
  padding: 12px 40px;
  margin-top: -12px;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  min-width: 450px;
  margin-right: 48px;
`

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export default ScheduleConfig
