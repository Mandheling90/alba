import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { EErrorMessage, YN } from 'src/enum/commonEnum'
import { MAuthMenuList } from 'src/model/commonModel'

// import { KIOSK_STATUS, POWER_TYPE } from 'src/enum/kisokEnum'
// import { MMonitoringHealth } from 'src/model/monitoring/monitoringModel'

import * as XLSX from 'xlsx'

const ENV_MODE: string = process.env.NEXT_PUBLIC_ENV_MODE as string

export const toggleValueInArray = <T>(array: T[], value: T): T[] => {
  const index = array.indexOf(value)

  if (index === -1) {
    // 값이 배열에 없으면 추가
    return [...array, value]
  } else {
    // 값이 배열에 이미 있으면 삭제
    return [...array.slice(0, index), ...array.slice(index + 1)]
  }
}

export const categoryPercentage = (totalCnt: number, categoryCounts: number) => {
  if (!totalCnt || totalCnt === 0) return 0
  const percentage = (categoryCounts / totalCnt) * 100

  return Number.isInteger(percentage) ? percentage : percentage.toFixed(1)
}

export const riskLevelPercent = (percent: number) => {
  // 부동 소수점을 정수로 변환
  const percentInt = Math.round(percent * 100)

  const riskLevel =
    percentInt <= 3333
      ? 'ALM0000001'
      : percentInt <= 6677
      ? 'ALM0000002'
      : percentInt <= 8333
      ? 'ALM0000003'
      : percentInt <= 10000
      ? 'ALM0000004'
      : 'ALM0000001'

  return riskLevel
}

// export const riskLevelPercent = (percent: number) => {
//   const riskLevel =
//     percent <= 33.3
//       ? 'ALM0000001'
//       : percent <= 66.7
//       ? 'ALM0000002'
//       : percent <= 83.3
//       ? 'ALM0000003'
//       : percent <= 101
//       ? 'ALM0000004'
//       : 'ALM0000001'

//   return riskLevel
// }

// 지도에 감시카메라 비디오 영역배치 함수
export const cameraVideoPositionFn = (lat: number, lon: number, position: string) => {
  const latModify = 0.00052
  const lngModify = 0.0014

  switch (position) {
    case '03':
      return { lat: lat + latModify, lng: lon - lngModify }
    case '02':
      return { lat: lat + latModify, lng: lon }
    case '01':
      return { lat: lat + latModify, lng: lon + lngModify }
    case '04':
      return { lat: lat, lng: lon - lngModify }
    case '08':
      return { lat: lat, lng: lon + lngModify }
    case '05':
      return { lat: lat - latModify, lng: lon - lngModify }
    case '06':
      return { lat: lat - latModify, lng: lon }
    case '07':
      return { lat: lat - latModify, lng: lon + lngModify }

    default:
      return { lat: lat, lng: lon }
  }
}

export const isEmptyString = (str: string): boolean => {
  return typeof str === 'string' && str.trim() === ''
}

// 숫자,숫자 형식을 확인하는 정규 표현식
export const IntCommaIntRegex = (str: string) => {
  const regex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/

  return regex.test(str)
}

// 문자열을 Base64로 인코딩
export const encodeBase64 = (str: string) => {
  return btoa(str)
}

// Base64를 문자열로 디코딩
export const decodeBase64 = (encodedStr: string) => {
  return atob(encodedStr)
}

// 이메일 정규식
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

// 엑셀출력
export const exportToExcel = (data: any[], fileName: string) => {
  // 워크북 생성
  const workbook = XLSX.utils.book_new()

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(data)

  // 워크북에 워크시트 추가
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 워크북을 바이너리 형태로 작성
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  })

  // Blob 생성
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })

  // 파일 다운로드
  saveAs(blob, `${fileName}.xlsx`)
}

// 핸드폰 번호형식 리턴
export const handlePhoneChange = (input: string) => {
  // 입력된 값에서 숫자만 추출
  const numericInput = input.replace(/\D/g, '')

  // 숫자의 길이가 11자리 이하인 경우에만 업데이트
  if (numericInput.length <= 11) {
    // 숫자를 형식에 맞게 포맷팅
    const formattedInput = numericInput.replace(/^(\d{3})(\d{1,4})?(\d{1,4})?$/, (_, p1, p2, p3) => {
      let result = p1
      if (p2) result += `-${p2}`
      if (p3) result += `-${p3}`

      return result
    })

    return formattedInput
  }
}

// 두 객체의 값을 비교하여 값이 다른 속성만 남기는 함수
export const filterDifferentProperties = (
  original: Record<string, any>,
  options: Record<string, any>
): Record<string, any> => {
  const result: Record<string, any> = {}

  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      if (original[key] !== options[key]) {
        result[key] = options[key]
      }
    }
  }

  return result
}

// 파일 경로에서 파일명 추출 함수
export const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop() || ''
}

export const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0')
}

export const excludeId = (
  object: { [key: string]: any },
  excludeKey: string,
  excludeValue?: number // excludeValue는 선택적 매개변수로 수정
) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    // excludeValue가 주어지지 않았을 경우 해당 키만 제외
    if (excludeValue === undefined) {
      if (key !== excludeKey) {
        acc[key] = value
      }
    }

    // excludeValue가 있을 경우 해당 키와 값이 일치하는 속성만 제외
    else if (!(key === excludeKey && value === excludeValue)) {
      acc[key] = value
    }

    return acc
  }, {} as { [key: string]: any })
}

// 문자열 개행을 기준으로 배열로 전환
export const convertTextToArray = (text: string): string[] => {
  return text
    .split('\n') // 줄바꿈을 기준으로 텍스트를 분리
    .filter(line => line.trim() !== '') // 공백인 줄을 제외
}

// 입력 필수값 체크
export const validateFields = (
  params: any,
  requiredFields: string[]
): { result: boolean; message: Partial<Record<keyof any, string>> } => {
  const newErrors: Partial<Record<keyof any, string>> = {}

  requiredFields.forEach(field => {
    if (params?.[field] === null || params?.[field] === undefined || params?.[field] === '') {
      newErrors[field] = `${field} 값은 필수 입니다.`
    }
  })

  return { result: Object.keys(newErrors).length === 0, message: newErrors }
}

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')

  return `${year}${month}${day}${hours}`
}

export const formatNumberWithCommas = (number: number): string => {
  return new Intl.NumberFormat('en-US').format(number)
}

// 비밀번호 유효성 검사를 위한 정규식
export const isValidPassword = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/

  return passwordRegex.test(password)
}

// export const addErrorFlag = (kiosks: MMonitoringHealth[]): { data: MMonitoringHealth[]; errCount: number } => {
//   let errCount = 0

//   const data = kiosks.map(kiosk => {
//     kiosk.status = KIOSK_STATUS.ENABLED

//     const allModulesDisabled = kiosk.modules.every(module => module.powerType === 0)

//     // `remote`의 상태 확인 후 `isError` 추가
//     if (kiosk.remote) {
//       if (kiosk.remote.status === KIOSK_STATUS.ERROR) {
//         kiosk.status = KIOSK_STATUS.ERROR
//         errCount = errCount + 1
//       }
//     }

//     // 각 `module`과 그 안의 `items` 상태 확인 후 `isError` 추가
//     kiosk.modules = kiosk.modules.map(module => {
//       if (module.powerType === POWER_TYPE.ON && module.status === KIOSK_STATUS.ERROR) {
//         kiosk.status = KIOSK_STATUS.ERROR
//         errCount = errCount + 1
//       }

//       module.items = module.items.map(item => {
//         if (module.powerType === POWER_TYPE.ON && item.status === KIOSK_STATUS.ERROR) {
//           kiosk.status = KIOSK_STATUS.ERROR
//           errCount = errCount + 1
//         }

//         return item
//       })

//       return module
//     })

//     if (kiosk.status !== KIOSK_STATUS.ERROR && allModulesDisabled) {
//       kiosk.status = KIOSK_STATUS.DISABLED
//     }

//     return kiosk
//   })

//   return { data: data, errCount: errCount }
// }

export const calculateChangeRate = (currentValue: number, previousValue: number): string => {
  if (currentValue === 0) return '-%'
  if (previousValue === 0) return '100%'

  const change = ((currentValue - previousValue) / previousValue) * 100

  return `${Math.min(Math.max(Math.round(change), -100), 100)}%`
}

export const areEqual = (prevProps: any, nextProps: any) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'msg' in error && typeof (error as any).msg === 'string') {
    return (error as any).msg
  }

  return EErrorMessage.COMMON_ERROR
}

export const getAuthMenu = (authMenuList: MAuthMenuList[], menuId: number) => {
  // 개발용
  if (process.env.NEXT_PUBLIC_ENV_MODE === 'development') {
    return {
      createYn: YN.Y,
      updateYn: YN.Y,
      readYn: YN.Y,
      deleteYn: YN.Y
    }
  }

  return authMenuList.find(menu => menu.menuId === menuId)
}

// 현재 날짜를 기준으로 해당 주의 시작일과 종료일 계산 1
export const getCurrentWeekDates_bak = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - dayOfWeek) // 해당 주의 시작일 (일요일)
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + (6 - dayOfWeek)) // 해당 주의 종료일 (토요일)

  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  }
}

// 현재 날짜를 기준으로 해당 주의 월요일부터 다음 주의 일요일까지 계산 2
export const getCurrentWeekDates = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)) // 해당 주의 시작일 (월요일)
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + (7 - dayOfWeek)) // 다음 주의 종료일 (일요일)

  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  }
}

// 현재 날짜가 속한 주의 이전 주 월요일부터 현재 날짜까지 계산
export const getCurrentAndPreviousWeekDates = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0: 일요일, 1: 월요일, ..., 6: 토요일

  // 이전 주의 시작일 (월요일)
  const previousWeekStart = new Date(today)
  previousWeekStart.setDate(today.getDate() - (dayOfWeek === 0 ? 13 : dayOfWeek + 6))

  // 종료일은 현재 날짜로 설정
  const endDate = new Date(today)

  return {
    startDate: format(previousWeekStart, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  }
}

// 현재 날짜가 속한 전월 1일부터 현재 날짜까지 계산
export const getCurrentAndPreviousMonthDates = () => {
  const today = new Date()

  // 전월 1일 계산
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  // 종료일은 현재 날짜로 설정
  const endDate = new Date(today)

  return {
    startDate: format(previousMonthStart, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  }
}
