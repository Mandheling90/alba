import { CSSProperties, useEffect, useState } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'

interface IIconCustom {
  icon: string
  path?: string
  style?: CSSProperties
  isCommon?: boolean
  hoverIcon?: string
  usePng?: boolean
  onClick?: (e: any) => void
}

const IconCustom = ({ path, icon, style, isCommon, hoverIcon, usePng, onClick }: IIconCustom) => {
  const { settings } = useSettings()
  const [currentIcon, setCurrentIcon] = useState(icon)

  useEffect(() => {
    setCurrentIcon(icon)
  }, [icon])

  const src = `/images${isCommon ? '/common' : `/${settings.mode}`}${path ? `/${path}` : ''}/${
    hoverIcon ? currentIcon : icon
  }.${usePng ? 'png' : 'svg'}`

  return (
    <img
      onClick={onClick}
      src={src}
      alt={icon}
      style={style && { ...style }}
      onMouseEnter={() => hoverIcon && setCurrentIcon(hoverIcon)}
      onMouseLeave={() => hoverIcon && setCurrentIcon(icon)}
    />
  )
}

export default IconCustom
