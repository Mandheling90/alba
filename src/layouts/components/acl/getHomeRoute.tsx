/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string, homeRoute: string) => {
  if (role === 'client') return '/acl'
  else return homeRoute
}

export default getHomeRoute
