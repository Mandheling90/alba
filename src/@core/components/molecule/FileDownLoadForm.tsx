import { Box } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ILoginTemplate {
  label: string
}

const FileDownLoadForm: React.FC<ILoginTemplate> = ({ label }) => {
  const handleManualDownload = () => {
    const fileUrl = `${process.env.NEXT_PUBLIC_IMAGE_PATH}images/common/login/DSInsightHeader.svg`
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'DSInsightHeader.svg' // 다운로드될 파일명
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer', // 커서 스타일 추가
        '&:hover': {
          // 호버 효과 추가
          opacity: 0.8
        }
      }}
      onClick={handleManualDownload}
    >
      <IconCustom isCommon icon='downLoad' /> {label}
    </Box>
  )
}

export default FileDownLoadForm
