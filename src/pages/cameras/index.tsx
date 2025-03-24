import { FC } from 'react'
import { CamerasProvider } from 'src/context/CamerasContext'
import { TableProvider } from 'src/context/TableContext'
import Cameras from './Cameras'

const Index: FC = ({}): React.ReactElement => {
  return (
    <CamerasProvider>
      <TableProvider>
        <Cameras />
      </TableProvider>
    </CamerasProvider>
  )
}

export default Index
