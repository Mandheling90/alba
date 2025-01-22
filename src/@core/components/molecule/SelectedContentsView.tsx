import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import { CONTENTS_TYPE } from 'src/enum/contentsEnum'
import CardVideoPlayer, { CardVideoPlayerHandle } from '../atom/CardVideoPlayer'
import CompactCard from '../atom/CompactCard'
import ImageModal from '../atom/ImageModal'

interface ISelectedContentsView {
  title: string
  filePath?: string
  contentsTypeId?: CONTENTS_TYPE
}

const SelectedContentsView: React.FC<ISelectedContentsView> = ({ title, filePath, contentsTypeId }) => {
  const videoPlayerRef = useRef<CardVideoPlayerHandle>(null)
  const [imgModalOpen, setImgModalOpen] = useState(false)

  return (
    <>
      {contentsTypeId === CONTENTS_TYPE.IMAGE && (
        <ImageModal open={imgModalOpen} onClose={() => setImgModalOpen(false)} imageUrl={filePath ?? ''} />
      )}

      <CompactCard
        title={title}
        useAction={filePath ? true : false}
        onAction={() => {
          if (contentsTypeId === CONTENTS_TYPE.VIDEO) {
            if (videoPlayerRef.current) {
              videoPlayerRef.current.enterFullscreen()
            }
          } else {
            setImgModalOpen(true)
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          {filePath ? (
            contentsTypeId === CONTENTS_TYPE.VIDEO ? (
              <CardVideoPlayer ref={videoPlayerRef} src={filePath ?? ''} />
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <img style={{ width: '100%' }} src={filePath} alt='홍보 이미지' />
              </Box>
            )
          ) : (
            <></>
          )}
        </Box>
      </CompactCard>
    </>
  )
}

export default SelectedContentsView
