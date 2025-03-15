import { FC, useEffect, useState } from 'react'

import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import CustomTable from 'src/@core/components/table/CustomTable'
import { MVisitant, MVisitantList } from 'src/model/dashboard/dashboard'

interface IVisitantList {
  data: MVisitant
  refetch: () => void
}

const VisitantList: FC<IVisitantList> = ({ data, refetch }) => {
  const router = useRouter()

  const [visitantData, setVisitantData] = useState<MVisitantList[]>([])

  useEffect(() => {
    setVisitantData(data.visitantList)
  }, [data])

  const columns: GridColDef[] = [
    {
      field: 'location',
      headerName: '장소',
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'previousDayInOut',
      headerName: `전일 입장(${data.previousDayInOutCount} /${data.previousDayInOutTotal})`,
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'currentDayInOut',
      headerName: `금일 입장(${data.currentDayInOutCount} /${data.currentDayInOutTotal})`,
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
            {row.change}%
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
            rows={visitantData}
            columns={columns}
            id='location'
            isAllView
            enablePointer
            selectRowEvent={e => {
              console.log(e)
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default VisitantList
