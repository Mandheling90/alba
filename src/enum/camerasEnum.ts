export const EPath = {
  CAMERAS_CLIENT: '/cameras',
  CAMERAS_CLIENT_DETAIL: '/cameras/detail',

  CAMERAS_CLIENT_OF_COMPANY: '/camera/of-company',
  CAMERAS_CLIENT_OF_COMPANY_GROUP: '/camera/of-company/{companyNo}/group/',
  CAMERAS_CLIENT_OF_COMPANY_FLOW_PLAN: '/camera/of-company/{companyNo}/flow-plan',

  CAMERAS_GROUP_GROUP_ITEM: '/camera/group/groupItem/{groupItem}',
  CAMERAS_GROUP_GROUP_ITEM_ADD: '/camera/group/{groupId}/item',
  CAMERAS_GROUP_OF_USER: '/camera/group/of-user/{userNo}',
  CAMERAS_GROUP_GROUP: '/camera/group/{groupId}'
} as const
