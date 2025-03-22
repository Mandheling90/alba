import { useQuery } from 'react-query'
import { EPath } from 'src/enum/camerasEnum'
import { ICameraClientReq, ICameraList } from 'src/model/cameras/CamerasModel'
import { SERVICE_TYPE } from 'src/model/client/clientModel'
import MResult from 'src/model/commonModel'

export const sampeCameraClientDetailList: ICameraList[] = [
  {
    cameraId: '1',
    cameraName: '테스트',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.CAR_COUNT],
    isUse: true,
    zonePoints: {
      lat: 33.450701,
      lon: 126.5654
    }
  },
  {
    cameraId: '2',
    cameraName: '북문 엘레베이터 ',
    serviceTypes: [SERVICE_TYPE.MONITORING],
    isUse: true,
    zonePoints: {
      lat: 37.2759369002521,
      lon: 126.981901924188
    }
  },
  {
    cameraId: '3',
    cameraName: '교육동 1층 출입구 우측',
    serviceTypes: [SERVICE_TYPE.MONITORING],
    isUse: true,
    zonePoints: {
      lat: 37.27575984256296,
      lon: 126.98188054344705
    }
  }
]

export const useCameraClientList = (req: ICameraClientReq) => {
  //return useQuery<MResult<MCameraClient[]>>([EPath.CONTENTS, req], {})
  return useQuery<MResult<ICameraList[]>>([EPath.CAMERAS_CLIENT, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampeCameraClientDetailList
    })
  })
}

// export const useCameraClientDetailList = (req: ICameraClientDetailReq) => {
//   const isValidReq = !!req.clientId

//   //return useQuery<MResult<MCameraClientDetail[]>>([EPath.CONTENTS, req], {})
//   return useQuery<MResult<ICameraList[]>>(
//     [EPath.CAMERAS_CLIENT_DETAIL, req],
//     () => {
//       return Promise.resolve({
//         code: '0',
//         msg: '성공',
//         data: sampeCameraClientDetailList
//       })
//     },
//     {
//       enabled: isValidReq
//     }
//   )
// }
