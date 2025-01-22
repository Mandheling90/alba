export enum KIOSK_STATUS {
  ALL = 9,
  DISABLED = 0,
  ENABLED = 1,
  ERROR = 2
}

export enum POWER_TYPE {
  OFF = 0,
  ON = 1
}

export const pastelColors = [
  '#fff',
  'rgb(240, 230, 255)',
  'rgba(255, 234, 184, 1)',
  'rgba(255, 180, 0, 1)',
  'rgba(76, 178, 0, 1)',
  'rgba(45, 175, 254, 1)',
  'rgba(255, 97, 102, 1)',
  'rgba(123, 239, 178, 1)',
  'rgba(240, 128, 128, 1)',
  'rgba(70, 130, 180, 1)',
  'rgba(218, 165, 32, 1)',
  'rgba(144, 238, 144, 1)',
  'rgba(255, 105, 180, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(153, 50, 204, 1)',
  'rgba(255, 69, 0, 1)',
  'rgba(32, 178, 170, 1)',
  'rgba(100, 149, 237, 1)',
  'rgba(255, 182, 193, 1)'
]

// 아이콘 목록
export const icons: string[] = [
  'AI-Box',
  'Display',
  'Gen-Icon-01',
  'Gen-Icon-02',
  'IP-Camera',
  'Mgmt-PC',
  'NetworkHub',
  'Power-Relay',
  'Speaker',
  'Thermometer'
]

export const EPath = {
  KIOSK: '/kiosk',
  KIOSK_CONTENTS: '/kiosk/contents',
  KIOSK_TYPE: '/kiosk/type',

  KIOSK_PART: '/kiosk/part',
  KIOSK_PART_TYPE: '/kiosk/part/type',

  KIOSK_HEALTH_CHECK: `${process.env.NEXT_PUBLIC_WEB_SOCKET}/health-check`,
  KIOSK_MONITORING_CHECK: `${process.env.NEXT_PUBLIC_WEB_SOCKET}/monitoring`,

  MONITORING_TCP_RELAY: `/relay`
} as const
