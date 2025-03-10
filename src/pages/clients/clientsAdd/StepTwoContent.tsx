import { Box, Button, IconButton, SelectChangeEvent, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import IconCustom from 'src/layouts/components/IconCustom'
import { IClientDetail, ISolutionCard } from 'src/model/client/clientModel'
import SolutionList from './SolutionList'

interface IStepTwoContent {
  clientData: IClientDetail | null
  onDataChange: (data: Partial<IClientDetail>) => void
  disabled: boolean
}

// 첫 번째 스텝 컴포넌트
const StepTwoContent: FC<IStepTwoContent> = ({ clientData, onDataChange, disabled }) => {
  const [solutionCards, setSolutionCards] = useState<ISolutionCard[]>(clientData?.solutions || [])

  console.log(solutionCards)

  useEffect(() => {
    if (clientData?.solutions) {
      setSolutionCards(clientData.solutions)
    }
  }, [clientData])

  useEffect(() => {
    onDataChange({ solutions: solutionCards })
  }, [solutionCards])

  const handleAddSolution = () => {
    setSolutionCards(prev => [
      ...prev,
      {
        id: prev.length,
        selectedSolution: '1',
        services: [{ id: '0', name: '', serviceType: '' }]
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

  // 필수값 체크 함수 추가
  const isValidSolution = (index: number) => {
    const card = solutionCards[index]
    if (!card) return false

    // 모든 서비스의 name과 serviceType이 입력되었는지 확인
    return card.services.every(service => service.name.trim() !== '' && service.serviceType.trim() !== '')
  }

  return (
    <Box
      sx={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.3s'
      }}
    >
      <Box mb={5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>
            총 {clientData?.solutions?.length || 0}개의 분석 솔루션과
            {clientData?.solutions?.reduce((acc, sol) => acc + sol.services.length, 0) || 0}개의 서비스가 등록되어
            있습니다.
          </Typography>
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
                              serviceType: '1'
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
            <div className='button-wrapper'>
              <Button
                size='medium'
                variant='contained'
                onClick={() => {
                  if (isValidSolution(index)) {
                    console.log('등록')
                  } else {
                    alert('서비스 이름과 타입을 모두 입력해주세요.')
                  }
                }}
                sx={{ mr: 4 }}
                disabled={!isValidSolution(index)}
              >
                등록
              </Button>

              <Button
                size='medium'
                color='secondary'
                variant='outlined'
                onClick={() => {
                  setSolutionCards(prev =>
                    prev.map((c, i) =>
                      i === index
                        ? {
                            ...c,
                            selectedSolution: '1',
                            services: [{ id: '1', name: '', serviceType: '' }]
                          }
                        : c
                    )
                  )
                }}
                disabled={false}
              >
                취소
              </Button>
            </div>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default StepTwoContent
