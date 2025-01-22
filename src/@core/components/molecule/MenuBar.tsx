import { ToggleButton } from '@mui/material'
import { FC } from 'react'
import styled from 'styled-components'
import { useSidebarLayoutStore } from '../layout/SidebarLayout'

interface IMenuBar {
  leftGridIcon?: string
  useLeftGrid?: boolean
  useLeftToggle?: boolean
  leftGrid?: React.ReactNode
  centerGrid?: React.ReactNode
  centerGridLeftAlign?: boolean
  rightGrid?: React.ReactNode
  rightGridRightAlign?: boolean
}

const MenuBar: FC<IMenuBar> = ({
  leftGridIcon = 'carbon:map',
  useLeftGrid = true,
  useLeftToggle = true,
  leftGrid,
  centerGrid,
  centerGridLeftAlign = false,
  rightGrid
}): React.ReactElement => {
  const { isLeftSidebarOpen, setIsLeftSidebarOpen } = useSidebarLayoutStore()

  return (
    <ManuGrid>
      {useLeftGrid && (
        <LeftGrid>
          <LeftGridWrap>
            {useLeftToggle && (
              <>
                {isLeftSidebarOpen && (
                  <img
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setIsLeftSidebarOpen()
                    }}
                    src='/images/ios-arrow-24-regular.svg'
                    alt='left'
                  />
                )}
                <ToggleButton
                  value='check'
                  selected={isLeftSidebarOpen}
                  onChange={() => {
                    setIsLeftSidebarOpen()
                  }}
                >
                  <img src={'/images/map.svg'} alt={'map'} />
                </ToggleButton>
                {!isLeftSidebarOpen && (
                  <img
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setIsLeftSidebarOpen()
                    }}
                    src='/images/ios-arrow-rtl-24-regular.svg'
                    alt='right'
                  />
                )}
              </>
            )}

            {leftGrid && leftGrid}
          </LeftGridWrap>
        </LeftGrid>
      )}

      <CenterGridDiv $isMapMode={centerGridLeftAlign}>
        <CenterGridContent>{centerGrid && centerGrid}</CenterGridContent>
      </CenterGridDiv>

      {rightGrid && <RightGridDiv>{rightGrid}</RightGridDiv>}
    </ManuGrid>
  )
}

const ManuGrid = styled.div`
  width: 100%;
  display: flex;
`
const LeftGrid = styled.div`
  flex: 0 0 auto;
  padding-right: 30px;
`
const LeftGridWrap = styled.div`
  display: flex;
  align-items: center;
`

const CenterGridDiv = styled.div<{ $isMapMode: boolean }>`
  flex: ${({ $isMapMode }) => $isMapMode && 1};
  .center-grid-item {
    padding: 0 5px;
  }
`
const CenterGridContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const RightGridDiv = styled.div`
  flex: 1;
`

export default MenuBar
