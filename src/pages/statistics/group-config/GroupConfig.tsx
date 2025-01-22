// ** MUI Imports
import { Box, Button, Grid, styled, TextField, Typography } from '@mui/material'
import router from 'next/router'
import { FC, useEffect, useState } from 'react'
import CustomCard from 'src/@core/components/atom/CustomCard'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useStatistics } from 'src/hooks/useStatistics'
import { MGroupList, MGroupSettingList, MKioskData } from 'src/model/statistics/StatisticsModel'
import {
  useCrowdGroupInsert,
  useCrowdGroupUpdate,
  useGroupSettingList,
  useSmokerGroupInsert,
  useSmokerGroupUpdate,
  useStatsGroupListId
} from 'src/service/statistics/statisticsService'
import StatsConfigGroup from './table/StatsConfigGroup'
import StatsConfigItemList from './table/StatsConfigItemList'

const removeDuplicateStatsId = (dataA: MGroupSettingList[], dataB: MGroupList): MGroupSettingList[] => {
  // B 데이터에서 kioskId 목록 추출
  const kioskIdsInB = dataB.data.map(item => item.statsId)

  // A 데이터에서 kioskId가 B에 없는 항목만 필터링
  return dataA.filter(item => !kioskIdsInB.includes(item.statsId))
}

const GroupConfig: FC = (): React.ReactElement => {
  const statistics = useStatistics()

  useEffect(() => {
    statistics.setGroupSetting(true)
  }, [])

  const { type, id } = router.query
  const titleType = type === 'crowd' ? '유동인구' : '흡연자'

  //react-query
  const { data: groupSettingList } = useGroupSettingList({
    type: type === 'crowd' ? 'line' : 'area'
  })
  const { data: groupList } = useStatsGroupListId(Number(id ?? 0), id ? true : false)

  //state
  const [groupSettingListState, setGroupSettingListState] = useState<MGroupSettingList[]>([])
  const [groupListState, setGroupListState] = useState<MGroupList>({ id: Number(id ?? 0), name: '', data: [] })
  const { mutateAsync: crowdInsert } = useCrowdGroupInsert()
  const { mutateAsync: crowdUpdate } = useCrowdGroupUpdate()
  const { mutateAsync: smokerInsert } = useSmokerGroupInsert()
  const { mutateAsync: smokerUpdate } = useSmokerGroupUpdate()

  useEffect(() => {
    if (groupSettingList?.data) {
      setGroupSettingListState(groupSettingList?.data)
    }
  }, [groupSettingList?.data])

  useEffect(() => {
    if (groupList?.data) {
      setGroupListState(groupList?.data)
    }
  }, [groupList?.data])

  return (
    <StandardTemplate title={`${titleType} 통계그룹설정`}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <GridContainer>
            <GridItem>
              <CustomCard title={`${titleType} 통계설정항목`} style={{ height: '100%' }}>
                <StatsConfigItemList
                  data={removeDuplicateStatsId(groupSettingListState, groupListState)}
                  onAdd={(row: MGroupSettingList) => {
                    setGroupListState({
                      ...groupListState,
                      data: [
                        ...groupListState.data,
                        {
                          kioskId: row.kioskId,
                          kioskName: row.kioskName,
                          statsId: row.statsId,
                          statsName: row.statsName
                        }
                      ]
                    })
                  }}
                />
              </CustomCard>
            </GridItem>

            <CustomCard title={`${titleType} 통계항목 그룹`} style={{ height: '100%' }}>
              <Box gap={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='subtitle1' fontWeight={400}>
                  {titleType} 통계그룹명
                </Typography>
                <TextField
                  placeholder='새로운 그룹 이름 입력'
                  value={groupListState.name}
                  onChange={e => {
                    setGroupListState({
                      ...groupListState,
                      name: e.target.value
                    })
                  }}
                  size='small'
                />
              </Box>

              <Box mt={5}>
                <StatsConfigGroup
                  data={groupListState}
                  onDelete={(row: MKioskData) => {
                    setGroupListState({
                      ...groupListState,
                      data: groupListState.data.filter(item => item.statsId !== row.statsId)
                    })
                  }}
                />
              </Box>
            </CustomCard>
          </GridContainer>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }} gap={3}>
          <Button
            variant='contained'
            onClick={() => {
              //유동인구
              if (type === 'crowd') {
                if (id) {
                  crowdUpdate({
                    id: groupListState.id,
                    name: groupListState.name,
                    modelTypeIdList: groupListState.data.map(item => item.statsId)
                  })
                } else {
                  crowdInsert({
                    name: groupListState.name,
                    modelTypeIdList: groupListState.data.map(item => item.statsId)
                  })
                }
              } else {
                // 흡연자
                if (id) {
                  smokerUpdate({
                    id: groupListState.id,
                    name: groupListState.name,
                    modelTypeIdList: groupListState.data.map(item => item.statsId)
                  })
                } else {
                  smokerInsert({
                    name: groupListState.name,
                    modelTypeIdList: groupListState.data.map(item => item.statsId)
                  })
                }
              }

              router.back()
            }}
          >
            저장
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              router.back()
            }}
          >
            취소
          </Button>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

const GridContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '70% 30%',
  width: '100%',

  // height: '45vh',

  '& .MuiTypography-root': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

const GridItem = styled(Box)({
  marginRight: '20px'
})

const LargeCard = styled(Box)({})

export default GroupConfig
