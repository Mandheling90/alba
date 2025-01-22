// ** Type Import
import { IconProps } from '@iconify/react'

// ** Custom Icon Import

const UserIcon = ({ icon, ...rest }: IconProps) => {
  return <img src={`/images/menu/${icon}.svg`} alt={icon.toString()} style={{ width: '20px' }} />

  // return <Icon icon={icon} {...rest} />
}

export default UserIcon
