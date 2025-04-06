import { FC } from 'react'

// ** Full Calendar & it's Plugins
import 'bootstrap-icons/font/bootstrap-icons.css'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useLayout } from 'src/hooks/useLayout'
import styled from 'styled-components'
import { ScheduleContextProvider } from './contexts/scheduleContext'
import CustomerSearcher from './templates/CustomerSearcher'
import GateSelect from './templates/GateSelect'
import ScheduleCalendar from './templates/ScheduleCalendar'

// ** Types

const Index: FC = ({}): React.ReactElement => {
  const layoutContext = useLayout()

  return (
    <ScheduleContextProvider>
      <StandardTemplate title={'스케쥴 설정'}>
        <SlidingLayout
          isOpen={layoutContext.layoutDisplay}
          sideContent={
            <Section>
              <CustomerSearcher />
            </Section>
          }
          mainContent={
            <Section>
              <GateSelect />
              <ScheduleCalendar />
            </Section>
          }
          maxHeight='85vh'
        />
      </StandardTemplate>
    </ScheduleContextProvider>
  )
}

const Section = styled.section`
  margin: 8px;
`

export default Index
