// ** MUI Imports

import { Box, Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'

import { useContents } from 'src/hooks/useContents'
import { useContentsListDetail } from 'src/service/contents/contentsService'
import ContentBody from './ContentBody'

const ContentsManager: FC = () => {
  const contents = useContents()
  const selectedContent = contents.selectedContent
  const router = useRouter()
  const [status, setStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 추가
  const [isStartLoading, setIsStartLoading] = useState(false) // 로딩 상태 추가
  const { id } = router.query

  const { mutateAsync } = useContentsListDetail()

  useEffect(() => {
    setContentsData()
  }, [])

  const setContentsData = async () => {
    const isNonEmptyObject = selectedContent && Object.keys(selectedContent).length > 0

    // 새로고침시
    if (id && !isNonEmptyObject) {
      setIsStartLoading(true)
      const res = await mutateAsync(Number(id))

      if (res.data) {
        contents.setSelectedContent(res.data)
        setIsStartLoading(false)
      }
      setStatus(true)
    } else {
      setStatus(isNonEmptyObject)
    }
  }

  const handleUpsert = async () => {
    setIsLoading(true) // 로딩 시작
    try {
      await contents.contentsUpsert({ ...selectedContent }, !status, errorCallback => {
        alert(errorCallback.message)
      })
      alert(`${status ? '홍보물 수정' : '홍보물 등록'}에 성공했습니다.`)
      router.back()
    } catch (error) {
      console.error('An error occurred during the upsert operation:', error)
    } finally {
      setIsLoading(false) // 로딩 종료
    }
  }

  return (
    <StandardTemplate title={`홍보물 관리 | ${status ? '홍보물 수정' : '홍보물 등록'}`}>
      <Grid container>
        <Grid xs={12} item>
          {isStartLoading ? <></> : <ContentBody />}
        </Grid>
        <Grid xs={12} item>
          <Box gap={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 4.5 }}>
            <Button
              variant='contained'
              color={'primary'} // 로딩 중일 때 버튼 색상 회색으로
              disabled={isLoading} // 로딩 중 버튼 비활성화
              onClick={handleUpsert}
            >
              {status ? '수정' : '홍보물 등록'}
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                contents.setSelectedContent({})
                router.back()
              }}
              disabled={isLoading} // 로딩 중 취소 버튼도 비활성화
            >
              {status ? '수정' : '등록'} 취소
            </Button>
          </Box>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default ContentsManager
