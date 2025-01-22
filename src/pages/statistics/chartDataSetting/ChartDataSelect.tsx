// ** MUI Imports
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import IconHoverDisplayText from 'src/@core/components/atom/IconHoverDisplayText'
import CircleButtonComponent from 'src/@core/components/molecule/CircleButtonComponent'
import CircleCheckBox from 'src/@core/components/molecule/CircleCheckBox'
import { useStatistics } from 'src/hooks/useStatistics'
import { MCommonList, MGroupList } from 'src/model/statistics/StatisticsModel'
import { useStatsCommonList, useStatsGroupList } from 'src/service/statistics/statisticsService'
import ListBox from './ListBox'

interface IChartDataSelect {
  chartType: 'crowd' | 'smoking'
  onSubmit: (isGroupPrm?: boolean, selectedIds?: number[]) => void
}

const ChartDataSelect: FC<IChartDataSelect> = ({ chartType, onSubmit }): React.ReactElement => {
  const statistics = useStatistics()

  const { data: groupListData, refetch: groupRefetch } = useStatsGroupList({
    type: chartType === 'crowd' ? 'line' : 'area'
  })
  const { data: commonListData } = useStatsCommonList({
    type: chartType === 'crowd' ? 'line' : 'area'
  })

  const [text, setText] = useState('')
  const [isGroup, setIsGroup] = useState(true)

  const [groupCheckedList, setGroupCheckedList] = useState<number[]>(
    statistics.groupSetting ? statistics.selectedIds : []
  )
  const [commonCheckedList, setCommonCheckedList] = useState<number[]>(
    statistics.groupSetting ? statistics.selectedIds : []
  )

  const [groupList, setGroupList] = useState<MGroupList[]>([])
  const [commonList, setCommonList] = useState<MCommonList[]>([])
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  const [allCheck, setAllCheck] = useState(false)

  useEffect(() => {
    setGroupList(groupListData?.data ?? [])
    setCommonList(commonListData?.data ?? [])
    setIsGroup(!statistics.groupSetting ? true : statistics.chartProps.isGroup ?? true)

    //초기로딩
    if (groupListData?.data && !initialDataLoaded && !statistics.groupSetting) {
      const ids = groupListData.data.map(item => item.id)
      setAllCheck(true)
      setGroupCheckedList(ids)
      setInitialDataLoaded(true)
    }
  }, [groupListData, commonListData])

  // 체크박스 체크
  useEffect(() => {
    statistics.setSelectedIds(isGroup ? groupCheckedList : commonCheckedList)
    groupCheck(isGroup)
  }, [groupCheckedList, commonCheckedList])

  useEffect(() => {
    groupCheck(isGroup)
  }, [isGroup])

  const handleSelectAll = () => {
    isGroup
      ? setGroupCheckedList(groupList.map(item => item.id))
      : setCommonCheckedList(commonList.flatMap(item => item.info.map(info => info.statsId)))
  }

  const handleDeselectAll = () => {
    isGroup ? setGroupCheckedList([]) : setCommonCheckedList([])
  }

  const groupCheck = (isGroup: boolean) => {
    if (isGroup) {
      setAllCheck(groupCheckedList.length === groupList.length)
    } else {
      setAllCheck(commonCheckedList.length === commonList.flatMap(item => item.info.map(info => info.statsId)).length)
    }
  }

  return (
    <Grid container>
      <Grid item xs={12} m={3}>
        <Box display='flex' alignItems='center' gap={3}>
          <IconHoverDisplayText
            icon='chart-setting-add-disable'
            iconHover='chart-setting-add'
            text='적용'
            onClick={() => {
              statistics.setSelectedIds(isGroup ? groupCheckedList : commonCheckedList)
              statistics.setChartProps({ ...statistics.chartProps, isGroup: isGroup })
              onSubmit(isGroup, isGroup ? groupCheckedList : commonCheckedList)
            }}
          />
          <IconHoverDisplayText
            icon='chart-setting-close-disable'
            iconHover='chart-setting-close'
            text='취소'
            onClick={() => {
              statistics.setSelectedIds([])
            }}
          />
          <TextField
            size='small'
            value={text}
            label='키오스크명, 구역설정명'
            placeholder='키오스크명, 구역설정명'
            sx={{ width: '100%' }}
            name='name'
            onChange={e => {
              setText(e.target.value)
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                if (text) {
                  setGroupList(groupList.filter(group => group.name.includes(text)))
                  setCommonList(commonList.filter(common => common.kioskName.includes(text)))
                } else {
                  setGroupList(groupListData?.data ?? [])
                  setCommonList(commonListData?.data ?? [])
                }
              }
            }}
          />
          <Button
            sx={{ minWidth: '92px' }}
            variant='contained'
            onClick={() => {
              if (text) {
                setGroupList(groupList.filter(group => group.name.includes(text)))
                setCommonList(commonList.filter(common => common.kioskName.includes(text)))
              } else {
                setGroupList(groupListData?.data ?? [])
                setCommonList(commonListData?.data ?? [])
              }
            }}
          >
            검색
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} m={3}>
        <Box display='flex' alignItems='center' gap={3}>
          <Typography variant='body1' sx={{ flexShrink: 0 }}>
            통계항목설정:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <CircleButtonComponent
              index={!statistics.groupSetting ? 0 : statistics.chartProps.isGroup ? 0 : 1}
              selectNameList={chartType === 'crowd' ? ['그룹항목', '개별항목'] : ['그룹항목', '통합항목']}
              selectNameDisplayList={chartType === 'crowd' ? ['그룹', '개별'] : ['그룹', '통합']}
              onClick={index => {
                setIsGroup(index === 0)
              }}
            />
            <Box sx={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
              <CircleCheckBox
                isChecked={allCheck}
                labelNormal='전체'
                labelHovered={allCheck ? '전체해제' : '전체선택'}
                onChange={() => {
                  if (allCheck) {
                    handleDeselectAll()
                  } else {
                    handleSelectAll()
                  }
                  setAllCheck(!allCheck)
                }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} m={3}>
        {groupList && (
          <Box display={isGroup ? 'flex' : 'none'} alignItems='center' gap={3}>
            <ListBox
              isGroup={isGroup}
              groupList={groupList}
              checkedList={groupCheckedList}
              setCheckedList={setGroupCheckedList}
              refetch={groupRefetch}
            />
          </Box>
        )}

        {commonList && (
          <Box display={isGroup ? 'none' : 'flex'} alignItems='center' gap={3}>
            <ListBox
              commonList={commonList}
              isGroup={isGroup}
              checkedList={commonCheckedList}
              setCheckedList={setCommonCheckedList}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default ChartDataSelect
