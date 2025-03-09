import { useQuery } from 'react-query'
import { EPath } from 'src/enum/camerasEnum'
import {
  ICameraClient,
  ICameraClientDetail,
  ICameraClientDetailReq,
  ICameraClientReq
} from 'src/model/cameras/CamerasModel'
import MResult from 'src/model/commonModel'

export const sampeCameraClientList: ICameraClient[] = [
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

export const sampeCameraClientDetailList: ICameraClientDetail[] = [
  {
    id: 1,
    cameraLabel: '테스트',
    zonePoints: {
      lat: 33.450701,
      lon: 126.5654
    }
  },
  {
    id: 2,
    cameraLabel: '북문 엘레베이터 ',
    zonePoints: {
      lat: 37.2759369002521,
      lon: 126.981901924188
    }
  },
  {
    id: 3,
    cameraLabel: '교육동 1층 출입구 우측',
    zonePoints: {
      lat: 37.27575984256296,
      lon: 126.98188054344705
    }
  }
]

export const useCameraClientList = (req: ICameraClientReq) => {
  //return useQuery<MResult<MCameraClient[]>>([EPath.CONTENTS, req], {})
  return useQuery<MResult<ICameraClient[]>>([EPath.CAMERAS_CLIENT, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampeCameraClientList
    })
  })
}

export const useCameraClientDetailList = (req: ICameraClientDetailReq) => {
  const isValidReq = !!req.clientId

  //return useQuery<MResult<MCameraClientDetail[]>>([EPath.CONTENTS, req], {})
  return useQuery<MResult<ICameraClientDetail[]>>(
    [EPath.CAMERAS_CLIENT_DETAIL, req],
    () => {
      return Promise.resolve({
        code: '0',
        msg: '성공',
        data: sampeCameraClientDetailList
      })
    },
    {
      enabled: isValidReq
    }
  )
}
