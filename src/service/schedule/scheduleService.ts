import { useMutation, useQuery } from 'react-query'
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
const sampleGateList = [
  {
    id: 'NA01001',
    name: '교육동2층 입구',
    description: '교육동2층 입구'
  },
  {
    id: 'NA01002',
    name: '식물원 입구',
    description: '식물원 입구'
  },
  {
    id: 'NA01003',
    name: '어린이박물관',
    description: '어린이박물관'
  },
  {
    id: 'NA01004',
    name: '농업관 01',
    description: '농업관 01'
  },
  {
    id: 'NA01005',
    name: '농업관 02',
    description: '농업관 02'
  },
  {
    id: 'NA01006',
    name: '농업관 03',
    description: '농업관 03'
  }
]
export interface IGate {
  id: string
  name: string
  description: string
}

export const useGateList = () => {
  return useQuery<MResult<IGate[]>>([EPath.GATE_LIST], () => {
    return {
      code: '0',
      msg: '성공',
      data: sampleGateList
    }
  })
}

export type WorkType = 'work' | 'holiday'

interface IWorkTime {
  workType?: WorkType
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}
export interface IScheduleBatchConfig {
  gateIds: string[]
  days: string[]
  repeatPeriod?: IWorkTime
  specialPeriod?: IWorkTime
}

export const useScheduleBatchConfig = () => {
  return useMutation((params: IScheduleBatchConfig) => {
    return new Promise((resolve, reject) => {
      resolve({
        code: '0',
        msg: '성공',
        data: []
      })
    })
  }, {})
}

export const useScheduleUpdate = () => {
  const setSchedule = ({
    customerId,
    gateId,
    scheduleDate,
    scheduleList
  }: {
    customerId: string
    gateId: string
    scheduleDate: string
    scheduleList: Omit<IWorkTime, 'startDate' | 'endDate'>[]
  }) => {
    return new Promise(resolve => {
      resolve({
        code: '0',
        msg: '성공',
        data: []
      })
    })
  }

  return useMutation(setSchedule)
}
