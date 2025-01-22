import { useEffect, useRef, useState } from 'react'

export function useWebSocket(
  initialUrl: string,
  logErrorToServer: (errorMessage: string) => void,
  timeOut: () => void
) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [responseMessages, setResponseMessages] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [url, setUrl] = useState<string>(initialUrl)

  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 999
  const baseDelay = 5000 // 기본 딜레이 (5초)
  const isReconnecting = useRef(false)
  const reconnectStartTime = useRef<number | null>(null) // 재연결 시작 시간 저장

  const connectWebSocket = () => {
    if (socket && socket.readyState === WebSocket.OPEN) return

    try {
      const newSocket = new WebSocket(url)

      newSocket.onopen = () => {
        console.log('WebSocket 연결이 열렸습니다.')
        reconnectAttempts.current = 0
        isReconnecting.current = false
        reconnectStartTime.current = null // 연결 성공 시 재연결 시작 시간 초기화
      }

      newSocket.onmessage = event => {
        const newMessage = event.data
        setResponseMessages([newMessage])
      }

      newSocket.onerror = error => {
        const errorMessage = `WebSocket 에러가 발생했습니다. Url : ${initialUrl}`
        logErrorToServer(errorMessage)
      }

      newSocket.onclose = event => {
        const { code, reason, wasClean } = event

        if (!wasClean) {
          const errorMessage = `WebSocket 연결 종료 - 코드: ${code}, 이유: ${reason}`
          logErrorToServer(errorMessage)
          attemptReconnect()
        }
      }

      setSocket(newSocket)
    } catch (error) {
      const errorMessage = 'WebSocket 연결 중 오류 발생.'
      console.error(errorMessage, error)
      logErrorToServer(errorMessage)
      attemptReconnect()
    }
  }

  const attemptReconnect = () => {
    if (isReconnecting.current) return

    // 재연결 시작 시간을 초기화하거나 첫 번째 시도 시 기록
    if (reconnectStartTime.current === null) {
      reconnectStartTime.current = Date.now()
    }

    reconnectAttempts.current += 1

    // 연결 시도 시작 시간이 10분 이상 경과했는지 확인
    const elapsedTime = Date.now() - reconnectStartTime.current
    if (elapsedTime >= 600000) {
      // 10분 = 600,000ms
      // alert('WebSocket 재연결 시도 시간이 10분을 초과했습니다.')
      timeOut()
      reconnectStartTime.current = null // 10분 초과 후 다시 초기화
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('재연결 시도 한도를 초과했습니다.')
      isReconnecting.current = false

      return
    }

    if (!navigator.onLine) {
      logErrorToServer('네트워크 연결이 없습니다. 온라인 상태가 되면 재연결을 시도합니다.')
      isReconnecting.current = false

      return
    }

    isReconnecting.current = true
    logErrorToServer(`재연결 시도 중... (시도 횟수: ${reconnectAttempts.current}, 딜레이: ${baseDelay}ms)`)

    setTimeout(() => {
      isReconnecting.current = false
      connectWebSocket()
    }, baseDelay)
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [url])

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message) {
      socket.send(message)
      setMessage('')
    }
  }

  const updateWebSocketUrl = (newUrl: string) => {
    setUrl(newUrl)

    if (socket) {
      socket.close()
    }
  }

  return { responseMessages, message, setMessage, sendMessage, updateWebSocketUrl }
}
