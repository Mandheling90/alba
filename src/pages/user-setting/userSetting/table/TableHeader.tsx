// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import { useState } from 'react'

import IconCustom from 'src/layouts/components/IconCustom'
import { useUserArrDel } from 'src/service/setting/userSetting'
import UserAddModModal from '../modal/UserAddModModal'

interface TableHeaderProps {
  plan: string
  value: string
  handleFilter: (val: string) => void
  handlePlanChange: (e: SelectChangeEvent) => void
  userCheck: string[]
  refetch: () => void
  onExport?: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, refetch, value, userCheck, onExport } = props
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: userDel } = useUserArrDel()

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      {isOpen && (
        <UserAddModModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
          onSubmitAfter={() => {
            refetch()
          }}
        />
      )}

      <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        startIcon={<IconCustom icon='mdi:export-variant' />}
        onClick={() => {
          onExport?.()
        }}
      >
        Export
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          placeholder='사용자 검색'
          sx={{ mr: 4, mb: 2 }}
          onChange={e => handleFilter(e.target.value)}
        />

        <Button
          sx={{ mr: 4, mb: 2 }}
          variant={'contained'}
          onClick={() => {
            setIsOpen(true)
          }}
        >
          사용자 추가
        </Button>
        <Button
          sx={{ mr: 4, mb: 2 }}
          variant={'contained'}
          onClick={async () => {
            const result = window.confirm('정말삭제 하시겠습니까?')

            if (result) {
              await userDel({ idList: userCheck })

              refetch()
            }
          }}
        >
          사용자 삭제
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
