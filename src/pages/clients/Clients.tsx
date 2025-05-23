// ** MUI Imports

import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'

import { useClients } from 'src/hooks/useClients'
import { useClientList } from 'src/service/client/clientService'
import ClientsMenu from './menu/ClientsMenu'
import ClientList from './table/ClientList'

const Contents: FC = (): React.ReactElement => {
  const { clientListReq, clear } = useClients()
  const { data, refetch } = useClientList(clientListReq)

  // useEffect(() => {
  //   return () => {
  //     clear()
  //   }
  // }, [])

  if (!data) {
    return <></>
  }

  return (
    <StandardTemplate title={'고객사 관리'}>
      <Box pt={8}>
        <Grid container spacing={1} sx={{ mb: 5 }}>
          <Grid item sm={12} xs={12}>
            <ClientsMenu
              refetch={() => {
                refetch()
              }}
            />
          </Grid>
          <Grid item sm={12} xs={12}>
            <Box>
              <Typography variant='h6' fontWeight={500} sx={{ mt: 5, mb: 3 }}>
                등록 고객사는 총 {data?.data?.totalCount}곳입니다.
              </Typography>
              <DividerBar />
              <Typography variant='body2' sx={{ fontSize: 16, mt: 3, mb: 3 }}>
                전체 등록 고객사 {data?.data?.totalCount}곳 중 계약중 {data?.data?.totalCount}곳, 계약 만료 예정{' '}
                {data?.data?.totalCount}곳, 계약 만료 {data?.data?.totalCount}곳 입니다.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <ClientList
            data={data?.data?.list ?? []}
            refetch={() => {
              refetch()
            }}
          />
        </Box>
      </Box>
    </StandardTemplate>
  )
}
export default Contents
