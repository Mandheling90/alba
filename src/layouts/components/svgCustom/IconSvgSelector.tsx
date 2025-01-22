import React from 'react'
import AIBox from './AIBox'
import Display from './Display'
import GenIcon01 from './GenIcon01'
import GenIcon02 from './GenIcon02'
import IPCamera from './IPCamera'
import MgmtPC from './MgmtPC'
import NetworkHub from './NetworkHub'
import PowerRelay from './PowerRelay'
import Speaker from './Speaker'
import ThermometerSvg from './ThermometerSvg'

interface IconProps {
  name: string
  fillColor: string
  selected: boolean
}

export interface IconSvgSelector {
  fillColor: string
  selected: boolean
}

const IconSvgSelector: React.FC<IconProps> = ({ name, fillColor, selected }) => {
  switch (name) {
    case 'AI-Box':
      return <AIBox fillColor={fillColor} selected={selected} />
    case 'Display':
      return <Display fillColor={fillColor} selected={selected} />
    case 'Gen-Icon-01':
      return <GenIcon01 fillColor={fillColor} selected={selected} />
    case 'Gen-Icon-02':
      return <GenIcon02 fillColor={fillColor} selected={selected} />
    case 'IP-Camera':
      return <IPCamera fillColor={fillColor} selected={selected} />
    case 'Mgmt-PC':
      return <MgmtPC fillColor={fillColor} selected={selected} />
    case 'NetworkHub':
      return <NetworkHub fillColor={fillColor} selected={selected} />
    case 'Power-Relay':
      return <PowerRelay fillColor={fillColor} selected={selected} />
    case 'Speaker':
      return <Speaker fillColor={fillColor} selected={selected} />
    case 'Thermometer':
      return <ThermometerSvg fillColor={fillColor} selected={selected} />
    default:
      return null // name이 일치하지 않으면 아무것도 렌더링하지 않음
  }
}

export default IconSvgSelector
