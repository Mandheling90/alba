import { Box, Checkbox, Collapse, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { chartColorList } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import IconCustom from 'src/layouts/components/IconCustom'

interface IGuoupSelect {
  id: number
  index: number
  title: string
  isGroup: boolean
  children: React.ReactNode
  isChecked: boolean
  onChecked: (checked: boolean) => void
  onDelete?: () => void
}

const GuoupSelect: React.FC<IGuoupSelect> = ({
  id,
  index,
  title,
  isGroup,
  children,
  isChecked,
  onChecked,
  onDelete
}) => {
  const statistics = useStatistics()

  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  return (
    <Box mb={2} pt={1.5} sx={{ width: '100%', background: expanded ? 'rgba(145, 85, 253, 0.05)' : '' }}>
      <Box display='flex' alignItems='center' justifyContent='space-between' sx={{ height: '30px' }}>
        <Box display='flex' alignItems='center'>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <IconCustom isCommon icon='folding' style={{ width: '10px' }} />
            ) : (
              <IconCustom isCommon icon='Fold' style={{ width: '10px' }} />
            )}
          </IconButton>

          {isGroup && (
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: chartColorList[index],
                borderRadius: '50%'
              }}
            />
          )}

          <Typography variant='body1' ml={1}>
            {title}
          </Typography>
        </Box>

        <Box display='flex' alignItems='center' justifyContent='flex-end'>
          {isGroup && (
            <>
              {expanded && (
                <>
                  <IconButton
                    onClick={() => {
                      onDelete?.()
                    }}
                  >
                    <IconCustom isCommon icon={'DeleteOutline'} />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: 'group-config',
                        query: { type: statistics.chartType, id: id }
                      })
                    }}
                  >
                    <IconCustom isCommon icon={'Edit'} />
                  </IconButton>
                </>
              )}

              <Checkbox
                checked={isChecked}
                onChange={e => {
                  onChecked(e.target.checked)
                }}
              />
            </>
          )}
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box ml={7} mt={2} mb={2}>
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}

export default GuoupSelect
