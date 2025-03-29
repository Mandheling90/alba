import { TextField, TextFieldProps } from '@mui/material'
import { FC, useState } from 'react'

interface CustomTextFieldProps {
  value: string | number | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomTextFieldState: FC<CustomTextFieldProps & TextFieldProps> = ({ value, onChange, ...props }) => {
  const [text, setText] = useState(value)

  const handleBlur = () => {
    onChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>)
  }

  return <TextField {...props} value={text} onChange={e => setText(e.target.value)} onBlur={handleBlur} />
}

export default CustomTextFieldState
