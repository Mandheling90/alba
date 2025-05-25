import { Box } from '@mui/material'
import { FC } from 'react'
import { YN } from 'src/enum/commonEnum'
import { MAuthDuplicate } from 'src/model/commonModel'
import CustomAddCancelButton from './CustomAddCancelButton'

// 중복 확인 결과 컴포넌트
interface IDuplicateCheckResultProps {
  duplicateResult: MAuthDuplicate | null
  onCancel: () => void
  onConfirm: () => void
}

const DuplicateCheckResult: FC<IDuplicateCheckResultProps> = ({ duplicateResult, onCancel, onConfirm }) => {
  if (!duplicateResult) return null

  return (
    <>
      {duplicateResult.duplicateYn === YN.Y ? (
        duplicateResult.message
      ) : (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          사용 가능한 ID입니다.
          <CustomAddCancelButton onCancelClick={onCancel} onSaveClick={onConfirm} text={['사용', '취소']} />
        </Box>
      )}
    </>
  )
}

export default DuplicateCheckResult
