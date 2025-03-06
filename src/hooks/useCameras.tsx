import { useContext } from 'react'
import { CamerasContext } from 'src/context/CamerasContext'

export const useCameras = () => useContext(CamerasContext)
