import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/clientEnum'

import {
  IAiSolutionCompanyList,
  IAiSolutionService,
  IClientDetail,
  ISolutionList,
  MAiSolutionCompanyList,
  MClientList,
  MClientListReq,
  MCompanySearch
} from 'src/model/client/clientModel'
import MResult, { MAuthDuplicate } from 'src/model/commonModel'
import { createDelete, createGet, createPost, createPut } from 'src/module/reactQuery'

export const useClientList = (params: MClientListReq) => {
  return useQuery<MResult<MClientList>>([EPath.COMPANY_LIST, params], {})
}

export const useCompanySearchList = (params: { keyword: string }) => {
  return useQuery<MResult<MCompanySearch[]>>([EPath.COMPANY_SEARCH, params], {})
}

export const useClientDetail = (companyNo?: number) => {
  return useQuery<MResult<IClientDetail>>([EPath.COMPANY + `/${companyNo}`], {
    enabled: !!companyNo
  })
}

export const useAiCompanyDetail = (companyNo?: number) => {
  return useQuery<MResult<IAiSolutionCompanyList>>([EPath.AI_COMPANY + `/${companyNo}`], {
    enabled: !!companyNo
  })
}

export const useAiSolutionCompanySave = () => {
  return useMutation((params: ISolutionList & { companyNo: number; remark?: string }) => {
    return createPost<MResult>([EPath.AI_COMPANY, params])
  }, {})
}
export const useAiSolutionCompanyUpdate = () => {
  return useMutation((params: ISolutionList & { companyNo: number; remark?: string }) => {
    return createPut<MResult>([EPath.AI_COMPANY, params])
  }, {})
}
export const useAiSolutionCompanyDelete = () => {
  return useMutation((params: { companySolutionId: number }) => {
    return createDelete<MResult>([EPath.AI_COMPANY, params])
  }, {})
}

export const useAiSolutionCompanyList = () => {
  return useQuery<MResult<MAiSolutionCompanyList[]>>([EPath.AI_SOLUTION_COMPANY_LIST])
}

export const useClientDuplicateCheck = () => {
  return useMutation((companyId?: string) => {
    return createGet<MAuthDuplicate>([EPath.COMPANY_DUPLICATE_CHECK + `/${companyId}`])
  }, {})
}

export const useClientSave = () => {
  return useMutation((params: IClientDetail) => {
    return createPost<MResult>([EPath.COMPANY, params])
  }, {})
}

export const useClientUpdate = () => {
  return useMutation((params: IClientDetail) => {
    return createPut<MResult>([EPath.COMPANY, params])
  }, {})
}

export const useClientDelete = () => {
  return useMutation((params: { companyNos: number[] }) => {
    return createDelete<MResult>([EPath.COMPANY, params])
  }, {})
}

export const useAiSolutionService = (solutionId: number) => {
  return useQuery<MResult<IAiSolutionService[]>>([EPath.AI_SOLUTION_SERVICE + `/${solutionId}`])
}
