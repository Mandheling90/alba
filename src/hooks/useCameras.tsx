import { useContext } from 'react'
import { CamerasContext } from 'src/context/CamerasContext'

export const useCameras = (cameraContext: any) => useContext(CamerasContext)
