import { RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { ChangeEvent, FC } from 'react'

interface IRadioManu {
  onChange: (type: string) => void
  radioList: string[]
  select: string
}

const RadioManu: FC<IRadioManu> = ({ onChange, radioList, select }): React.ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value)
  }

  return (
    <RadioGroup row aria-label='controlled' name='controlled' value={select} onChange={handleChange}>
      {radioList.map((list, index) => (
        <FormControlLabel key={index} value={list} control={<Radio />} label={list} />
      ))}
    </RadioGroup>
  )
}

export default RadioManu
