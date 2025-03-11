import { Box, Typography } from '@mui/material'
import { FC } from 'react'

interface IPipelineTitle {
  Icon?: React.ReactNode
  title?: string[]
}

const PipelineTitle: FC<IPipelineTitle> = ({ Icon, title }): React.ReactElement => {
  return (
    <Box display='flex' alignItems='center' m={3}>
      {(title ?? []).map((t, i) => (
        <Box key={t} sx={{ display: 'flex', alignItems: 'center' }}>
          {i === 0 && Icon && <Box mr={2}>{Icon}</Box>}
          <Typography variant={i === 0 ? 'h6' : 'body1'}>{t}</Typography>
          {i !== (title?.length ?? 0) - 1 && <Typography sx={{ mx: 3 }}>|</Typography>}
        </Box>
      ))}
    </Box>
  )
}

export default PipelineTitle
