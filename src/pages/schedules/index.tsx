import { FC, useState } from 'react'

// ** Full Calendar & it's Plugins
import 'bootstrap-icons/font/bootstrap-icons.css'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useLayout } from 'src/hooks/useLayout'
import styled from 'styled-components'
import ClientListGrid from '../user-setting/client/ClientListGrid'
import { ScheduleContextProvider } from './contexts/scheduleContext'
import GateSelect from './templates/GateSelect'
import ScheduleBatchConfig from './templates/ScheduleBatchConfig'
import ScheduleCalendar from './templates/ScheduleCalendar'

// ** Types

const Index: FC = ({}): React.ReactElement => {
  const layoutContext = useLayout()
  const [selectedGate, setSelectedGate] = useState<string>('')

  return (
    <ScheduleContextProvider>
      <StandardTemplate title={'스케쥴 설정'}>
        <SlidingLayout
          isOpen={layoutContext.layoutDisplay}
          sideContent={<ClientListGrid />}
          mainContent={
            <Section>
              <CalendarContainer>
                <GateSelect
                  value={selectedGate}
                  onChange={event => setSelectedGate(event.target.value as string)}
                  label='캘린더 표시장소'
                />
                <ScheduleCalendar />
              </CalendarContainer>
              <BatchConfigContainer>
                <ScheduleBatchConfig />
              </BatchConfigContainer>
            </Section>
          }
          maxHeight='85vh'
        />
      </StandardTemplate>
    </ScheduleContextProvider>
  )
}

const Section = styled.section`
  margin-top: 96px;
  display: flex;
  gap: 16px;
`
const CalendarContainer = styled.div`
  flex: 3;
`
const BatchConfigContainer = styled.div`
  flex: 1;
`

export default Index
