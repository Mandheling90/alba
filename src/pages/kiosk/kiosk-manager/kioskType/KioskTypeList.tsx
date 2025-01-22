import { FC, useState } from 'react'
import { MKioskType } from 'src/model/kiosk/kioskModel'
import KioskTypeCard from '../../kiosk-contents-manager/KioskTypeCard'
import KioskComponent from '../kioskComponent/KioskComponent'

interface IRolesCards {
  data: MKioskType[]
  refetch: () => void
}

const KioskTypeList: FC<IRolesCards> = ({ data, refetch }) => {
  const [isAddMod, setIsAddMod] = useState(false)

  // 구성품 리스트만 가져오는 API가 없어서 임시로 0번째의 데이터를 사용..
  const tempData: MKioskType = data[0]

  return (
    <KioskComponent
      scrollText='키오스크 타입 목록'
      onAdd={() => {
        setIsAddMod(true)
      }}
      height='500px'
    >
      {isAddMod && (
        <KioskTypeCard
          kioskTypeData={{
            id: 0,
            name: '',
            dataStatus: 'Y',
            kioskCount: 0,
            partList: tempData.partList.map(item => ({
              ...item,
              isUsed: false,
              quantity: 1
            }))
          }}
          isAddMod
          refetch={() => {
            setIsAddMod(false)
            refetch()
          }}
          onDelete={() => {
            setIsAddMod(false)
          }}
        />
      )}

      {data.map(item => (
        <KioskTypeCard key={item.id} kioskTypeData={item} refetch={refetch} />
      ))}
    </KioskComponent>
  )
}

export default KioskTypeList
