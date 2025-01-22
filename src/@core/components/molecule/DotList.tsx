import { useTheme } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

interface IDotList {
  list: string[]
}

const DotList: React.FC<IDotList> = ({ list }) => {
  const theme = useTheme()

  return (
    <List color={theme.palette.customColors.cardTextGray}>
      {list.map((item, index) => (
        <ListItem key={index}>{item}</ListItem>
      ))}
    </List>
  )
}

const List = styled('ul')(({ color }) => ({
  listStyleType: 'disc', // 점 스타일 설정
  listStylePosition: 'outside', // 기본 위치 유지
  paddingLeft: '25px', // 기본 패딩 (필요에 따라 조정 가능)
  marginTop: '0px',
  marginBottom: '0px',
  color: color
}))

const ListItem = styled.li`
  margin-bottom: 3px; // 항목 간의 간격
  text-indent: -5px; // 점과 텍스트 사이의 간격 조절 (음수 값을 사용해 간격을 줄임)
`

export default DotList
