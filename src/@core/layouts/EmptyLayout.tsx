// ** MUI Imports
import { useEffect, useState } from 'react'

// ** Types
import { createGlobalStyle } from 'styled-components'
import { BlankLayoutProps } from './types'

const EmptyLayout = ({ children }: BlankLayoutProps) => {
  const [showChildren, setShowChildren] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChildren(true)
    }, 500) // 3초 후에 children을 표시

    return () => clearTimeout(timer)
  }, [])

  const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  body {
    background: #150A2D; /* Dark purple background */
    color: #fff;
    overflow-x: hidden;
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }
`

  return (
    <>
      <GlobalStyle />
      {showChildren && children}
    </>
  )
}

export default EmptyLayout
