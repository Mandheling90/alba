import { CSSProperties, useState } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'

interface IIconCustom {
  icon: string
  path?: string
  style?: CSSProperties
  isCommon?: boolean
  hoverIcon?: string
}

const IconCustom = ({ path, icon, style, isCommon, hoverIcon }: IIconCustom) => {
  const { settings } = useSettings()
  const [currentIcon, setCurrentIcon] = useState(icon)

  const src = `/images${isCommon ? '/common' : `/${settings.mode}`}${path ? `/${path}` : ''}/${
    hoverIcon ? currentIcon : icon
  }.svg`

  return (
    <img
      src={src}
      alt={icon}
      style={style && { ...style }}
      onMouseEnter={() => hoverIcon && setCurrentIcon(hoverIcon)}
      onMouseLeave={() => hoverIcon && setCurrentIcon(icon)}
    />
  )
}

export default IconCustom
