// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
import PickersRange from 'src/@core/components/atom/PickersRange'
import { useContents } from 'src/hooks/useContents'
import { MContentReq } from 'src/model/contents/contentsModel'

interface TableHeaderProps {
  plan: string
  value: string
  handleFilter: (val: string) => void
  handlePlanChange: (e: SelectChangeEvent) => void
  refetch: () => void
  onExport?: () => void
  onDelete?: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  const router = useRouter()
  const contents = useContents()

  const { onDelete } = props

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [reqPram, setReqPram] = useState<MContentReq>()

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ mr: 2 }}>
          <PickersRange
            useIcon={true}
            width={250}
            label={'게시일'}
            returnFormat='yyyy-MM-dd'
            onChange={(start, end) => {
              setReqPram({ startDate: start, endDate: end })
            }}
          />
        </Box>
        <TextField
          size='small'
          sx={{ width: '325px', mr: 2, mb: 2 }}
          value={reqPram?.keyword}
          placeholder='홍보물명, 게시위치, 게시자, 태그, 파일명'
          onChange={e => setReqPram({ keyword: e.target.value })}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
            }
          }}
        />

        <Button
          sx={{ mr: 2, mb: 2 }}
          variant={'contained'}
          onClick={() => {
            contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
          }}
        >
          검색
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          sx={{ mr: 2, mb: 2 }}
          variant={'contained'}
          onClick={() => {
            contents.setSelectedContent({})
            router.push('contents/contents-manager')
          }}
        >
          등록
        </Button>
        <Button
          sx={{ mr: 2, mb: 2 }}
          variant={'contained'}
          onClick={() => {
            onDelete?.()
          }}
        >
          삭제
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
