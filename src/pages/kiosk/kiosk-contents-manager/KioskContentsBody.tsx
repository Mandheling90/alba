import { Box, Card, styled } from '@mui/material'
import { FC, useState } from 'react'
import CustomCard from 'src/@core/components/atom/CustomCard'
import SelectedContentsView from 'src/@core/components/molecule/SelectedContentsView'
import { MKioskContent } from 'src/model/kiosk/kioskModel'
import { useKioskContentsList } from 'src/service/kiosk/kioskService'
import KioskContentsList from './KioskContentsList'

interface IContentBody {
  isDisabled?: boolean
  kioskId: number
}

const KioskContentsBody: FC<IContentBody> = ({ isDisabled = false, kioskId }) => {
  const { data, refetch } = useKioskContentsList({ contents: kioskId })
  const [preViewContent, setPreViewContent] = useState<MKioskContent>()

  return (
    <GridContainer>
      {/* 좌측 영역: 세로로 3개의 카드 */}
      <GridItem>
        <CustomCard title='홍보물 설정 정보' style={{ height: '100%' }}>
          {data?.data && (
            <KioskContentsList
              data={data?.data ?? []}
              onPreView={(data: MKioskContent) => {
                setPreViewContent(data)
              }}
              refetch={refetch}
            />
          )}
        </CustomCard>
      </GridItem>

      {/* 우측 영역: 3개의 카드를 병합한 큰 카드 */}
      <LargeCard>
        <Card sx={{ height: '100%' }}>
          <SelectedContentsView
            contentsTypeId={preViewContent?.contentsTypeId}
            title={'홍보물 미리보기'}
            filePath={preViewContent?.filePath}
          />
        </Card>
      </LargeCard>
    </GridContainer>
  )
}

const GridContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '65% 35%', // 첫 번째 열은 80%, 두 번째 열은 20%
  width: '100%',
  height: '78vh'
})

const GridItem = styled(Box)({
  marginRight: '20px'
})

const LargeCard = styled(Box)({
  height: '78vh'

  // height: '710px' // 고정된 높이 설정
})

export default KioskContentsBody
