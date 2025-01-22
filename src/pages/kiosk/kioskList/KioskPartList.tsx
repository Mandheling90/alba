// ** MUI Imports
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FC } from 'react'
import { ScrollCustomDiv } from 'src/@core/components/atom/ScrollCustom'
import DotList from 'src/@core/components/molecule/DotList'
import { MKiosk } from 'src/model/kiosk/kioskModel'

interface IKioskPartList {
  kioskData: MKiosk
  isView: boolean
}

const KioskPartList: FC<IKioskPartList> = ({ kioskData, isView }): React.ReactElement => {
  return (
    <CardContentWrapper>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ mb: 3 }} fontWeight={700}>
          구성품
        </Typography>
        <ScrollCustomDiv $maxHeight={170} $minHeight={170} $scrollbarVisible $isboder>
          <DotList
            list={kioskData.kioskPartList.map(item => `${item.specification} ${item.name} ${item.quantity}개`)}
          ></DotList>
        </ScrollCustomDiv>
        {/* </ListWrapper> */}
      </Box>

      <Typography sx={{ mb: 3 }}>
        <b>IP 주소 :</b> {kioskData.ip}
      </Typography>

      <Typography sx={{ mb: 3 }}>
        <b>타입 :</b> {kioskData.kioskType.name}
      </Typography>
    </CardContentWrapper>
  )
}

const CardContentWrapper = styled('div')({
  // paddingTop: '10px'
})

export default KioskPartList
