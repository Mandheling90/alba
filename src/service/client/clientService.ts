import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/contentsEnum'

import { IClient, IClientDetail, SERVICE_TYPE, SOLUTION_TYPE } from 'src/model/client/clientModel'
import MResult from 'src/model/commonModel'
import { MContent, MContentReq, MContentsDeleteReq, MKioskContentList } from 'src/model/contents/contentsModel'
import { createDelete, createFilePatch, createFilePost, createGet } from 'src/module/reactQuery'

// 샘플 데이터
export const sampleClientsList: IClient[] = [
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 2,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  },
  {
    clientId: '1001',
    clientName: '스마트시티 주식회사',
    address: '서울특별시 강남구 테헤란로 123',
    serviceTypes: [SERVICE_TYPE.COUNTING],
    solutionTypes: [SOLUTION_TYPE.CVEDIA],
    analysisChannels: 8,
    reportGeneration: true,
    reportEmail: 'report@smartcity.com',
    accountStatus: true
  },
  {
    clientId: '1002',
    clientName: '미래기술 연구소',
    address: '경기도 성남시 분당구 판교로 456',
    serviceTypes: [SERVICE_TYPE.FEATURE_ANALYSIS, SERVICE_TYPE.CAR_COUNT],
    solutionTypes: [SOLUTION_TYPE.PROAI_EDGE, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 12,
    reportGeneration: true,
    reportEmail: 'analytics@futuretech.co.kr',
    accountStatus: true
  },
  {
    clientId: '1003',
    clientName: '교통관제 시스템즈',
    address: '인천광역시 연수구 송도문화로 789',
    serviceTypes: [SERVICE_TYPE.MONITORING, SERVICE_TYPE.MONITORING],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 16,
    reportGeneration: false,
    reportEmail: 'traffic@tms.net',
    accountStatus: false
  },
  {
    clientId: '1004',
    clientName: '도시안전 관리공단',
    address: '부산광역시 해운대구 센텀중앙로 321',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
    analysisChannels: 24,
    reportGeneration: true,
    reportEmail: 'safety@citymanagement.org',
    accountStatus: true
  },
  {
    clientId: '1005',
    clientName: '스마트팩토리 솔루션즈',
    address: '대전광역시 유성구 대학로 147',
    serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.FEATURE_ANALYSIS],
    solutionTypes: [SOLUTION_TYPE.SAFR, SOLUTION_TYPE.CVEDIA],
    analysisChannels: 32,
    reportGeneration: true,
    reportEmail: 'factory@smartsolutions.com',
    accountStatus: true
  }
]

export const sampleClientDetail: IClientDetail = {
  clientId: 'CLIENT001',
  clientName: '테스트 고객사',
  address: '서울시 강남구 테헤란로 123',
  serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.MONITORING],
  solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
  analysisChannels: 2,
  reportGeneration: true,
  reportEmail: 'test@example.com',
  accountStatus: true,
  businessNumber: '123-45-67890',
  businessStatus: '1',
  contractPeriod: '2024-03-20 ~ 2025-03-19',
  reportReceiver: 'receiver@example.com',
  clientAccount: 'testaccount',
  solutions: [
    {
      id: 0,
      selectedSolution: '1',
      services: [
        {
          id: '1',
          name: '정문 카메라',
          serviceType: '1',
          address: '192.168.0.100',
          rtsAddress: 'rtsp://192.168.0.100:554/stream',
          description: '정문 출입구 모니터링'
        },
        {
          id: '2',
          name: '주차장 카메라',
          serviceType: '2',
          address: '192.168.0.101',
          rtsAddress: 'rtsp://192.168.0.101:554/stream',
          description: '주차장 차량 카운팅'
        }
      ]
    }
  ]
}

export const useClientList = (req?: MContentReq) => {
  // 실제 API 호출 대신 샘플 데이터 반환
  return useQuery<MResult<IClient[]>>([EPath.CONTENTS, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampleClientsList
    })
  })
}

export const useClientDetail = (id?: number) => {
  return useQuery<MResult<IClientDetail>>([EPath.CONTENTS, id], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampleClientDetail
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
