import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface IAreaAddText {
  defaultValue?: string
  readOnly?: boolean
  placeholder?: string
  onSubmit?: (areaAddValue: string) => void
  onCancel?: () => void
}

const InputTextMod: FC<IAreaAddText> = ({
  defaultValue = '',
  readOnly = false,
  placeholder = '',
  onSubmit,
  onCancel
}): React.ReactElement => {
  const [areaAddValue, setAreaAddValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus()
    }
  }, [])

  return (
    <InputText>
      <input
        id='add-text'
        type='text'
        ref={inputRef}
        value={areaAddValue}
        onFocus={() => {
          setIsFocused(true)
        }}
        onBlur={() => {
          setIsFocused(false)
          onCancel && onCancel()
        }}
        onChange={e => {
          setAreaAddValue(e.target.value)
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            if (isFocused) {
              onSubmit && onSubmit(areaAddValue)
            }
          }
        }}
        readOnly={readOnly}
        placeholder={placeholder}
      />
    </InputText>
  )
}

const InputText = styled.div<{}>`
  width: 100%;
  height: 35px;

  display: flex;
  align-items: center;

  input[type='text']:focus {
    outline: none;
  }

  #add-text {
    height: 35px;
    background: #fff0;
    border: 0;
    width: 100%;
    color: rgba(231, 227, 252, 0.87);
    font-weight: bold;
  }

  .addmode-img-div {
    display: flex;

    img {
      cursor: pointer;
    }

    .delete-img {
      width: 25px;
    }
    .edit-img {
      width: 18px;
    }
  }
`

export default InputTextMod
