import { Box, Typography } from '@mui/material'
import { ReactNode, useState } from 'react'

// import { useSocketData } from 'src/hooks/useSocketData'
import IconCustom from 'src/layouts/components/IconCustom'
import { useSaveLog } from 'src/service/commonService'
import SimpleDialogModal from '../components/molecule/SimpleDialogModal'

interface Props {
  children: ReactNode
}

const SoketComponent = (props: Props) => {
  const { children } = props

  // 키오스크 에러여부 체크 소캣 통신
  // const socketData = useSocketData()
  const { mutateAsync: saveLog } = useSaveLog()

  const [errorOpen, setErrorOpen] = useState(false)

  const logErrorToServer = async (errorMessage: string) => {
    try {
      console.log(errorMessage)
      saveLog(errorMessage)
      console.log('에러 로그가 서버에 전송되었습니다.')
    } catch (error) {
      console.error('에러 로그 전송 중 오류 발생:', error)
    }
  }

  const timeOut = async () => {
    if (!errorOpen) {
      setErrorOpen(true)
    }
  }

  // const { responseMessages } = useWebSocket(EPath.KIOSK_HEALTH_CHECK, logErrorToServer, timeOut) // 서버 주소로 변경
  // const { responseMessages: monitoringRes } = useWebSocket(EPath.KIOSK_MONITORING_CHECK, logErrorToServer, timeOut) // 서버 주소로 변경

  // useEffect(() => {
  //   if (responseMessages[0]) {
  //     const arrayObject = JSON.parse(responseMessages[0])

  //     if (JSON.stringify(socketData.kioskHealth) !== JSON.stringify(arrayObject)) {
  //       socketData.setKioskHealth(arrayObject)
  //       socketData.setKioskHealthErrorCount(arrayObject.length)
  //     }
  //   }
  // }, [responseMessages])

  // useEffect(() => {
  //   if (monitoringRes[0]) {
  //     const arrayObject = addErrorFlag(JSON.parse(monitoringRes[0]))

  //     if (JSON.stringify(socketData.monitoringHealth) !== JSON.stringify(arrayObject.data)) {
  //       console.log(arrayObject.data)

  //       socketData.setMonitoringHealth(arrayObject.data)
  //       socketData.setMonitoringHealthErrorCount(arrayObject.errCount)
  //     } else {
  //       console.log('same!')
  //     }
  //   }
  // }, [monitoringRes])

  return (
    <>
      <SimpleDialogModal
        open={errorOpen}
        onClose={() => {
          setErrorOpen(false)
        }}
        contentsHtml={
          <Box sx={{ padding: '10px 60px' }}>
            <IconCustom
              isCommon
              icon='accent-modal'
              style={{
                position: 'absolute',
                top: '50px',
                left: '25px',
                width: '50px'
              }}
            />

            <Typography
              id='modal-description'
              sx={{ mt: 2, color: 'rgba(58, 53, 65, 0.6)', fontSize: 16, fontWeight: 400 }}
            >
              관리 서버와의 통신이 원활하지 않거나 시스템 오류로 인해 키오스크 상태가 최신으로 업데이트되지 않았습니다.{' '}
              <br />
              <br />
              시스템 모니터링 기능을 통해 자동으로 해결될 수 있으나, 문제가 계속될 경우 서버 오류 코드를 확인하여
              수동으로 문제를 해결해야 할 수도 있습니다.
            </Typography>
          </Box>
        }
      ></SimpleDialogModal>

      {children}
    </>
  )
}

export default SoketComponent
