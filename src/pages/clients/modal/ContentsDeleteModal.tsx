import { Box, Button, Checkbox, Dialog, FormControlLabel, IconButton, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import { ScrollCustomDiv } from 'src/@core/components/atom/ScrollCustom'
import DialogCustomContent from 'src/@core/components/molecule/DialogCustomContent'
import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import { useContents } from 'src/hooks/useContents'
import IconCustom from 'src/layouts/components/IconCustom'
import { IKioskContent, MContentsDeleteReq, MKioskContentList } from 'src/model/contents/contentsModel'

import { useContentsDelete, useListKiosksByContent } from 'src/service/contents/contentsService'

interface ModalProps {
  open: boolean
  onClose: () => void
}

const processKiosks = (
  kiosks: MKioskContentList[],
  selectedKiosks: { [key: number]: boolean }
): MContentsDeleteReq[] => {
  const resultMap: { [contentsId: number]: number[] } = {}

  kiosks.forEach(kiosk => {
    if (selectedKiosks[kiosk.kioskId]) {
      kiosk.contentsList.forEach(content => {
        if (!resultMap[content.contentsId]) {
          resultMap[content.contentsId] = []
        }
        resultMap[content.contentsId].push(kiosk.kioskId)
      })
    }
  })

  return Object.keys(resultMap).map(contentsId => ({
    id: Number(contentsId),
    kioskIdList: resultMap[Number(contentsId)]
  }))
}

const ContentsDeleteModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const contents = useContents()

  const { data, refetch } = useListKiosksByContent(contents.selectedContentIds)
  const { mutateAsync: contentsDelete } = useContentsDelete()

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isDeleteAllContentOpen, setIsDeleteAllContentOpen] = useState(false)
  const [deleteAllContentModalInfo, setDeleteAllContentModalInfo] = useState({ buttonText: '', contents: '', step: 0 })

  // const [selectedContent, setSelectedContent] = useState<number>()
  const [selectedContent, setSelectedContent] = useState<IKioskContent & { kioskName: string; kioskId: number }>()

  const [checkboxStates, setCheckboxStates] = useState<Record<number, boolean>>({})

  const handleCheckboxChange = (id: number) => {
    setCheckboxStates(prevStates => ({
      ...prevStates,
      [id]: !prevStates[id]
    }))
  }

  useEffect(() => {
    if (data?.data?.length === 0) {
      setIsDeleteAllContentOpen(true)
      setDeleteAllContentModalInfo({
        buttonText: '확인',
        contents: '선택하신 모든 컨텐츠가 관리서버에서 삭제되었습니다.',
        step: 2
      })
    } else if (data?.data) {
      const initialCheckboxStates = data.data.reduce<Record<number, boolean>>((acc, item) => {
        acc[item.kioskId] = true

        return acc
      }, {})
      setCheckboxStates(initialCheckboxStates)
    }
  }, [data])

  return (
    <>
      <SimpleDialogModal
        open={isDeleteConfirmOpen}
        onConfirm={async () => {
          if (selectedContent?.contentsId && selectedContent.kioskId) {
            await contentsDelete([{ id: selectedContent?.contentsId, kioskIdList: [selectedContent?.kioskId] }])
            refetch()
          }
          setIsDeleteConfirmOpen(false)
        }}
        onClose={() => {
          setIsDeleteConfirmOpen(false)
        }}
        contents={`${selectedContent?.kioskName}에 있는 ${selectedContent?.contentsName} 컨텐츠를 삭제하시겠습니까? 삭제된 컨텐츠는 복원할 수 없습니다.`}
        isConfirm
      ></SimpleDialogModal>

      <SimpleDialogModal
        open={isDeleteAllContentOpen}
        onClose={() => {
          setIsDeleteAllContentOpen(false)
        }}
        onConfirm={async () => {
          if (deleteAllContentModalInfo.step === 1) {
            await contentsDelete(processKiosks(data?.data ?? [], checkboxStates))
            refetch()
          }

          if (deleteAllContentModalInfo.step === 2) {
            setIsDeleteAllContentOpen(false)

            if (data?.data?.length === 0) {
              onClose()
            }

            // 모든 컨텐츠를 삭제한 경우 id만 지정해서 다시 삭제 api를 요청해달라고 요청받음..
            await contentsDelete(
              contents.selectedContentIds.map(contentsId => ({
                id: Number(contentsId),
                kioskIdList: []
              }))
            )
            refetch()
          }

          setDeleteAllContentModalInfo({
            buttonText: '확인',
            contents: '선택하신 모든 컨텐츠가 관리서버에서 삭제되었습니다.',
            step: 2
          })
        }}
        buttonText={deleteAllContentModalInfo.buttonText}
        contents={deleteAllContentModalInfo.contents}
      ></SimpleDialogModal>

      <Dialog
        fullWidth
        maxWidth='sm'
        scroll='body'
        onClose={() => {
          onClose()
        }}
        open={open}
      >
        <DialogCustomContent
          onClose={() => {
            onClose()
          }}
        >
          <Typography id='modal-title' variant='body2' component='h2'>
            삭제 요청하신 컨텐츠는 현재 다음 키오스크에서 사용 중입니다. 각 키오스크에서 해당 컨텐츠를 먼저 삭제한 후,
            컨텐츠 삭제를 진행해 주세요.
          </Typography>
          <Box
            sx={{
              mt: 8,
              border: '1px solid rgba(138, 141, 147, 1)',
              borderRadius: '5px',
              background: 'rgba(255, 255, 255, 0.88)',
              backgroundColor: grey[100]
            }}
          >
            <Box sx={{ m: 3 }}>
              <ScrollCustomDiv
                $scrollbarVisible
                $isboder
                boderColor={'rgba(189, 189, 189, 1)'}
                $maxHeight={400}
                scrollbarColor={'rgba(205, 201, 201, 1)'}
              >
                {data?.data?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      m: 3,
                      pb: 4
                    }}
                  >
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={item.kioskId}
                            onChange={() => handleCheckboxChange(item.kioskId)}
                            checked={checkboxStates[item.kioskId] || false}
                            sx={{
                              padding: '4px'
                            }}
                          />
                        }
                        label={
                          <Typography variant='body1' fontWeight={600}>
                            {item.kioskName}
                          </Typography>
                        }
                        sx={{
                          margin: 0,
                          padding: '2px 0',
                          minHeight: '32px',
                          '.MuiFormControlLabel-label': {
                            fontSize: '0.85rem',
                            lineHeight: '1.2'
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      {item.contentsList.map((contentsList, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography variant='body1' fontWeight={600}>
                            {contentsList.contentsName}
                          </Typography>
                          <IconButton
                            onClick={() => {
                              setSelectedContent({ ...contentsList, kioskName: item.kioskName, kioskId: item.kioskId })
                              setIsDeleteConfirmOpen(true)
                            }}
                          >
                            <IconCustom path='contents' icon='DeleteOutline' style={{ width: '18px' }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )) || null}
              </ScrollCustomDiv>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 3, mt: 5, mb: 5 }}>
              <Button
                variant='contained'
                onClick={() => {
                  setDeleteAllContentModalInfo({
                    buttonText: '관리서버내 선택 컨텐츠 삭제',
                    contents: `선택하신 키오스크내 해당 컨텐츠가 삭제되었습니다. \n 관리 서버에서도 해당 컨텐츠를 모두 삭제하시겠습니까? \n\n 삭제된 컨텐츠는 복원할 수 없습니다`,
                    step: 1
                  })
                  setIsDeleteAllContentOpen(true)
                }}
                size='small'
              >
                선택 키오스크 내 컨텐츠 일괄 삭제
              </Button>
            </Box>
          </Box>
        </DialogCustomContent>
      </Dialog>
    </>
  )
}

export default ContentsDeleteModal
