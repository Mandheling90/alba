import { Box, Button, IconButton, SelectChangeEvent, Typography } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import WindowCard from 'src/@core/components/molecule/WindowCard'
import { YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import {
  IAiSolutionCompanyList,
  IClientDetail,
  ISolutionList,
  MAiSolutionCompanyList,
  SOLUTION_USE_SERVER_TYPE
} from 'src/model/client/clientModel'
import {
  useAiSolutionCompanyDelete,
  useAiSolutionCompanyList,
  useAiSolutionCompanySave,
  useAiSolutionCompanyUpdate
} from 'src/service/client/clientService'
import SolutionServerList from './SolutionServerList'

export const isServerAddable = (solutionName: string) => {
  return (
    solutionName === SOLUTION_USE_SERVER_TYPE.CVEDIA ||
    solutionName === SOLUTION_USE_SERVER_TYPE.NEXREALAIBOX ||
    solutionName === SOLUTION_USE_SERVER_TYPE.SAFR ||
    solutionName === SOLUTION_USE_SERVER_TYPE.FA_GATE ||
    solutionName === SOLUTION_USE_SERVER_TYPE.PROAI_SERVER
  )
}

export const DefaultPackageSolution = (PackageSolution?: MAiSolutionCompanyList, remark?: string): ISolutionList => {
  return {
    aiSolutionId: PackageSolution?.id ?? 0,
    aiSolutionName: PackageSolution?.name ?? '',
    companySolutionId: 999,
    serverList: [
      {
        serverId: 999,
        serverName: '',
        serverIp: '',
        aiBoxId: '',
        aiBoxPassword: '',
        safrEventUrl: '',
        safrId: '',
        safrPassword: '',
        instanceList: [],
        remark: remark ?? ''
      }
    ]
  }
}

interface IStepTwoContent {
  aiData: IAiSolutionCompanyList | undefined
  onDataChange: (data: Partial<IClientDetail>) => void
  disabled: boolean
  companyNo: number
  refetch: () => void
}

const StepTwoContent: FC<IStepTwoContent> = ({ aiData, onDataChange, disabled, companyNo, refetch }) => {
  const { data } = useAiSolutionCompanyList()
  const { mutateAsync: saveAiSolutionCompany } = useAiSolutionCompanySave()
  const { mutateAsync: updateAiSolutionCompany } = useAiSolutionCompanyUpdate()
  const { mutateAsync: deleteAiSolutionCompany } = useAiSolutionCompanyDelete()

  const [solutionList, setSolutionList] = useState<ISolutionList[]>([])
  const originalAiData = useRef<IAiSolutionCompanyList | undefined>(undefined)

  useEffect(() => {
    if (aiData?.packageInfo?.packageYn === 'P') {
      const Package = data?.data?.find(item => item.name === SOLUTION_USE_SERVER_TYPE.PACKAGE)
      const PackageSolution = DefaultPackageSolution(Package, aiData.packageInfo.remark)
      const tempAiData = {
        ...aiData,
        solutionList: [...aiData.solutionList, PackageSolution]
      }

      originalAiData.current = tempAiData
      setSolutionList(tempAiData.solutionList)
    } else {
      originalAiData.current = aiData
      setSolutionList(aiData?.solutionList || [])
    }
  }, [aiData])

  useEffect(() => {
    onDataChange({ solutions: solutionList } as any)
  }, [solutionList])

  const handleAddSolution = () => {
    setSolutionList(prev => [
      ...prev,
      {
        aiSolutionId: prev.length + 1,
        aiSolutionName: 'CVEDIA',
        companySolutionId: prev.length + 1,
        serverList: []
      }
    ])
  }

  const handleDeleteSolution = async (companySolutionId: number) => {
    await deleteAiSolutionCompany({ companySolutionId: companySolutionId })
    refetch()

    // setSolutionList(prev => prev.filter(item => item.companySolutionId !== companySolutionId))
  }

  const handleSelectChange = (companySolutionId: number) => (event: SelectChangeEvent) => {
    const aiSolutionId = event.target.value
    const aiSolutionName = data?.data?.find(item => item.id.toString() === aiSolutionId)?.name || ''

    if (
      aiSolutionName === SOLUTION_USE_SERVER_TYPE.PACKAGE &&
      solutionList.find(item => item.aiSolutionName === SOLUTION_USE_SERVER_TYPE.PACKAGE)
    ) {
      alert('패키지 솔루션은 1개만 등록할 수 있습니다.')

      return
    }

    setSolutionList(prev =>
      prev.map(card => {
        if (card.companySolutionId === companySolutionId) {
          console.log('Updating solution with companySolutionId:', companySolutionId)

          if (isServerAddable(aiSolutionName)) {
            return {
              ...card,
              aiSolutionId: parseInt(aiSolutionId),
              aiSolutionName: aiSolutionName,
              serverList: []
            }
          } else {
            return {
              ...card,
              aiSolutionId: parseInt(aiSolutionId),
              aiSolutionName: aiSolutionName,
              serverList: [
                {
                  serverId: 0,
                  serverName: '',
                  serverIp: '',
                  aiBoxId: null,
                  aiBoxPassword: null,
                  safrEventUrl: null,
                  safrId: null,
                  safrPassword: null,
                  instanceList: []
                }
              ]
            }
          }
        }

        return card
      })
    )
  }

  const handleAddServer = (solutionIndex: number) => {
    setSolutionList(prev =>
      prev.map((solution, i) => {
        if (i === solutionIndex) {
          const newServerId =
            solution.serverList.length > 0 ? Math.max(...solution.serverList.map(s => s.serverId)) + 1 : 1

          return {
            ...solution,
            serverList: [
              ...solution.serverList,
              {
                serverId: newServerId,
                serverName: '',
                serverIp: '',
                aiBoxId: null,
                aiBoxPassword: null,
                safrEventUrl: null,
                safrId: null,
                safrPassword: null,
                instanceList: []
              }
            ]
          }
        }

        return solution
      })
    )
  }

  const handleAddInstance = (solutionIndex: number, serverId: number) => {
    setSolutionList(prev =>
      prev.map((solution, i) => {
        if (i === solutionIndex) {
          return {
            ...solution,
            serverList: solution.serverList.map(server => {
              if (server.serverId === serverId) {
                const newInstanceId =
                  server.instanceList.length > 0
                    ? Math.max(...server.instanceList.map(inst => inst.instanceId || 0)) + 1
                    : 1

                return {
                  ...server,
                  instanceList: [
                    ...server.instanceList,
                    {
                      instanceId: newInstanceId,
                      instanceName: '',
                      aiServiceId: 0,
                      aiServiceName: '',
                      cameraGroupId: '',
                      cameraNo: 0,
                      cameraId: '',
                      cameraName: '',
                      cameraIp: '',
                      areaNameList: []
                    }
                  ]
                }
              }

              return server
            })
          }
        }

        return solution
      })
    )
  }

  const handleDeleteInstance = (solutionIndex: number, serverId: number, instanceId: number) => {
    setSolutionList(prev =>
      prev.map((solution, i) => {
        if (i === solutionIndex) {
          return {
            ...solution,
            serverList: solution.serverList.map(server => {
              if (server.serverId === serverId) {
                return {
                  ...server,
                  instanceList: server.instanceList.filter(instance => instance.instanceId !== instanceId)
                }
              }

              return server
            })
          }
        }

        return solution
      })
    )
  }

  const handleUpdateInstance = (
    companySolutionId: number,
    serverId: number,
    instanceId: number,
    field: string,
    value: any
  ) => {
    setSolutionList(prev =>
      prev.map(solution => {
        if (solution.companySolutionId === companySolutionId) {
          return {
            ...solution,
            serverList: solution.serverList.map(server => {
              if (server.serverId === serverId) {
                return {
                  ...server,
                  instanceList: server.instanceList.map(instance => {
                    if (instance.instanceId === instanceId) {
                      return {
                        ...instance,
                        [field]: value
                      }
                    }

                    return instance
                  })
                }
              }

              return server
            })
          }
        }

        return solution
      })
    )
  }

  const handleUpdateServer = (companySolutionId: number, serverId: number, field: string, value: any) => {
    setSolutionList(prev =>
      prev.map(solution => {
        if (solution.companySolutionId === companySolutionId) {
          return {
            ...solution,
            serverList: solution.serverList.map(server => {
              if (server.serverId === serverId) {
                return {
                  ...server,
                  [field]: value
                }
              }

              return server
            })
          }
        }

        return solution
      })
    )
  }

  const handleRevertToOriginalState = (companySolutionId: number) => {
    const originalSolution = originalAiData.current?.solutionList?.find(
      solution => solution.companySolutionId === companySolutionId
    )

    if (originalSolution) {
      setSolutionList(prev =>
        prev.map(card => (card.companySolutionId === companySolutionId ? { ...originalSolution } : card))
      )
    } else {
      setSolutionList(prev =>
        prev.map(card =>
          card.companySolutionId === companySolutionId
            ? {
                ...card,
                aiSolutionId: 0,
                serverList: []
              }
            : card
        )
      )
    }
  }

  const isValidSolution = (index: number) => {
    const card = solutionList[index]
    if (!card) return false

    if (card.aiSolutionId === 0) return false

    if (card.serverList.length === 0) return false

    return card.serverList.every(server => {
      return true
    })
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
          <Typography variant='h5'>
            {solutionList?.length === 0 ? (
              '해당 고객사에 등록된 솔루션이 없습니다'
            ) : (
              <>
                총 {solutionList?.length || 0}개의 분석 솔루션과
                {solutionList?.reduce((acc: number, sol: ISolutionList) => acc + sol.serverList.length, 0) || 0}
                개의 서비스가 등록되어 있습니다.
              </>
            )}
          </Typography>
          <Button variant='contained' startIcon={<IconCustom isCommon icon='plus' />} onClick={handleAddSolution}>
            분석솔루션 추가
          </Button>
        </Box>
        <Box sx={{ my: 3 }}>
          <DividerBar />
        </Box>
        <Box>
          <Typography>
            {solutionList?.length === 0
              ? '해당 고객사에 등록된 서비스가 없습니다'
              : 'ProAI Edge는 카운팅 서비스에, CVEDIA는 밀집도분석 서비스에 사용됩니다.'}
          </Typography>
        </Box>
      </Box>

      {solutionList.map((card, index) => (
        <Box key={`${card.companySolutionId}_${index}`} mb={10}>
          <WindowCard
            leftContent={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Box>
                  <CustomSelectBox
                    value={card.aiSolutionId.toString()}
                    onChange={handleSelectChange(card.companySolutionId)}
                    options={
                      data?.data
                        ?.filter(item => item.dataStatus === YN.Y)
                        .map(item => ({
                          key: `${item.id}_${item.name}`,
                          value: item.id.toString(),
                          label: item.name
                        })) || []
                    }
                  />
                </Box>
                <Box>
                  {card.aiSolutionName !== SOLUTION_USE_SERVER_TYPE.PACKAGE && (
                    <Typography>
                      총 {card.serverList.reduce((acc, server) => acc + server.instanceList.length, 0)}대의 카메라
                      항목이 있습니다.
                    </Typography>
                  )}
                </Box>
              </Box>
            }
            rightContent={
              <>
                {isServerAddable(card.aiSolutionName) && (
                  <Button
                    variant='contained'
                    startIcon={<IconCustom isCommon icon='plus' />}
                    onClick={() => handleAddServer(index)}
                    sx={{ height: '20px', padding: '12px', mr: 1 }}
                  >
                    {card.aiSolutionName === SOLUTION_USE_SERVER_TYPE.NEXREALAIBOX ? 'AIBOX 추가' : '서버 추가'}
                  </Button>
                )}
                <IconButton onClick={() => handleDeleteSolution(card.companySolutionId)}>
                  <IconCustom isCommon icon={'DeleteOutline'} />
                </IconButton>
              </>
            }
          >
            {card.aiSolutionId === 0 ? (
              <Typography>분석솔루션을 선택해주세요.</Typography>
            ) : (
              <SolutionServerList
                solutionList={card}
                onDelete={serviceId => {
                  setSolutionList(prev =>
                    prev.map((c, i) =>
                      i === index ? { ...c, serverList: c.serverList.filter(s => s.serverId !== serviceId) } : c
                    )
                  )
                }}
                onAdd={() => handleAddServer(index)}
                onAddInstance={(serverId: number) => handleAddInstance(index, serverId)}
                onDeleteInstance={(serverId: number, instanceId: number) =>
                  handleDeleteInstance(index, serverId, instanceId)
                }
                onUpdateInstance={(serverId, instanceId, field, value) =>
                  handleUpdateInstance(card.companySolutionId, serverId, instanceId, field, value)
                }
                onUpdateServer={(serverId, field, value) =>
                  handleUpdateServer(card.companySolutionId, serverId, field, value)
                }
              />
            )}
          </WindowCard>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className='button-wrapper'>
              <Button
                size='medium'
                variant='contained'
                onClick={async () => {
                  if (!isValidSolution(index)) {
                    alert('서비스 이름과 타입을 모두 입력해주세요.')

                    return
                  }

                  try {
                    const isNewCard = !originalAiData.current?.solutionList?.some(
                      solution => solution.companySolutionId === card.companySolutionId
                    )
                    const remark =
                      solutionList.find(solution => solution.aiSolutionName === SOLUTION_USE_SERVER_TYPE.PACKAGE)
                        ?.serverList[0].remark ?? ''

                    const solutionData = {
                      ...card,
                      companyNo,
                      remark,
                      ...(card.aiSolutionName === SOLUTION_USE_SERVER_TYPE.PACKAGE && { serverList: [] })
                    }

                    if (isNewCard) {
                      await saveAiSolutionCompany(solutionData)
                    } else {
                      await updateAiSolutionCompany(solutionData)
                    }

                    refetch()
                  } catch (error) {
                    console.error('솔루션 등록 오류:', error)
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
                onClick={() => handleRevertToOriginalState(card.companySolutionId)}
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
