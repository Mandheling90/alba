import { CSSProperties } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'

interface IIconCustom {
  icon: string
  path?: string
  style?: CSSProperties
  isCommon?: boolean
}

const IconCustom = ({ path, icon, style, isCommon }: IIconCustom) => {
  const { settings } = useSettings()
  const src = `/images${isCommon ? '/common' : `/${settings.mode}`}${path ? `/${path}` : ''}/${icon}.svg`

  return <img src={src} alt={icon} style={style && { ...style }} />
}

export default IconCustom
