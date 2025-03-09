import { FC } from 'react'
import { UserProvider } from 'src/context/UserContext'
import UserSetting from './UserSetting'

const Index: FC = ({}): React.ReactElement => {
  return (
    <UserProvider>
      <UserSetting />
    </UserProvider>
  )
}

export default Index
