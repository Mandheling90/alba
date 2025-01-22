# Dains Platform FrontApplication

# 모든 API 및 소캣 통신 경로는 src\enum 폴더 내부의 Enum 파일의 EPath 에서 관리 (2024-11-11 기준으로 최신화)

# commonEnum

COMMON_LOGIN: '/user/login',
COMPONENT_LIST: '/view',
GENERATE_CODE: '/mail/generate',
VERIFY_CODE: '/mail/verify',
CHANGE_PASSWORD: '/user/new-password',
USER_DETAIL: '/user/detail'

# contentsEnum

CONTENTS: '/contents'

# kisokEnum

KIOSK: '/kiosk',
KIOSK_CONTENTS: '/kiosk/contents',
KIOSK_TYPE: '/kiosk/type',
KIOSK_PART: '/kiosk/part',
KIOSK_PART_TYPE: '/kiosk/part/type',

KIOSK_HEALTH_CHECK: `${process.env.NEXT_PUBLIC_WEB_SOCKET}/health-check`,
KIOSK_MONITORING_CHECK: `${process.env.NEXT_PUBLIC_WEB_SOCKET}/monitoring`,
MONITORING_TCP_RELAY: `/relay`

# statisticsEnum

STATS_GROUP: '/stats/group',
STATS_COMMON_LIST: '/stats/common/list',
STATS_COMMON_GROUP: '/stats/common/group',
STATS_GROUP_AREA: '/stats/group/area',
STATS_GROUP_LINE: '/stats/group/line',

STATS_LINE_LINE: '/stats/line/line',
STATS_LINE_LINE_GROUP: '/stats/line/line/group',
STATS_LINE_TABLE: '/stats/line/table',
STATS_LINE_TABLE_GROUP: '/stats/line/table/group',

STATS_AREA_BAR_NAV: '/stats/area/bar/nav',
STATS_AREA_BAR_GROUP_NAV: '/stats/area/bar/nav/group',
STATS_AREA_SMOKER_NAV: '/stats/area/smoker/nav',
STATS_AREA_SMOKER_GROUP_NAV: '/stats/area/smoker/nav/group',
STATS_AREA_LINE: '/stats/area/line',
STATS_AREA_LINE_GROUP: '/stats/area/line/group',
STATS_AREA_PIE_NAV: '/stats/area/pie/nav',
STATS_AREA_PIE_GROUP_NAV: '/stats/area/pie/nav/group',
STATS_AREA_TABLE: '/stats/area/table',
STATS_AREA_TABLE_GROUP: '/stats/area/table/group'

# userSettingEnum

USER_GROUP: '/group',
USER: '/user',
USER_ALL: '/user/all'
