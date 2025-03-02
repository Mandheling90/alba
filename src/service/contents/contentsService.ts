import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/contentsEnum'

import { YN } from 'src/enum/commonEnum'
import { CONTENTS_TYPE, PROMO } from 'src/enum/contentsEnum'
import MResult from 'src/model/commonModel'
import { MContent, MContentReq, MContentsDeleteReq, MKioskContentList } from 'src/model/contents/contentsModel'
import { createDelete, createFilePatch, createFilePost, createGet } from 'src/module/reactQuery'

// 샘플 데이터
const sampleContents: MContent[] = [
  {
    id: 1,
    contentsTypeId: CONTENTS_TYPE.VIDEO,
    name: '신메뉴 프로모션 영상',
    postStartDate: '2024-03-20',
    postEndDate: '2024-04-20',
    type: PROMO.GENERIC_PROMO,
    creator: '마케팅팀',
    tag: '신메뉴,프로모션',
    filePath: '/contents/promo_video_1.mp4',
    priorityType: 1,
    expireType: 0,
    dataStatus: YN.Y,
    kioskList: [
      { id: 1, name: '1층 키오스크' },
      { id: 2, name: '2층 키오스크' }
    ]
  },
  {
    id: 2,
    contentsTypeId: CONTENTS_TYPE.IMAGE,
    name: '시즌 메뉴 배너',
    postStartDate: '2024-03-15',
    postEndDate: '2024-05-15',
    type: PROMO.GENERIC_PROMO,
    creator: '디자인팀',
    tag: '시즌메뉴,봄',
    filePath: '/contents/season_banner_1.jpg',
    priorityType: 2,
    expireType: 0,
    dataStatus: YN.Y,
    kioskList: [{ id: 1, name: '1층 키오스크' }]
  },
  {
    id: 3,
    contentsTypeId: CONTENTS_TYPE.IMAGE,
    name: '멤버십 혜택 안내',
    postStartDate: '2024-03-01',
    postEndDate: '2024-12-31',
    type: PROMO.NO_SMOKING_PROMO,
    creator: '회원관리팀',
    tag: '멤버십,혜택',
    filePath: '/contents/membership_info.jpg',
    priorityType: 3,
    expireType: 0,
    dataStatus: YN.Y,
    kioskList: [
      { id: 1, name: '1층 키오스크' },
      { id: 2, name: '2층 키오스크' },
      { id: 3, name: '3층 키오스크' }
    ]
  }
]

export const useContentsList = (req: MContentReq) => {
  // 실제 API 호출 대신 샘플 데이터 반환
  return useQuery<MResult<MContent[]>>([EPath.CONTENTS, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampleContents
    })
  })
}

export const useListKiosksByContent = (id: number[]) => {
  return useQuery<MResult<MKioskContentList[]>>([EPath.CONTENTS + `/${id.join(',')}`], {})
}

export const useContentsDelete = () => {
  return useMutation((params: MContentsDeleteReq[]) => {
    return createDelete<MResult>([EPath.CONTENTS, params])
  }, {})
}

export const useContentsUpdate = () => {
  return useMutation((params: Partial<MContent>) => {
    return createFilePatch<MResult>([EPath.CONTENTS, params])
  }, {})
}

export const useContentsInsert = () => {
  return useMutation((params: Partial<MContent>) => {
    return createFilePost<MResult>([EPath.CONTENTS, params])
  }, {})
}

export const useContentsListDetail = () => {
  return useMutation((id: number) => {
    return createGet<MContent>([EPath.CONTENTS_DETAIL + `/${id}`])
  }, {})
}

// export const useContentsListDetail = (id: number) => {
//   return useQuery<MResult<MContent>>([EPath.CONTENTS_DETAIL + `/${id}`], { enabled: false })
// }
