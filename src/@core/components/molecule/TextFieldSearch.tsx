// ** React Imports
import { FC, useState } from 'react'

// ** MUI Imports
import { AutocompleteRenderInputParams, Box, Button, InputAdornment, TextField } from '@mui/material'

interface ITextFieldSearch {
  params?: AutocompleteRenderInputParams
  label: string
  onClick?: (value: string) => void
  textFieldColor?: string
  useSearchButton?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const TextFieldSearch: FC<ITextFieldSearch> = ({
  params,
  label,
  onClick = undefined,
  textFieldColor = '#00000000',
  useSearchButton = false,
  onKeyDown
}): React.ReactElement => {
  const [fontSize, setFontSize] = useState(true)
  const [text, setText] = useState('')

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        onKeyDown={onKeyDown}
        InputProps={{
          ...params?.InputProps,
          type: 'search',
          endAdornment: !useSearchButton && (
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
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: textFieldColor,
            color: 'black'
          }
        }}
      />
      {useSearchButton && (
        <Button
          variant='contained'
          color='primary'
          size='medium'
          onClick={() => {
            onClick && onClick(text)
          }}
          sx={{ minWidth: '80px' }}
        >
          검색
        </Button>
      )}
    </Box>
  )
}

export default TextFieldSearch
