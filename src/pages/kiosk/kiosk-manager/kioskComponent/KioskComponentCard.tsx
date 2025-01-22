// ** React Imports
import { FC, useEffect, useState } from 'react'

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import { IconButton } from '@mui/material'
import { scrollbarSx } from 'src/@core/components/atom/scrollbarStyles'
import DotList from 'src/@core/components/molecule/DotList'
import { useKioskManager } from 'src/hooks/useKioskManager'
import IconCustom from 'src/layouts/components/IconCustom'
import { IPartTypeList, MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'
import { useKioskPartDelete } from 'src/service/kiosk/kioskManager'
import { convertTextToArray } from 'src/utils/CommonUtil'
import KioskInUse from './KioskInUse'

interface IRolesCards {
  data: MKioskPartTypeList
  isDefaultDetail?: boolean
  readOnly?: boolean

  refetch?: () => void
}

const KioskComponentCard: FC<IRolesCards> = ({
  data,
  isDefaultDetail = false,
  readOnly = false,

  refetch
}) => {
  const kioskManager = useKioskManager()
  const [isDetail, setIsDetail] = useState(isDefaultDetail)
  const [partList, setPartList] = useState<IPartTypeList>(data?.partList?.[0] ?? [])
  const [selectIndex, setSelectIndex] = useState(0)
  const { mutateAsync: kioskPartDelete } = useKioskPartDelete()

  useEffect(() => {
    if (data?.partList) {
      if (readOnly) {
        setPartList(data.partList[data.partList.length - 1])
      } else {
        setPartList(data.partList[0])
      }
    }
  }, [data])

  return (
    <>
      <Card sx={{ minWidth: '480px', maxWidth: '480px', height: ' 150px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            m: 2,
            ml: 4,
            mr: 4,
            height: ' 135px',
            justifyContent: 'space-between'

            // p: 3
          }}
        >
          <KioskInUse
            data={data}
            isDetail={isDetail}
            partList={partList}
            setPartList={(partList, selectIndex) => {
              setPartList(partList)
              setSelectIndex(selectIndex)
            }}
            readOnly={readOnly}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <Typography variant='subtitle2' fontSize={20} fontWeight={500}>
                {data.name}
                <Typography variant='subtitle2' fontSize={13} fontWeight={500} component='span' mr={3} ml={3}>
                  |
                </Typography>
                <Typography variant='subtitle2' fontSize={13} fontWeight={500} component='span'>
                  {partList?.name}
                </Typography>
              </Typography>

              <Box
                sx={{
                  display: isDetail ? 'grid' : 'none',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  maxHeight: '55px',
                  overflow: 'auto',
                  width: '100%',
                  ...scrollbarSx
                }}
              >
                <DotList list={convertTextToArray(partList?.specification ?? '').map(item => `${item}`)} />
              </Box>
            </Box>
          </Box>

          <Box>
            <IconButton
              disabled={readOnly}
              sx={{ color: 'text.secondary', padding: '0' }}
              onClick={async () => {
                // await getDetailInfo()
                setIsDetail(!isDetail)
              }}
            >
              <IconCustom path='settingCard' icon='ContentCopy' />
              <Typography variant='body2' sx={{ textDecoration: 'none' }}>
                {isDetail ? '요약' : '상세'}
              </Typography>
            </IconButton>
            <IconButton
              disabled={readOnly}
              sx={{ color: 'text.secondary' }}
              onClick={async () => {
                kioskManager.setSelectKioskPartTypeList({ ...data, selectIndex: selectIndex })
                kioskManager.setIsKioskComponentModalOpen(true)
              }}
            >
              <IconCustom path='settingCard' icon='pen' />
              <Typography variant='body2' sx={{ textDecoration: 'none' }}>
                수정
              </Typography>
            </IconButton>

            <IconButton
              disabled={readOnly}
              sx={{ color: 'text.secondary', float: 'right' }}
              onClick={async () => {
                const result = window.confirm('정말 삭제하시겠습니까?')

                if (result && data.partList[selectIndex].id) {
                  try {
                    await kioskPartDelete({ id: data.partList[selectIndex].id })
                    refetch?.()
                  } catch (err: any) {
                    console.log(err)
                    alert(err.msg)
                  }
                }
              }}
            >
              <IconCustom path='settingCard' icon='delete' />
              <Typography variant='body2'>삭제</Typography>
            </IconButton>
          </Box>
        </Box>
      </Card>
    </>
  )
}

export default KioskComponentCard
