import { useQuery } from 'react-query'
import { EPath } from 'src/enum/camerasEnum'
import { ICameraClientReq, MClientCameraList } from 'src/model/cameras/CamerasModel'
import { SERVICE_TYPE } from 'src/model/client/clientModel'
import MResult from 'src/model/commonModel'

export const sampeCameraClientDetailList: MClientCameraList = {
  cameraList: [
    {
      id: 1,
      cameraId: '1',
      cameraName: '테스트',
      serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.CAR_COUNT],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 10.5654,
        y: 33.450701
      },
      groupId: null
    },
    {
      id: 2,
      cameraId: '2',
      cameraName: '북문 엘레베이터 ',
      serviceTypes: [SERVICE_TYPE.MONITORING],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 10.5654,
        y: 20.450701
      },
      groupId: null
    },
    {
      id: 3,
      cameraId: '3',
      cameraName: '교육동 1층 출입구 우측',
      serviceTypes: [SERVICE_TYPE.MONITORING],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 60.5654,
        y: 23.450701
      },
      groupId: null
    },
    {
      id: 4,
      cameraId: '4',
      cameraName: '교육동 1층 출입구 우측',
      serviceTypes: [SERVICE_TYPE.MONITORING],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 80.5654,
        y: 13.450701
      },
      groupId: 1
    },
    {
      id: 6,
      cameraId: '6',
      cameraName: '교육동 1층 출입구 우측',
      serviceTypes: [SERVICE_TYPE.MONITORING],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 20.5654,
        y: 63.450701
      },
      groupId: 1
    },
    {
      id: 5,
      cameraId: '5',
      cameraName: '교육동 1층 출입구 우측',
      serviceTypes: [SERVICE_TYPE.MONITORING],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 10.5654,
        y: 33.450701
      },
      groupId: 2
    },
    {
      id: 7,
      cameraId: '7',
      cameraName: '교육동 1층 출입구 우측',
      serviceTypes: [SERVICE_TYPE.MONITORING],
      isUse: true,

      // zonePoints: {
      //   lat: 37.517997924982076,
      //   lon: 127.0267860525248
      // },
      markers: {
        x: 50.5654,
        y: 10.450701
      },
      groupId: 2
    }
  ],
  groupList: [
    {
      id: 1,
      groupName: '그룹1'
    },
    {
      id: 2,
      groupName: '그룹2'
    }
  ]

  // floorPlan: {
  //   floorPlanImageUrl: '/images/sample.png',
  //   zonePoints: {
  //     lat: 37.517997924982076,
  //     lon: 127.0267860525248
  //   }
  // }
}

export const useClientCameraList = (req: ICameraClientReq) => {
  //return useQuery<MResult<MCameraClient[]>>([EPath.CONTENTS, req], {})
  return useQuery<MResult<MClientCameraList>>([EPath.CAMERAS_CLIENT, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampeCameraClientDetailList
    })
  })
}
