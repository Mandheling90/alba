// ** React Imports
import { FC, useState } from 'react'

// ** MUI Imports
import { AutocompleteRenderInputParams, InputAdornment, TextField } from '@mui/material'

interface ITextFieldSearch {
  params?: AutocompleteRenderInputParams
  label: string
  onClick?: (value: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const TextFieldSearch: FC<ITextFieldSearch> = ({ params, label, onClick = () => {} }): React.ReactElement => {
  const [fontSize, setFontSize] = useState(true)
  const [text, setText] = useState('')

  return (
    <TextField
      {...params}
      size='small'
      label={label}
      onFocus={e => {
        if (e.target.value === '') setFontSize(false)
      }}
      onBlur={e => {
        setFontSize(e.target.value === '')
      }}
      InputLabelProps={{
        style: { fontSize: fontSize ? '12px' : '', paddingTop: '2.5px' }
      }}
      onChange={e => {
        if (e.target.value) {
          setText(e.target.value)
        }
      }}
      InputProps={{
        ...params?.InputProps,
        type: 'search',
        endAdornment: (
          <InputAdornment
            position='start'
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              onClick && onClick(text)
            }}
          >
            <img src={'/images/search-rounded.svg'} alt={'search'} />
          </InputAdornment>
        )
      }}
    />
  )
}

export default TextFieldSearch
