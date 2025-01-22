import React, { FC, ReactNode, useState } from 'react'
import { isEmptyString } from 'src/utils/CommonUtil'
import styled from 'styled-components'
import InputTextMod from './InputTextMod'

interface ISettingListColums {
  src?: string
  srcSec?: string
  selected?: boolean
  placeholder?: string
  value?: string
  zonePointList?: string
  useTextMod?: boolean
  isSmall?: boolean
  readOnly?: boolean
  onClick?: (event?: React.MouseEvent<HTMLImageElement>) => void
  onClickSec?: (event?: React.MouseEvent<HTMLImageElement>) => void
  onModSubmit?: (value: string) => void
}

interface ConditionalWrapperProps {
  children: ReactNode
  condition: boolean
}

const SettingListColums: FC<ISettingListColums> = ({
  src = '/images/areaSetting/edit-on.svg',
  srcSec = '',
  selected = true,
  placeholder = '',
  value = '',
  zonePointList = '',
  useTextMod = false,
  isSmall = false,
  readOnly = false,
  onClick,
  onClickSec,
  onModSubmit
}): React.ReactElement => {
  const [textMod, setTextMod] = useState(false)
  const isTwo = !isEmptyString(srcSec ?? '')
  const valuePre = value === '0,0' ? '' : value

  const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({ children, condition }) => {
    return condition ? <div>{children}</div> : <>{children}</>
  }

  return (
    <>
      {useTextMod && textMod ? (
        <InputTextMod
          defaultValue={!isEmptyString(zonePointList) ? zonePointList : valuePre}
          placeholder={placeholder}
          onSubmit={value => {
            onModSubmit && onModSubmit(value)
            setTextMod(false)
          }}
          onCancel={() => {
            setTextMod(false)
          }}
        ></InputTextMod>
      ) : (
        <AddOneButton $selected={selected} $isTwo={isTwo} $isSmall={isSmall}>
          <ConditionalWrapper condition={isTwo}>
            {!readOnly && (
              <>
                <img
                  className='colum-img'
                  src={src}
                  onClick={(event: React.MouseEvent<HTMLImageElement>) => {
                    setTextMod(true)
                    onClick && onClick(event)
                    event?.stopPropagation()
                  }}
                  alt='edit'
                />

                {isTwo && (
                  <img
                    className='colum-img-sec'
                    src={srcSec}
                    onClick={(event: React.MouseEvent<HTMLImageElement>) => {
                      onClickSec && onClickSec(event)
                      event?.stopPropagation()
                    }}
                    alt='edit'
                  />
                )}
              </>
            )}
          </ConditionalWrapper>

          <span className='display-value'>{!isEmptyString(valuePre ?? '') ? valuePre : placeholder}</span>
        </AddOneButton>
      )}
    </>
  )
}

const AddOneButton = styled.div<{ $selected?: boolean; $isTwo?: boolean; $isSmall?: boolean }>`
  position: relative;
  display: inline-block;
  text-overflow: ellipsis;
  width: 100%;

  .colum-img {
    ${({ $isTwo }) => !$isTwo && 'position: absolute;left: 40%;'}
    ${({ $selected }) => $selected && 'opacity: 0;'}
  }

  div {
    position: absolute;

    ${({ $isSmall }) => ($isSmall ? 'left: 5%;' : 'left: 35%;')}
    display: flex;
    align-items: center;

    .colum-img-sec {
      ${({ $selected }) => $selected && 'opacity: 0;'}
      margin: 0 10px;
    }
  }

  .defaultValue {
    color: rgb(231 227 252 / 15%);
  }

  span {
    color: rgb(231 227 252 / 15%);

    ${({ $selected }) => (!$selected ? 'color: rgb(231 227 252 / 10%);' : 'color: rgb(231 227 252 / 100%);')}
  }

  &:hover {
    .display-value {
      color: rgb(231 227 252 / 10%) !important;
    }

    .colum-img {
      opacity: 1 !important;
    }

    div {
      .colum-img-sec {
        opacity: 1 !important;
      }
    }
  }
`
export default SettingListColums
