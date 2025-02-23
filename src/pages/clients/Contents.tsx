// ** MUI Imports

import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useContents } from 'src/hooks/useContents'
import { useContentsList } from 'src/service/contents/contentsService'
import KioskMenu from '../kiosk/kioskMenu/KioskMenu'
import Table from './table/Table'

const Contents: FC = (): React.ReactElement => {
  const contents = useContents()

  const { data, refetch: userRefetch } = useContentsList(contents.contentListReqPram)

  if (!data) {
    return <></>
  }

  return (
    <StandardTemplate title={'고객사 관리'}>
      <Box pt={8}>
        <Grid container spacing={1} sx={{ mb: 5 }}>
          <Grid item sm={12} xs={12}>
            <KioskMenu
              refetch={() => {
                console.log('1')
              }}
            />
          </Grid>
          <Grid item sm={12} xs={12}>
            <Box>
              <Typography variant='h6' fontWeight={500} sx={{ mt: 5, mb: 3 }}>
                등록 고객사는 총 100곳입니다.
              </Typography>
              <DividerBar />
              <Typography variant='body2' sx={{ fontSize: 16, mt: 3, mb: 3 }}>
                전체 등록 고객사 37곳 중 계약중 35곳, 계약 만료 예정 1곳, 계약 만료 1곳 입니다.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Table
            data={data.data ?? []}
            refetch={() => {
              userRefetch()
            }}
          />
        </Box>
      </Box>

      {/* <ContentsManagerModal
        isOpen={contents.isContentsManagerModalOpen}
        onClose={() => {
          contents.setSelectedContent({})
          contents.setIsContentsManagerModalOpen(false)
        }}
        refetch={userRefetch}
      />

      <Grid container spacing={1} sx={{ mb: 5 }}>
        <Grid item sm={12} xs={12} mt={8}>
          <Table
            data={data.data ?? []}
            refetch={() => {
              userRefetch()
            }}
          />
        </Grid>
      </Grid> */}
    </StandardTemplate>
  )
}
export default Contents
