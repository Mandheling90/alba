import styled from '@emotion/styled'
import { ReactNode, useState } from 'react'
import { BatchItemProvider, useBatchItem } from '../contexts/batchItemContext'

interface IBatchItem {
  children: ReactNode
  number: string
  title: string
}

const BatchItem = ({ children, number, title }: IBatchItem) => {
  const [isApplied, setIsApplied] = useState(false)

  return (
    <BatchItemProvider isApplied={isApplied} setIsApplied={setIsApplied}>
      <Container>
        <TitleContainer>
          <Circle isApplied={isApplied} />
          <NumberFont>{number}</NumberFont>
          <TitleFont>{title}</TitleFont>
        </TitleContainer>
        <ContentContainer>
          <VerticalLine isApplied={isApplied} />
          <Content>{children}</Content>
        </ContentContainer>
      </Container>
    </BatchItemProvider>
  )
}

const BatchHandler = () => {
  const { setIsApplied } = useBatchItem()

  return (
    <BatchHandlerContainer>
      <BatchHandlerButtonApply onClick={() => setIsApplied(true)}></BatchHandlerButtonApply>
      <BatchHandlerButtonCancel onClick={() => setIsApplied(false)}></BatchHandlerButtonCancel>
    </BatchHandlerContainer>
  )
}

BatchItem.Handler = BatchHandler

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 12px 4px 12px 0px;
`

const Circle = styled.span<{ isApplied: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 5px solid #9155fd;
  opacity: ${({ isApplied }) => (isApplied ? 1 : 0.12)};
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
`

const VerticalLine = styled.section<{ isApplied: boolean }>`
  width: 3px;
  height: 100%;
  background-color: #9155fd;
  opacity: ${({ isApplied }) => (isApplied ? 1 : 0.12)};
  border-radius: 20px;
  margin: 0 12px;
`

const BatchHandlerContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-self: end;
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
  min-height: 36px;
  padding: 6px 18px;
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
