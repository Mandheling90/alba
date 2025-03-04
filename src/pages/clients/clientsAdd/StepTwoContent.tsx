import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClient } from 'src/model/client/clientModel'
import SolutionList from './SolutionList'
import SolutionSelect from './SolutionSelect'

interface IStepTwoContent {
  initialData: IClient | null
  isEditMode: boolean
}

// 첫 번째 스텝 컴포넌트
const StepTwoContent: FC<IStepTwoContent> = ({ initialData, isEditMode }) => {
  return (
    <Grid item xs={10}>
      <Box mb={5}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>총 2개의 분석 솔루션과 2개의 서비스가 등록되어 있습니다.</Typography>
          <Button
            size='small'
            variant='contained'
            startIcon={<IconCustom isCommon path='clients' icon='userAdd' />}
            onClick={() => {
              console.log('1')
            }}
          >
            분석솔루션 추가
          </Button>
        </Box>
        <Box sx={{ my: 3 }}>
          <DividerBar />
        </Box>
        <Box>
          <Typography>ProAI Edge는 카운팅 서비스에, CVEDIA는 밀집도분석 서비스에 사용됩니다.</Typography>
        </Box>
      </Box>

      <WindowCard
        leftContent={
          <SolutionSelect
            onChange={() => {
              console.log('1')
            }}
          />
        }
        rightContent={
          <IconButton
            onClick={() => {
              console.log('delete')
            }}
          >
            <IconCustom isCommon icon={'DeleteOutline'} />
          </IconButton>
        }
      >
        <SolutionList
          onDelete={e => {
            console.log(e)
          }}
        />
      </WindowCard>
    </Grid>
  )
}

export default StepTwoContent
