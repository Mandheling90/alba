import { Box, Typography } from '@mui/material'
import React, { useContext } from 'react'
import CustomAccordion from 'src/@core/components/atom/CustomAccordion'
import { CamerasContext } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList, MClientGroupCameraList } from 'src/model/cameras/CamerasModel'

const CameraSelecter: React.FC = ({}) => {
  const { clientCameraData, clientGroupCameraData, setSelectedCamera, removeDuplicateCameras } =
    useContext(CamerasContext)

  return (
    <Box sx={{ position: 'absolute', width: '300px', zIndex: 9, m: 3 }}>
      <CustomAccordion
        key={'all'}
        id={0}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCustom isCommon path='camera' icon='cameraAllView' />
            <Typography>전체</Typography>
          </Box>
        }
        expanded={false}
        onClick={() => {
          // setSelectedCamera(clientCameraData?.cameraList || null)
        }}
      />

      {removeDuplicateCameras()?.map((camera: MClientCameraList) => (
        <CustomAccordion
          key={camera.cameraNo}
          id={camera.cameraNo}
          title={camera.cameraName}
          expanded={false}
          onClick={() => setSelectedCamera([camera])}
        />
      ))}

      {clientGroupCameraData?.map((group: MClientGroupCameraList) => (
        <CustomAccordion
          key={group.groupId}
          id={group.groupId}
          title={group.name}
          onClick={() => {
            // setSelectedCamera(clientCameraData?.cameraList.filter(c => c.groupId === group.id))
          }}
          AccordionDetails={group.groupItemList.map((camera: MClientCameraList) => (
            <Box
              key={camera.cameraNo}
              onClick={() => setSelectedCamera([camera])}
              sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '48px',
                height: '48px',
                pl: 10,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(145, 85, 253, 0.1)'
                }
              }}
            >
              <Typography>{camera.cameraName}</Typography>
            </Box>
          ))}
        />
      ))}
    </Box>
  )
}

export default CameraSelecter
