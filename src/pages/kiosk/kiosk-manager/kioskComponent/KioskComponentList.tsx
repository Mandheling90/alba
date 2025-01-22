import { FC } from 'react'
import { useKioskManager } from 'src/hooks/useKioskManager'
import { MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'
import KioskComponent from './KioskComponent'
import KioskComponentCard from './KioskComponentCard'

interface IRolesCards {
  data: MKioskPartTypeList[]
  refetch: () => void
}

const KioskComponentList: FC<IRolesCards> = ({ data, refetch }) => {
  const kioskManager = useKioskManager()

  return (
    <KioskComponent
      scrollText='키오스크 구성품 목록'
      onAdd={() => {
        kioskManager.setIsKioskComponentModalOpen(true)
      }}
      height='360px'
    >
      {data.map(item => (
        <KioskComponentCard data={item} key={item.id} refetch={refetch} />
      ))}
    </KioskComponent>
  )
}

export default KioskComponentList
