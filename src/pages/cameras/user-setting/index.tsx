import { FC } from 'react'
import { CamerasProvider } from 'src/context/CamerasContext'
import { TableProvider } from 'src/context/TableContext'
import CameraUserSetting from './CameraUserSetting'

const Index: FC = ({}): React.ReactElement => {
  return (
    <CamerasProvider>
      <TableProvider>
        <CameraUserSetting />
      </TableProvider>
    </CamerasProvider>
  )
}

export default Index
