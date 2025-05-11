import { Box, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ILoginTemplate {
  label: string
}

const FileDownLoadForm: React.FC<ILoginTemplate> = ({ label }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleManualDownload = async () => {
    try {
      setIsLoading(true)
      const fileUrl = `${process.env.NEXT_PUBLIC_API_HOST}/file/download/manual`

      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      })

      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.')
      }

      // Content-Disposition 헤더에서 파일명 추출 시도
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'Dains_Manual.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = downloadUrl
      link.download = filename

      document.body.appendChild(link)
      link.click()

      // 클린업
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(link)
    } catch (error) {
      console.error('다운로드 에러:', error)
      alert('파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: isLoading ? 'wait' : 'pointer',
        '&:hover': {
          opacity: 0.8
        }
      }}
      onClick={!isLoading ? handleManualDownload : undefined}
    >
      {isLoading ? <CircularProgress size={24} /> : <IconCustom isCommon icon='downLoad' />}
      {label}
    </Box>
  )
}

export default FileDownLoadForm
