import { useEffect, useRef } from 'react'

// ** Full Calendar & it's Plugins
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useLayout } from 'src/hooks/useLayout'
import styled from 'styled-components'
import { useScheduleContext } from '../contexts/scheduleContext'
import DateItem from './DateItem'

const ScheduleCalendar = () => {
  const calendarRef = useRef<FullCalendar>(null)
  const api = calendarRef.current?.getApi()

  const layoutContext = useLayout()
  const { selectedCustomerInfo } = useScheduleContext()
  const calendarOptions: CalendarOptions = {
    locale: 'ko',
    events: [],
    plugins: [dayGridPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    customButtons: {
      selectedCustomerButton: {
        text: '고객사',
        click: function () {
          console.log('clicked the custom button!')
        }
      },
      selectedCustomerInfo: {
        text: `${selectedCustomerInfo.customerId} ${selectedCustomerInfo.customerName}`
      },
      toggleSidebarButton: {
        text: '',
        click() {
          // handleLeftSidebarToggle()
          layoutContext.setLayoutDisplay(!layoutContext.layoutDisplay)
        }
      },
      selectedLocationButton: {
        icon: 'bi bi-list',
        click() {
          // handleLeftSidebarToggle()
        }
      },
      dummyButton: {
        text: ''
      }
    },

    headerToolbar: {
      start: 'toggleSidebarButton,selectedCustomerButton,selectedCustomerInfo',
      center: 'prev title next',
      end: 'dummyButton'
    },
    titleFormat: { year: 'numeric', month: 'short' },
    navLinkDayClick(date, jsEvent) {
      console.log('date', date)
      console.log('jsEvent', jsEvent)
    },
    editable: true,

    /*
    Enable resizing event from start
    ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
  */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }: any) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }: any) {
      console.log('clickedEvent', clickedEvent)
    },
    dayCellContent: ({ dayNumberText, isOther }) => {
      return <DateItem dayNumberText={dayNumberText} isOther={isOther} />
    }
  }

  useEffect(() => {
    setTimeout(() => {
      api?.updateSize()
    }, 320)
  }, [layoutContext.layoutDisplay])

  return (
    <CalendarContainer isLayoutDisplay={layoutContext.layoutDisplay}>
      <FullCalendar
        {...calendarOptions}
        ref={calendarRef}
        _resize={resize => {
          console.log('resize', resize)
        }}
      />
    </CalendarContainer>
  )
}

const CalendarContainer = styled.section<{ isLayoutDisplay: boolean }>`
  margin: 8px;
  width: 100%;
  padding: 24px 4px 4px 4px;
  .fc-daygrid-day-top {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    a {
      width: 100%;
      height: 100%;
      cursor: auto;
      text-decoration: none !important;
    }
  }
  .fc-daygrid-day-events {
    display: none;
  }
  .fc-daygrid-day-frame {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
  }
  .fc-toolbar-chunk {
    display: flex;
    align-items: center;
    button {
      border-color: #9155fd;
      background-color: #fff;
      color: #333;
      &:hover {
        background-color: #9155fd;
        color: #fff;
      }
    }
    .fc-toggleSidebarButton-button {
      ${({ isLayoutDisplay }) =>
        isLayoutDisplay
          ? `background-image: url('/images/common/camera-fold-icon.svg') !important;`
          : `background-image: url('/images/common/camera-open-icon.svg') !important;`}
      background-size: 50% !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      width: 80px;
      &:hover {
        ${({ isLayoutDisplay }) =>
          isLayoutDisplay
            ? `background-image: url('/images/common/camera-fold-hover-icon.svg') !important;`
            : `background-image: url('/images/common/camera-open-hover-icon.svg') !important;`}
      }
    }
    .fc-selectedCustomerInfo-button {
      pointer-events: none;
    }
    .fc-dummyButton-button {
      pointer-events: none;
      visibility: hidden;
      width: 200px;
    }
  }
`
export default ScheduleCalendar
