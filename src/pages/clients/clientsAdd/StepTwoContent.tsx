import { Box, Button, IconButton, SelectChangeEvent, Typography } from '@mui/material'
import { FC, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClient, ISolutionCard } from 'src/model/client/clientModel'
import ButtonGroup from './ButtonGroup'
import SolutionList from './SolutionList'

interface IStepTwoContent {
  initialData: IClient | null
  isEditMode: boolean
}

// 첫 번째 스텝 컴포넌트
const StepTwoContent: FC<IStepTwoContent> = ({ initialData, isEditMode }) => {
  const [solutionCards, setSolutionCards] = useState<ISolutionCard[]>([])

  const handleAddSolution = () => {
    setSolutionCards(prev => [
      ...prev,
      {
        id: prev.length,
        selectedSolution: '1',
        services: [{ id: '1', name: '', serviceType: '' }]
      }
    ])
  }

  const handleDeleteSolution = (index: number) => {
    setSolutionCards(prev => prev.filter((_, i) => i !== index))
  }

  const handleSelectChange = (index: number) => (event: SelectChangeEvent) => {
    setSolutionCards(prev =>
      prev.map((card, i) => (i === index ? { ...card, selectedSolution: event.target.value } : card))
    )
  }

  return (
    <>
      <Box mb={5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>총 {solutionCards.length}개의 분석 솔루션과 2개의 서비스가 등록되어 있습니다.</Typography>
          <Button variant='contained' startIcon={<IconCustom isCommon icon='plus' />} onClick={handleAddSolution}>
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

      {solutionCards.map((card, index) => (
        <Box key={card.id} mb={10}>
          <WindowCard
            leftContent={
              <CustomSelectBox
                value={card.selectedSolution}
                onChange={handleSelectChange(index)}
                options={[
                  { key: '1', value: '1', label: 'CVEDIA' },
                  { key: '2', value: '2', label: 'ProAI Edge' },
                  { key: '3', value: '3', label: 'Nex Real 3D' },
                  { key: '4', value: '4', label: 'ProAi Server' },
                  { key: '5', value: '5', label: 'VCA' },
                  { key: '6', value: '6', label: 'SAFR' },
                  { key: '7', value: '7', label: 'FA Signage' },
                  { key: '8', value: '8', label: 'FA Gate' }
                ]}
              />
            }
            rightContent={
              <IconButton onClick={() => handleDeleteSolution(index)}>
                <IconCustom isCommon icon={'DeleteOutline'} />
              </IconButton>
            }
          >
            <SolutionList
              services={card.services}
              onDelete={serviceId => {
                setSolutionCards(prev =>
                  prev.map((c, i) => (i === index ? { ...c, services: c.services.filter(s => s.id !== serviceId) } : c))
                )
              }}
              onAdd={() => {
                setSolutionCards(prev =>
                  prev.map((c, i) =>
                    i === index
                      ? {
                          ...c,
                          services: [
                            ...c.services,
                            {
                              id: String(c.services.length + 1),
                              name: ``,
                              serviceType: ''
                            }
                          ]
                        }
                      : c
                  )
                )
              }}
              onTypeChange={(serviceId, newType) => {
                setSolutionCards(prev =>
                  prev.map((c, i) =>
                    i === index
                      ? {
                          ...c,
                          services: c.services.map(s => (s.id === serviceId ? { ...s, serviceType: newType } : s))
                        }
                      : c
                  )
                )
              }}
              onUpdate={(serviceId, field, value) => {
                setSolutionCards(prev =>
                  prev.map((c, i) =>
                    i === index
                      ? {
                          ...c,
                          services: c.services.map(s => (s.id === serviceId ? { ...s, [field]: value } : s))
                        }
                      : c
                  )
                )
              }}
            />
          </WindowCard>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonGroup
              onNext={() => {
                console.log('onNext')
              }}
              onBack={() => {
                console.log('onBack')
              }}
            />
          </Box>
        </Box>
      ))}
    </>
  )
}

export default StepTwoContent
