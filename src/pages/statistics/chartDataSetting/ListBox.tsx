import { Box } from '@mui/material'
import React from 'react'
import { scrollbarSx } from 'src/@core/components/atom/scrollbarStyles'
import { chartColorList } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { MCommonList, MGroupList } from 'src/model/statistics/StatisticsModel'
import { useGroupDelete } from 'src/service/statistics/statisticsService'
import GuoupItemSelect from './GuoupItemSelect'
import GuoupSelect from './GuoupSelect'

interface CollapsibleListProps {
  isGroup: boolean
  groupList?: MGroupList[]
  commonList?: MCommonList[]
  checkedList: number[]
  setCheckedList: (checkedList: number[]) => void
  refetch?: () => void
}

const ListBox: React.FC<CollapsibleListProps> = ({
  isGroup,
  groupList,
  commonList,
  checkedList,
  setCheckedList,
  refetch
}) => {
  const statistics = useStatistics()
  const { mutateAsync } = useGroupDelete()

  const onCheckedFn = (checked: boolean, id: number, color: string) => {
    if (checked) {
      setCheckedList([...checkedList, id])
      statistics.setSelectedColorList([...statistics.selectedColorList, { color: color, id: id }])
    } else {
      setCheckedList(checkedList.filter(number => number !== id))
      statistics.setSelectedColorList(statistics.selectedColorList.filter(selectedColor => selectedColor.id !== id))
    }
  }

  let commonIndex = -1
  let groupIndex = -1

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        maxHeight: '335px', // 부모 컨테이너의 높이에 따라 유동적으로 설정
        overflowY: 'auto', // 높이를 넘을 경우 스크롤
        m: 3,
        ...scrollbarSx
      }}
    >
      {groupList
        ? groupList.map((list, index) => (
            <GuoupSelect
              key={index}
              id={list.id}
              title={list.name}
              index={index}
              isGroup={isGroup}
              isChecked={checkedList.includes(list.id)}
              onChecked={checked => {
                onCheckedFn(checked, list.id, chartColorList[index])
              }}
              onDelete={async () => {
                await mutateAsync(list.id)
                refetch?.()
              }}
            >
              {list.data.map((item, index) => {
                groupIndex++

                return (
                  <GuoupItemSelect
                    key={index}
                    index={groupIndex}
                    id={item.statsId}
                    title={item.statsName}
                    isGroup={isGroup}
                    isChecked={checkedList.includes(item.statsId)}
                    onChecked={(checked, index) => {
                      onCheckedFn(checked, item.statsId, chartColorList[index])
                    }}
                  />
                )
              })}
            </GuoupSelect>
          ))
        : commonList &&
          commonList.map((list, index) => (
            <GuoupSelect
              key={index}
              id={list.kioskId}
              title={list.kioskName}
              index={index}
              isGroup={isGroup}
              isChecked={checkedList.includes(list.kioskId)}
              onChecked={checked => {
                onCheckedFn(checked, list.kioskId, chartColorList[index])
              }}
            >
              {list.info.map((item, index) => {
                commonIndex++

                return (
                  <GuoupItemSelect
                    key={index}
                    index={commonIndex}
                    id={item.statsId}
                    title={item.statsName}
                    isGroup={isGroup}
                    isChecked={checkedList.includes(item.statsId)}
                    onChecked={(checked, index) => {
                      onCheckedFn(checked, item.statsId, chartColorList[index])
                    }}
                  />
                )
              })}
            </GuoupSelect>
          ))}
    </Box>
  )
}

export default ListBox
