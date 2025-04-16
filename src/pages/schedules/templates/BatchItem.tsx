import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { ApplyStatusType, BatchItemProvider, useBatchItem } from '../contexts/batchItemContext'
import DateRangePicker from './DateRangePicker'
import DaySelect from './DaySelect'
import WorkTimeSelect from './WorkTimeSelect'
import WorkTypeRadio from './WorkTypeRadio'

interface IBatchItem {
  children: ReactNode
}

const BatchItem = ({ children }: IBatchItem) => {
  return (
    <BatchItemProvider>
      <Container>{children}</Container>
    </BatchItemProvider>
  )
}

interface IBatchTitle {
  number?: string
  title?: string
}
const BatchTitle = ({ number, title }: IBatchTitle) => {
  const { applyStatus } = useBatchItem()

  return (
    <TitleContainer>
      <Circle applyStatus={applyStatus} />
      <NumberFont>{number}</NumberFont>
      <TitleFont>{title}</TitleFont>
    </TitleContainer>
  )
}

const BatchContent = ({ children }: IBatchItem) => {
  const { applyStatus } = useBatchItem()

  return (
    <ContentContainer>
      <VerticalLine applyStatus={applyStatus} />
      <Content>{children}</Content>
    </ContentContainer>
  )
}

const BatchHandler = () => {
  const { setApplyStatus } = useBatchItem()

  return (
    <BatchHandlerContainer>
      <BatchHandlerButtonApply onClick={() => setApplyStatus('applied')}></BatchHandlerButtonApply>
      <BatchHandlerButtonCancel onClick={() => setApplyStatus('notApplied')}></BatchHandlerButtonCancel>
    </BatchHandlerContainer>
  )
}

BatchItem.Title = BatchTitle
BatchItem.Content = BatchContent
BatchItem.Handler = BatchHandler
BatchItem.DaySelect = DaySelect
BatchItem.DateRangePicker = DateRangePicker
BatchItem.WorkTypeRadio = WorkTypeRadio
BatchItem.WorkTimeSelect = WorkTimeSelect

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 12px 4px 12px 0px;
`

const Circle = styled.span<{ applyStatus: ApplyStatusType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #9155fd;
  :after {
    content: '';
  }
  opacity: ${({ applyStatus }) => (applyStatus !== 'notApplied' ? 1 : 0.12)};
  ${({ applyStatus }) =>
    applyStatus === 'notApplied'
      ? css`
          :after {
            display: block;
            width: 70%;
            height: 70%;
            background: #fff;
            border-radius: 50%;
          }
        `
      : applyStatus === 'writing'
      ? css`
          :after {
            display: block;
            width: 50%;
            height: 50%;
            background: #fff;
            border-radius: 50%;
          }
        `
      : applyStatus === 'applied'
      ? css`
          background-image: url('/images/check-white.svg');
          background-size: 16px 16px;
          background-position: center;
          background-repeat: no-repeat;
        `
      : null}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const NumberFont = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #3a3541de;
`

const TitleFont = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #3a3541de;
`

const ContentContainer = styled.div`
  display: flex;
  gap: 16px;
`

const Content = styled.div`
  padding: 4px 11px 23px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VerticalLine = styled.section<{ applyStatus: ApplyStatusType }>`
  width: 3px;
  height: 100%;
  background-color: #9155fd;
  opacity: ${({ applyStatus }) => (applyStatus !== 'notApplied' ? 1 : 0.12)};
  border-radius: 20px;
  margin: 0 12px;
`

const BatchHandlerContainer = styled.div`
  display: flex;
  gap: 8px;
  height: fit-content;
`

const BatchHandlerButton = styled.button`
  border-radius: 4px;
  background: #9155fd;
  color: #fff;
  outline: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  min-width: 36px;
  min-height: 20px;
  padding: 4px 8px;
`

const BatchHandlerButtonApply = styled(BatchHandlerButton)`
  :hover {
    background: url('/images/apply.svg') no-repeat center center / 100% 100%;
    :after {
      content: '';
    }
  }
  :after {
    content: '적용';
  }
`

const BatchHandlerButtonCancel = styled(BatchHandlerButton)`
  :hover {
    background: url('/images/cancel.svg') no-repeat center center / 100% 100%;
    :after {
      content: '';
    }
  }
  :after {
    content: '취소';
  }
`

export default BatchItem
