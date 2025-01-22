import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/contentsEnum'

import MResult from 'src/model/commonModel'
import { MContent, MContentReq, MContentsDeleteReq, MKioskContentList } from 'src/model/contents/contentsModel'
import { createDelete, createFilePatch, createFilePost, createGet } from 'src/module/reactQuery'

export const useContentsList = (req: MContentReq) => {
  return useQuery<MResult<MContent[]>>([EPath.CONTENTS, req], {})
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
