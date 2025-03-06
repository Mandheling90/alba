import { useQuery } from 'react-query'
import { EPath } from 'src/enum/contentsEnum'
import { MCameraClient } from 'src/model/cameras/CamerasModel'
import MResult from 'src/model/commonModel'
import { MContentReq } from 'src/model/contents/contentsModel'

export const sampeCameraClientList: MCameraClient[] = [
  {
    id: 1,
    clientId: 'TS001',
    clientNm: 'test'
  },
  {
    id: 2,
    clientId: 'TS002',
    clientNm: 'test2'
  },
  {
    id: 3,
    clientId: 'TS003',
    clientNm: 'test3'
  },
  {
    id: 4,
    clientId: 'TS004',
    clientNm: 'test4'
  },
  {
    id: 5,
    clientId: 'TS005',
    clientNm: 'test5'
  },
  {
    id: 6,
    clientId: 'TS006',
    clientNm: 'test6'
  },
  {
    id: 7,
    clientId: 'TS007',
    clientNm: 'test7'
  },
  {
    id: 8,
    clientId: 'TS008',
    clientNm: 'test8'
  }
]

export const useCameraClientList = (req: MContentReq) => {
  //return useQuery<MResult<MCameraClient[]>>([EPath.CONTENTS, req], {})
  return useQuery<MResult<MCameraClient[]>>([EPath.CONTENTS, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampeCameraClientList
    })
  })
}
