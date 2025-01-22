// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { IComponents } from 'src/model/commonModel'

const navigation = (componentListInfo?: IComponents[]): VerticalNavItemsType => {
  return [
    {
      title: '홍보물 관리',
      path: '/contents',
      icon: 'contents'
    },
    {
      title: '사용자 관리',
      path: '/user-setting',
      icon: 'user-setting'
    },
    {
      title: '키오스크 관리',
      icon: 'kiosk',
      children: [
        {
          title: '키오스크 관리',
          path: '/kiosk'
        },
        {
          title: '구성품 및 타입관리',
          path: '/kiosk/kiosk-manager'
        }
      ]
    },
    {
      title: '통계 및 로그 관리',
      icon: 'statistics',
      children: [
        {
          title: '흡연인구통계',
          path: '/statistics/smoking-statistics'
        },
        {
          title: '유동인구통계',
          path: '/statistics/crowd-statistics'
        }
      ]
    },
    {
      title: '모니터링',
      icon: 'monitoring',
      path: '/monitoring'
    }
  ]
}

export default navigation
