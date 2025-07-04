import { Grid, Slide } from '@mui/material'
import { FC, ReactNode, useState } from 'react'

interface SlidingLayoutProps {
  isOpen: boolean
  sideContent: ReactNode
  mainContent: ReactNode
  sideWidth?: number
  spacing?: number
  maxHeight?: string
  minHeight?: string
}

const SlidingLayout: FC<SlidingLayoutProps> = ({
  isOpen,
  sideContent,
  mainContent,
  sideWidth = 3,
  spacing = 5,
  maxHeight = '85vh',
  minHeight = '85vh'
}) => {
  const [gridSize, setGridSize] = useState(isOpen ? 12 - sideWidth : 12)

  return (
    <Grid container spacing={spacing} sx={{ minHeight, height: '100%' }}>
      <Slide
        direction='right'
        in={isOpen}
        mountOnEnter
        unmountOnExit
        onEnter={() => setGridSize(12 - sideWidth)}
        onExited={() => setGridSize(12)}
      >
        <Grid
          item
          xs={sideWidth}
          sx={{
            maxHeight,
            minHeight,
            overflow: 'auto'
          }}
        >
          {sideContent}
        </Grid>
      </Slide>

      <Grid item xs={gridSize}>
        {mainContent}
      </Grid>
    </Grid>
  )
}

export default SlidingLayout
