// ** MUI Imports

import { Box, Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'

const KioskAreaSetting: FC = () => {
  const router = useRouter()
  const { ip } = router.query
  const kioskIp = ip as string

  // iframe 높이를 상태로 저장
  const [iframeHeight, setIframeHeight] = useState<string>('500px')

  useEffect(() => {
    // 브라우저 창의 높이를 가져와서 iframe 높이로 설정
    const handleResize = () => {
      setIframeHeight(`${window.innerHeight - 200}px`)
    }

    // 컴포넌트가 처음 마운트될 때와 창 크기가 변경될 때마다 높이를 조정
    handleResize() // 처음 로드될 때 높이 설정
    window.addEventListener('resize', handleResize)

    // 이벤트 리스너 정리
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <StandardTemplate title={`모니터링영역설정`}>
      <Grid container>
        {/* 아이프레임을 위한 그리드 */}
        <Grid xs={12} item>
          <iframe
            src={`http://${kioskIp}`}
            width='100%'
            height={iframeHeight} // 동적으로 설정된 높이 사용
            style={{ border: 'none' }}
            title='Monitoring Area'
          />
        </Grid>

        <Grid xs={12} item>
          <Box gap={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 3 }}>
            <Button
              variant='contained'
              onClick={() => {
                router.back()
              }}
            >
              확인
            </Button>
          </Box>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default KioskAreaSetting
