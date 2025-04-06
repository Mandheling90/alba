import { useQuery } from 'react-query'
import { EPath } from 'src/enum/commonEnum'
import MResult from 'src/model/commonModel'

const sampleCustomerList = [
  {
    id: 'DS001',
    name: '다인스',
    description: '다인스 설명'
  },
  {
    id: 'NA01',
    name: '국립농업박물관',
    description: '국립농업박물관 설명'
  },
  {
    id: 'PH001',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH002',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH003',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH004',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH005',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH006',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH007',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH008',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH009',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  },
  {
    id: 'PH010',
    name: '포항시청 그린웨이추진과',
    description: '포항시청 그린웨이추진과 설명'
  }
]

export interface ICustomer {
  id: string
  name: string
  description: string
}

export const useCustomerList = (keyword: string) => {
  return useQuery<MResult<ICustomer[]>>([EPath.CUSTOMER_LIST, keyword], () => {
    const filteredList = sampleCustomerList.filter(
      customer => customer.name.includes(keyword) || customer.id.includes(keyword)
    )

    return {
      code: '0',
      msg: '성공',
      data: filteredList
    }
  })
}
