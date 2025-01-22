// ** MUI Imports

import { Grid } from '@mui/material'
import { FC } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useContents } from 'src/hooks/useContents'
import { useContentsList } from 'src/service/contents/contentsService'
import ContentsManagerModal from './modal/ContentsManagerModal'
import Table from './table/Table'

const Contents: FC = (): React.ReactElement => {
  const contents = useContents()

  const { data, refetch: userRefetch } = useContentsList(contents.contentListReqPram)

  if (!data) {
    return <></>
  }

  return (
    <StandardTemplate title={'홍보물 관리'}>
      <ContentsManagerModal
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
      </Grid>
    </StandardTemplate>
  )
}
export default Contents
