import { Autocomplete, IconButton, InputAdornment, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

interface IMonitoringSearch {
  label: string
  defultValue?: string
  data: any[]
  onChange?: (newValue: any) => void
  minWidth?: string
  isTextSearch?: boolean
}

const AutocompleteSearch = forwardRef(
  ({ label, defultValue = '', data, onChange, minWidth = '30vh', isTextSearch = false }: IMonitoringSearch, ref) => {
    const theme = useTheme()
    const [value, setValue] = useState<any>(defultValue) // 선택된 값을 관리
    const [isFocused, setIsFocused] = useState(false) // 포커스 상태 관리

    useEffect(() => {
      setValue(defultValue)
    }, [defultValue])

    useImperativeHandle(ref, () => ({
      // 초기화 처리
      clearInput() {
        setValue(null)
        onChange?.(null)
      }
    }))

    return (
      <Autocomplete
        disablePortal
        id='combo-box-demo'
        options={data}
        value={value} // 선택된 값 연결
        onChange={(event, newValue) => {
          setValue(newValue) // 값이 변경되면 업데이트
          onChange?.(newValue) // 부모 컴포넌트에 값 전달
        }}
        sx={{
          background: theme.palette.background.paper,
          minWidth: minWidth,
          height: '100%'
        }}
        size='small'
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              sx: {
                paddingRight: '40px'
              },
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => {
                      if (isTextSearch) {
                        onChange?.(params.inputProps.value)
                      }
                    }}
                    edge='end'
                    sx={{ position: 'absolute', right: 20 }}
                  >
                    <img src={'/images/search-rounded.svg'} alt={'search'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            onFocus={() => setIsFocused(true)} // 포커스 상태 설정
            onBlur={() => setIsFocused(false)} // 포커스가 벗어났을 때 상태 해제
            onKeyDown={event => {
              if (event.key === 'Enter' && isFocused) {
                // 포커스가 있는 상태에서 엔터키 확인
                if (isTextSearch) {
                  console.log('ok')
                  onChange?.(params.inputProps.value) // 엔터키가 눌리면 onChange 실행
                }
              }
            }}
            sx={{
              '& .MuiAutocomplete-endAdornment': {
                display: 'none'
              }
            }}
          />
        )}
      />
    )
  }
)

export default AutocompleteSearch
