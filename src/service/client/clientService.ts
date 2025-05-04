import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/clientEnum'
import { YN } from 'src/enum/commonEnum'

import {
  IAiSolutionCompanyList,
  IAiSolutionCompanyPackageParam,
  IAiSolutionService,
  IClientDetail,
  ISolutionList,
  MAiSolutionCompanyList,
  MClientList,
  MClientListReq,
  MCompanySearch
} from 'src/model/client/clientModel'
import MResult, { MAuthDuplicate } from 'src/model/commonModel'
import { createDelete, createGet, createPatch, createPost, createPut } from 'src/module/reactQuery'

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
  return useMutation((params: ISolutionList & { companyNo: number }) => {
    return createPost<MResult>([EPath.AI_COMPANY, params])
  }, {})
}
export const useAiSolutionCompanyUpdate = () => {
  return useMutation((params: ISolutionList & { companyNo: number }) => {
    return createPut<MResult>([EPath.AI_COMPANY, params])
  }, {})
}
export const useAiSolutionCompanyDelete = () => {
  return useMutation((params: { companySolutionId: number }) => {
    return createDelete<MResult>([EPath.AI_COMPANY, params])
  }, {})
}

export const useAiSolutionCompanyPackageSave = () => {
  return useMutation((params: IAiSolutionCompanyPackageParam) => {
    return createPost<MResult>([EPath.AI_COMPANY_PACKAGE, params])
  }, {})
}

export const useAiSolutionCompanyPackageUpdate = () => {
  return useMutation((params: IAiSolutionCompanyPackageParam) => {
    return createPut<MResult>([EPath.AI_COMPANY_PACKAGE, params])
  }, {})
}
export const useAiSolutionCompanyPackageDelete = () => {
  return useMutation((params: { companyNo: number }) => {
    return createDelete<MResult>([EPath.AI_COMPANY_PACKAGE, params])
  }, {})
}

export const useAiSolutionServerDelete = () => {
  return useMutation((params: { serverId: number }) => {
    return createDelete<MResult>([EPath.AI_COMPANY_SERVER, params])
  }, {})
}

export const useAiSolutionInstanceDelete = () => {
  return useMutation((params: { instanceId: number }) => {
    return createDelete<MResult>([EPath.AI_COMPANY_INSTANCE, params])
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
    return createPost<MResult & IClientDetail>([EPath.COMPANY, params])
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

export const useClientReportGenerationStatusUpdate = () => {
  return useMutation((params: { companyNo: number; reportGeneration: YN }) => {
    return createPatch<MResult>([EPath.COMPANY_STATUS, params])
  }, {})
}

export const useAiSolutionService = () => {
  return useMutation((params: { solutionId: number }) => {
    return createGet<IAiSolutionService[]>([EPath.AI_SOLUTION_SERVICE + `/${params.solutionId}`])
  }, {})

  // return useQuery<MResult<IAiSolutionService[]>>([EPath.AI_SOLUTION_SERVICE + `/${solutionId}`])
}
