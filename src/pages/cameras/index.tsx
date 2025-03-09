import { FC } from 'react'
import { CamerasProvider } from 'src/context/CamerasContext'
import Cameras from './Cameras'

const Index: FC = ({}): React.ReactElement => {
  return (
    <CamerasProvider>
      <Cameras />
    </CamerasProvider>
  )
}

export default Index
