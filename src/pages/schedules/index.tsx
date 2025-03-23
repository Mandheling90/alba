import { FC, useRef } from 'react'

// ** Full Calendar & it's Plugins
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import styled from 'styled-components'
import DateItem from './templates/DateItem'
import GateSelect from './templates/GateSelect'

// ** Types

const Index: FC = ({}): React.ReactElement => {
  const calendarRef = useRef<FullCalendar>(null)

  const blankEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
      calendar: '',
      guests: [],
      location: '',
      description: ''
    }
  }
  const calendarOptions: CalendarOptions = {
    locale: 'ko',
    events: [],
    plugins: [dayGridPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      // start: 'sidebarToggle, prev, next, title'
      // end: 'dayGridMonth'
      start: 'prev',
      center: 'title',
      end: 'next'
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

    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click() {
          // handleLeftSidebarToggle()
        }
      }
    },
    dayCellContent: ({ dayNumberText, isOther }) => {
      console.log('isOther', isOther)

      return <DateItem dayNumberText={dayNumberText} isOther={isOther} />
    }
  }

  return (
    <CalendarContainer>
      <GateSelect />
      <FullCalendar {...calendarOptions} ref={calendarRef} />
    </CalendarContainer>
  )
}

const CalendarContainer = styled.div`
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
`

export default Index
