// ** Type Imports
import { LayoutProps, NavGroup, NavLink, NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavLink from './VerticalNavLink'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems = [] } = props

  if (!Array.isArray(verticalNavItems)) {
    return null
  }

  const RenderMenuItems = verticalNavItems.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    const TagName: any = resolveNavItemComponent(item)

    return <TagName {...props} key={index} item={item} />
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems
