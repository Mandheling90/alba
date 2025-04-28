export const EPath = {
  CAMERAS_CLIENT: '/cameras',
  CAMERAS_CLIENT_DETAIL: '/cameras/detail',

  CAMERAS_CLIENT_OF_COMPANY: '/camera/of-company',
  CAMERAS_CLIENT_OF_COMPANY_GROUP: '/camera/of-company/{companyNo}/group',
  CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN: '/camera/of-company/{companyNo}/flow-plan',
  CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN_IMAGE: '/camera/of-company/{companyNo}/flow-plan/image',
  CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN_COORDINATE: '/camera/of-company/{companyNo}/flow-plan/coordinate',

  CAMERAS_GROUP_GROUP_ITEM: '/camera/group/groupItem/{groupItem}',
  CAMERAS_GROUP_GROUP_ITEM_ADD: '/camera/group/{groupId}/item',
  CAMERAS_GROUP_OF_USER: '/camera/group/of-user/{userNo}',
  CAMERAS_GROUP_OF_COMPANY: '/camera/of-company/{companyNo}/group',
  CAMERAS_GROUP_GROUP: '/camera/group/{groupId}',
  CAMERAS_GROUP_GROUP_STATUS: '/camera/{cameraNo}/of-company/{companyNo}/status',

  CAMERAS_CLIENT_OF_COMPANY_ADDITIONAL_INFO: '/camera/of-company/{companyNo}/additional-info'
} as const
