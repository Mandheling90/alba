import { FC, useEffect, useState } from 'react'

import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import CustomTable from 'src/@core/components/table/CustomTable'
import { MVisitantList } from 'src/model/dashboard/dashboard'
import { IBarDataList } from 'src/model/statistics/StatisticsModel'
import { calculateChangeRate } from 'src/utils/CommonUtil'

interface IVisitantList {
  data: IBarDataList[]
  xcategories: string[]
  selected?: string
  refetch: () => void
}

const VisitantList: FC<IVisitantList> = ({ data, xcategories, selected = '', refetch }) => {
  const [visitantData, setVisitantData] = useState<IBarDataList[]>(data)

  useEffect(() => {
    setVisitantData(data)
  }, [data])

  const getFormattedDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${month}/${day}`
  }

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const columns: GridColDef[] = [
    {
      field: 'location',
      headerName: '장소',
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'previousDayInOut',
      headerName: `${visitantData[1]?.name || '이전'}(${getFormattedDate(yesterday)})`,
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'currentDayInOut',
      headerName: `${visitantData[0]?.name || '현재'}(${getFormattedDate(today)})`,
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'change',
      headerName: '증감',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MVisitantList>) => {
        return (
          <Typography variant='inherit' noWrap>
            {row.change}
          </Typography>
        )
      }
    }
  ]

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CustomTable
            rows={xcategories.map((item, index) => {
              const currentValue = visitantData[0].dataList[index]
              const previousValue = visitantData[1].dataList[index]

              return {
                location: item,
                currentDayInOut: `${currentValue}`,
                previousDayInOut: `${previousValue}`,
                change: calculateChangeRate(currentValue, previousValue)
              }
            })}
            columns={columns}
            id='location'
            isAllView
            enablePointer
            highlightCriteria={{ field: 'location', value: selected }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default VisitantList
