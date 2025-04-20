import { Box, Typography } from '@mui/material'
import React, { useContext } from 'react'
import CustomAccordion from 'src/@core/components/atom/CustomAccordion'
import { CamerasContext } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'

const CameraSelecter: React.FC = ({}) => {
  const { clientCameraData, setSelectedCamera } = useContext(CamerasContext)

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

      {/* {clientCameraData?.cameraList
        .filter((camera: MCameraList) => camera.groupId === null)
        .map((camera: MCameraList) => (
          <CustomAccordion
            key={camera.id}
            id={camera.id}
            title={camera.cameraName}
            expanded={false}
            onClick={() => setSelectedCamera([camera])}
          />
        ))} */}

      {/* {clientCameraData?.groupList.map((group: MGroupList) => (
        <CustomAccordion
          key={group.id}
          id={group.id}
          title={group.groupName}
          onClick={() => setSelectedCamera(clientCameraData?.cameraList.filter(c => c.groupId === group.id))}
          AccordionDetails={clientCameraData?.cameraList
            .filter((camera: MCameraList) => camera.groupId === group.id)
            .map((camera: MCameraList) => (
              <Box
                key={camera.id}
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
      ))} */}
    </Box>
  )
}

export default CameraSelecter
