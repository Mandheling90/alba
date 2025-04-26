import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/camerasEnum'
import { YN } from 'src/enum/commonEnum'
import { MClientCameraList, MClientGroupCameraList, MFlowPlan, MFlowPlanUpdate } from 'src/model/cameras/CamerasModel'
import MResult from 'src/model/commonModel'
import {
  createDelete,
  createFilePatch,
  createFilePost,
  createGet,
  createPatch,
  createPost,
  createPut
} from 'src/module/reactQuery'

// export const sampeCameraClientDetailList: MClientCameraList = {
//   cameraList: [
//     {
//       id: 1,
//       cameraId: '1',
//       cameraName: '테스트',
//       serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.CAR_COUNT],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 10.5654,
//         y: 33.450701
//       },
//       groupId: null
//     },
//     {
//       id: 2,
//       cameraId: '2',
//       cameraName: '북문 엘레베이터 ',
//       serviceTypes: [SERVICE_TYPE.MONITORING],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 10.5654,
//         y: 20.450701
//       },
//       groupId: null
//     },
//     {
//       id: 3,
//       cameraId: '3',
//       cameraName: '교육동 1층 출입구 우측',
//       serviceTypes: [SERVICE_TYPE.MONITORING],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 60.5654,
//         y: 23.450701
//       },
//       groupId: null
//     },
//     {
//       id: 4,
//       cameraId: '4',
//       cameraName: '교육동 1층 출입구 우측',
//       serviceTypes: [SERVICE_TYPE.MONITORING],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 80.5654,
//         y: 13.450701
//       },
//       groupId: 1
//     },
//     {
//       id: 6,
//       cameraId: '6',
//       cameraName: '교육동 1층 출입구 우측',
//       serviceTypes: [SERVICE_TYPE.MONITORING],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 20.5654,
//         y: 63.450701
//       },
//       groupId: 1
//     },
//     {
//       id: 5,
//       cameraId: '5',
//       cameraName: '교육동 1층 출입구 우측',
//       serviceTypes: [SERVICE_TYPE.MONITORING],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 10.5654,
//         y: 33.450701
//       },
//       groupId: 2
//     },
//     {
//       id: 7,
//       cameraId: '7',
//       cameraName: '교육동 1층 출입구 우측',
//       serviceTypes: [SERVICE_TYPE.MONITORING],
//       isUse: true,

//       // zonePoints: {
//       //   lat: 37.517997924982076,
//       //   lon: 127.0267860525248
//       // },
//       markers: {
//         x: 50.5654,
//         y: 10.450701
//       },
//       groupId: 2
//     }
//   ],
//   groupList: [
//     {
//       id: 1,
//       groupName: '그룹1'
//     },
//     {
//       id: 2,
//       groupName: '그룹2'
//     }
//   ],

//   floorPlan: {
//     floorPlanImageUrl: '/images/sample.png',
//     zonePoints: {
//       lat: 37.517997924982076,
//       lon: 127.0267860525248
//     }
//   }
// }

// export const useClientCameraList = (req: { companyNo: number }) => {
//   return useQuery<MResult<MClientCameraList[]>>([EPath.CAMERAS_CLIENT_OF_COMPANY + `/${req.companyNo}`], {})
// }

export const useFlowPlan = (req: { companyNo: number }) => {
  const url = EPath.CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN.replace('{companyNo}', req.companyNo.toString())

  return useQuery<MResult<MFlowPlan>>([url])
}

export const useFlowPlanAdd = () => {
  return useMutation((req: { companyNo: number; CameraFlowPlanReq: MFlowPlanUpdate; file?: File | null }) => {
    const url = EPath.CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN.replace('{companyNo}', req.companyNo.toString())

    return createFilePost<MResult>([url, { CameraFlowPlanReq: req.CameraFlowPlanReq, file: req.file }])
  }, {})
}
export const useFlowPlanUpdate = () => {
  return useMutation((req: { companyNo: number; CameraFlowPlanReq: MFlowPlanUpdate; file?: File | null }) => {
    const url = EPath.CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN.replace('{companyNo}', req.companyNo.toString())

    return createFilePatch<MResult>([url, { CameraFlowPlanReq: req.CameraFlowPlanReq, file: req.file }])
  }, {})
}

export const useFlowPlanCoordinate = () => {
  return useMutation((req: { companyNo: number; CameraFlowPlanReq: MFlowPlanUpdate }) => {
    const url = EPath.CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN_COORDINATE.replace('{companyNo}', req.companyNo.toString())

    return createPatch<MResult>([url, req.CameraFlowPlanReq])
  }, {})
}

export const useClientCameraList = () => {
  return useMutation((req: { companyNo: number }) => {
    return createGet<MClientCameraList[]>([`${EPath.CAMERAS_CLIENT_OF_COMPANY}/${req.companyNo}`])
  }, {})
}

export const useClientGroupCameraList = () => {
  return useMutation((req: { companyNo: number }) => {
    const url = EPath.CAMERAS_CLIENT_OF_COMPANY_GROUP.replace('{companyNo}', req.companyNo.toString())

    return createGet<MClientGroupCameraList[]>([url])
  }, {})
}

export const useClientGroupStatus = () => {
  return useMutation((req: { cameraNo: number; companyNo: number; cameraStatus: YN }) => {
    const url = EPath.CAMERAS_GROUP_GROUP_STATUS.replace('{cameraNo}', req.cameraNo.toString()).replace(
      '{companyNo}',
      req.companyNo.toString()
    )

    return createPatch<MResult>([url, { cameraStatus: req.cameraStatus }])
  }, {})
}

export const useClientGroupCameraItemAdd = () => {
  return useMutation((req: { groupId: number; cameraNo: number }) => {
    const url = EPath.CAMERAS_GROUP_GROUP_ITEM_ADD.replace('{groupId}', req.groupId.toString())

    return createPost<MResult>([url, req])
  }, {})
}

export const useClientGroupCameraItemDelete = () => {
  return useMutation((req: { groupItem: number }) => {
    const url = EPath.CAMERAS_GROUP_GROUP_ITEM.replace('{groupItem}', req.groupItem.toString())

    return createDelete<MResult>([url])
  }, {})
}

export const useClientGroupAdd = () => {
  return useMutation((req: { userNo: number; name: string }) => {
    const url = EPath.CAMERAS_GROUP_OF_USER.replace('{userNo}', req.userNo.toString())

    return createPost<{ groupId: number; groupName: string }>([url, req])
  }, {})
}

export const useClientGroupDelete = () => {
  return useMutation((req: { groupId: number }) => {
    const url = EPath.CAMERAS_GROUP_GROUP.replace('{groupId}', req.groupId.toString())

    return createDelete<MResult>([url])
  }, {})
}

export const useClientCameraAdditionalInfo = () => {
  return useMutation((req: { companyNo: number; cameraList: MClientCameraList[] }) => {
    const url = EPath.CAMERAS_CLIENT_OF_COMPANY_ADDITIONAL_INFO.replace('{companyNo}', req.companyNo.toString())

    return createPatch<MResult>([url, req.cameraList])
  }, {})
}

export const useClientGroupUpdate = () => {
  return useMutation((req: { userNo: number; groupList: MClientGroupCameraList[] }) => {
    const url = EPath.CAMERAS_GROUP_OF_USER.replace('{userNo}', req.userNo.toString())

    return createPut<MResult>([url, req.groupList])
  }, {})
}
