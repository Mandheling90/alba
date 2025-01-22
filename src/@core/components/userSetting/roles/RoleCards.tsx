// ** React Imports
import { FC, useState } from 'react'

// ** Next Import

// ** MUI Imports

// ** Icon Imports
import { MUserGroup } from 'src/model/userSetting/userSettingModel'
import KioskComponent from 'src/pages/kiosk/kiosk-manager/kioskComponent/KioskComponent'
import RoleAddModModal from '../modal/RoleAddModModal'
import RenderCards from './RenderCards'

const rolesArr: string[] = [
  'User Management',
  'Content Management',
  'Disputes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll'
]

interface IRolesCards {
  refetch: () => void
  data: MUserGroup[]
}

const RolesCards: FC<IRolesCards> = ({ data, refetch }) => {
  const [isRoleAddopen, setIsRoleAddopen] = useState<boolean>(false)

  return (
    <>
      <KioskComponent
        scrollText='시스템 접속 권한 목록'
        onAdd={() => {
          setIsRoleAddopen(true)
        }}
        height='360px'
      >
        {data.map(item => (
          <RenderCards data={item} key={item.id} refetch={refetch} />
        ))}
      </KioskComponent>

      {isRoleAddopen && (
        <RoleAddModModal
          isOpen={isRoleAddopen}
          onClose={() => {
            setIsRoleAddopen(false)
          }}
          refetch={refetch}
        />
      )}
    </>
  )
}

export default RolesCards
