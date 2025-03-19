import { IconButton } from '@mui/material'
import format from 'date-fns/format'
import { useRef, useState } from 'react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import IconCustom from 'src/layouts/components/IconCustom'
import styled from 'styled-components'

export type DateType = Date | null | undefined

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
`

const TooltipText = styled.div`
  visibility: visible; /* 항상 보이도록 설정 */
  width: 305px; /* 툴팁의 너비 */
  background-color: #555; /* 툴팁 배경 색상 */
  color: #fff; /* 텍스트 색상 */
  text-align: center;
  border-radius: 6px; /* 둥근 모서리 */
  padding: 5px; /* 내부 여백 */
  position: absolute;
  z-index: 1;
  top: 100%; /* 아이콘 아래에 위치 */
  left: 50%;
  margin-left: -20px; /* 툴팁의 중앙을 아이콘에 맞추기 */
  opacity: 0.8; /* 투명도 조정 */
  transition: opacity 0.3s; /* 툴팁의 부드러운 전환 */

  /* 화살표 스타일 */
  &::after {
    content: '';
    position: absolute;
    bottom: 100%; /* 툴팁 위에 위치 */
    left: 6.5%;
    margin-left: -5px; /* 화살표 중앙 정렬 */
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #555 transparent; /* 위쪽으로 향하는 화살표 색상 */
  }
`

const PickersRangeIcon = ({
  popperPlacement,
  onChange
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
  onChange: (start: string, end: string) => void
}) => {
  const datePickerRef = useRef<any>(null)
  const [startDate, setStartDate] = useState<DateType>()
  const [endDate, setEndDate] = useState<DateType>()
  const [showTooltip, setShowTooltip] = useState(true)

  // 아이콘 클릭 시 DatePicker를 오픈하는 함수
  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true)
    }
  }

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (start && end) {
      onChange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))

      setShowTooltip(false) // 날짜가 입력되면 툴팁 숨기기
    } else {
      // setShowTooltip(true) // 날짜가 입력되지 않으면 툴팁 보이기
    }
  }

  // useEffect(() => {
  //   if (statistics.requiredFields === 'date') {
  //     setShowTooltip(true)
  //   } else {
  //     setShowTooltip(false)
  //   }
  // }, [statistics.requiredFields])

  return (
    <>
      {/* 아이콘 버튼과 툴팁 */}
      <Tooltip>
        <IconButton onClick={handleIconClick}>
          <IconCustom icon='carbon_calendar' isCommon style={{ cursor: 'pointer' }} />
        </IconButton>
        {showTooltip && (
          <TooltipText>
            통계 기간을 먼저 선택한 후, 통계 설정을 완료하고 적용 버튼({' '}
            <IconCustom icon='ApplyIcon' isCommon style={{ margin: '-3px' }} /> )을 클릭하세요.
          </TooltipText>
        )}
      </Tooltip>

      {/* DatePicker - ref를 사용하여 아이콘 클릭 시 열림 */}
      <DatePickerWrapper>
        <DatePicker
          selectsRange
          endDate={endDate}
          selected={startDate}
          startDate={startDate}
          id='date-range-picker'
          onChange={handleOnChange}
          ref={datePickerRef}
          onClickOutside={() => datePickerRef.current.setOpen(false)}
          shouldCloseOnSelect={false}
          dateFormat='yyyy-MM-dd'
          popperPlacement={popperPlacement}
          customInput={<></>} // input을 숨기기 위해 빈 컴포넌트 전달
        />
      </DatePickerWrapper>
    </>
  )
}

export default PickersRangeIcon
