import { FC, useEffect } from 'react'
import { sidebarCss } from 'src/enum/sidebarLayout'

import styled from 'styled-components'
import { create } from 'zustand'

interface MSidebarLayoutStore {
  isLeftSidebarOpen: boolean
  isRightSidebarOpen: boolean
  windowHeight: number
}

interface MSidebarLayoutAction {
  setIsLeftSidebarOpen: (value?: boolean) => void
  setIsRightSidebarOpen: (value?: boolean) => void
  setWindowHeight: (value: number) => void
  clear: () => void
}

//기본 값
const defaultValue: MSidebarLayoutStore = {
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  windowHeight: 0
}

export const useSidebarLayoutStore = create<MSidebarLayoutStore & MSidebarLayoutAction>((set, get) => ({
  ...defaultValue,
  setIsLeftSidebarOpen: (value?: boolean) =>
    set(state => {
      return { ...state, isLeftSidebarOpen: value ? value : !state.isLeftSidebarOpen }
    }),
  setIsRightSidebarOpen: (value?: boolean) =>
    set(state => {
      return { ...state, isRightSidebarOpen: value ? value : !state.isRightSidebarOpen }
    }),
  setWindowHeight: (value: number) =>
    set(state => {
      return { ...state, windowHeight: value }
    }),
  clear: () =>
    set(() => {
      return defaultValue
    })
}))

interface ISidebarLayout {
  leftSide?: React.ReactNode
  rightSide?: React.ReactNode
  children: React.ReactNode
}

const SidebarLayout: FC<ISidebarLayout> = ({ leftSide, children }): React.ReactElement => {
  const { isLeftSidebarOpen, setWindowHeight } = useSidebarLayoutStore()

  useEffect(() => {
    function handleResize() {
      const windowHeight = window.innerHeight
      setWindowHeight(windowHeight)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Container>
      <Sidebar $isOpen={isLeftSidebarOpen} width={sidebarCss.width}>
        {leftSide}
      </Sidebar>
      <Content>{children}</Content>
      {/* <Sidebar isOpen={isRightSidebarOpen} width={sidebarCss.width}>
        {rightSide}
      </Sidebar> */}
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  // height: 100vh;
`

const Sidebar = styled.div<{ $isOpen: boolean; width: number }>`
  overflow-x: hidden;
  transition: width 0.3s ease;
  width: ${({ $isOpen, width }) => ($isOpen ? width + 'px' : '0')};
`

const Content = styled.div`
  flex: 1;
  padding: 0 10px 0 10px;
`

export default SidebarLayout
