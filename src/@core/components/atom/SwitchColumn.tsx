import { Switch } from '@mui/material'
import { ChangeEvent, FC, useState } from 'react'

interface ISwitchColumn {
  defaultChecked: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const SwitchColumn: FC<ISwitchColumn> = ({ defaultChecked, onChange }): React.ReactElement => {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <Switch
      checked={checked}
      onChange={async event => {
        setChecked(event.target.checked)
        onChange?.(event)
      }}
    />
  )
}

export default SwitchColumn
