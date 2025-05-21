import { Box, Button, IconButton, SelectChangeEvent, Typography } from '@mui/material'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import WindowCard from 'src/@core/components/molecule/WindowCard'

import { YN } from 'src/enum/commonEnum'
import { useModal } from 'src/hooks/useModal'
import IconCustom from 'src/layouts/components/IconCustom'
import {
  IAiSolutionCompanyList,
  IAiSolutionCompanyPackageParam,
  IClientDetail,
  ISolutionList,
  MAiSolutionCompanyList,
  SOLUTION_TYPE_ID,
  isNonServerSolution,
  isServerUsingSolution
} from 'src/model/client/clientModel'
import {
  useAiSolutionCompanyDelete,
  useAiSolutionCompanyList,
  useAiSolutionCompanyPackageDelete,
  useAiSolutionCompanyPackageSave,
  useAiSolutionCompanyPackageUpdate,
  useAiSolutionCompanySave,
  useAiSolutionCompanyUpdate,
  useAiSolutionInstanceDelete,
  useAiSolutionServerDelete
} from 'src/service/client/clientService'
import SolutionServerList from './SolutionServerList'

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
  const { setSimpleDialogModalProps, showModal, resetModal } = useModal()

  const { data } = useAiSolutionCompanyList()
  const { mutateAsync: saveAiSolutionCompany } = useAiSolutionCompanySave()
  const { mutateAsync: updateAiSolutionCompany } = useAiSolutionCompanyUpdate()
  const { mutateAsync: deleteAiSolutionCompany } = useAiSolutionCompanyDelete()
  const { mutateAsync: saveAiSolutionCompanyPackage } = useAiSolutionCompanyPackageSave()
  const { mutateAsync: updateAiSolutionCompanyPackage } = useAiSolutionCompanyPackageUpdate()
  const { mutateAsync: deleteAiSolutionCompanyPackage } = useAiSolutionCompanyPackageDelete()
  const { mutateAsync: deleteAiSolutionServer } = useAiSolutionServerDelete()
  const { mutateAsync: deleteAiSolutionInstance } = useAiSolutionInstanceDelete()

  const [solutionList, setSolutionList] = useState<ISolutionList[]>([])
  const originalAiData = useRef<IAiSolutionCompanyList | undefined>(undefined)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedSolutionId, setSelectedSolutionId] = useState<number | null>(null)
  const [deleteType, setDeleteType] = useState<'solution' | 'server' | 'instance' | 'warning'>('solution')
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null)
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null)
  const [warningMessage, setWarningMessage] = useState<string>('')

  useEffect(() => {
    if (aiData?.packageInfo?.packageYn === 'P') {
      const Package = data?.data?.find(item => item.id === SOLUTION_TYPE_ID.PACKAGE)
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
        aiSolutionId: 0,
        aiSolutionName: '',
        companySolutionId: prev.length + 1,
        serverList: [],
        isNew: true
      }
    ])
  }

  const handleDeleteSolution = async (companySolutionId: number) => {
    // 솔루션 정보 찾기
    const solution = solutionList.find(item => item.companySolutionId === companySolutionId)

    if (!solution) return

    // 패키지는 그대로 삭제
    if (solution.aiSolutionId === SOLUTION_TYPE_ID.PACKAGE) {
      await deleteAiSolutionCompanyPackage({ companyNo: companyNo })
      refetch()

      return
    }

    // 서버를 사용하는 솔루션인지 확인
    const isServerSolution = isServerUsingSolution(solution.aiSolutionId)

    if (isServerSolution) {
      // 서버를 사용하는 솔루션인 경우, 서버가 있는지 확인
      if (solution.serverList && solution.serverList.length > 0) {
        // setWarningMessage('서버를 사용하는 솔루션은 모든 서버를 먼저 삭제한 후 솔루션을 삭제할 수 있습니다.')
        await showModal({
          title: '솔루션 정보 삭제',
          contents: '서버를 사용하는 솔루션은 모든 서버를 먼저 삭제한 후 솔루션을 삭제할 수 있습니다.'
        })
        setDeleteType('warning')

        return
      }
    } else {
      // 서버를 사용하지 않는 솔루션인 경우, 인스턴스가 있는지 확인
      const hasInstances = solution.serverList.some(server => server.instanceList && server.instanceList.length > 0)

      if (hasInstances) {
        // setWarningMessage('모든 인스턴스를 먼저 삭제한 후 솔루션을 삭제할 수 있습니다.')
        await showModal({
          title: '솔루션 정보 삭제',
          contents: '모든 인스턴스를 먼저 삭제한 후 솔루션을 삭제할 수 있습니다.'
        })
        setDeleteType('warning')

        return
      }
    }

    handleConfirmDelete('solution', companySolutionId)
  }

  const handleDeleteServer = async (serverId: number) => {
    // 서버에 연결된 인스턴스가 있는지 확인
    const server = solutionList.flatMap(solution => solution.serverList).find(server => server.serverId === serverId)

    if (server && server.instanceList && server.instanceList.length > 0) {
      // 인스턴스가 있는 경우 경고 메시지 표시

      await showModal({
        title: '서버 정보 삭제',
        contents: '서버에 포함되어 있는 모든 카메라 정보를 삭제 후 서버를 삭제할 수 있습니다.'
      })

      setDeleteType('warning')

      return
    }

    handleConfirmDelete('server', undefined, serverId)
  }

  const handleDeleteInstance = async (solutionIndex: number, serverId: number, instanceId: number) => {
    handleConfirmDelete('instance', undefined, serverId, instanceId)
  }

  const handleConfirmDelete = useCallback(
    async (
      deleteType: 'solution' | 'server' | 'instance' | 'warning',
      selectedSolutionId?: number,
      selectedServerId?: number,
      selectedInstanceId?: number
    ) => {
      console.log(deleteType)

      try {
        switch (deleteType) {
          case 'solution':
            if (selectedSolutionId) {
              const isExistingSolution = originalAiData.current?.solutionList?.some(
                solution => solution.companySolutionId === selectedSolutionId
              )

              if (isExistingSolution) {
                await deleteAiSolutionCompany({ companySolutionId: selectedSolutionId })
                refetch()
              } else {
                setSolutionList(prev => prev.filter(solution => solution.companySolutionId !== selectedSolutionId))
              }
            }
            break
          case 'server':
            if (selectedServerId) {
              const isExistingServer = originalAiData.current?.solutionList?.some(solution =>
                solution.serverList.some(server => server.serverId === selectedServerId)
              )

              if (isExistingServer) {
                await deleteAiSolutionServer({ serverId: selectedServerId })
                refetch()
              } else {
                setSolutionList(prev =>
                  prev.map(solution => ({
                    ...solution,
                    serverList: solution.serverList.filter(server => server.serverId !== selectedServerId)
                  }))
                )
              }
            }
            break
          case 'instance':
            if (selectedServerId && selectedInstanceId) {
              const isExistingInstance = originalAiData.current?.solutionList?.some(solution =>
                solution.serverList.some(server =>
                  server.instanceList.some(instance => instance.instanceId === selectedInstanceId)
                )
              )

              if (isExistingInstance) {
                await deleteAiSolutionInstance({ instanceId: selectedInstanceId })
                refetch()
              } else {
                setSolutionList(prev =>
                  prev.map(solution => ({
                    ...solution,
                    serverList: solution.serverList.map(server => {
                      if (server.serverId === selectedServerId) {
                        return {
                          ...server,
                          instanceList: server.instanceList.filter(
                            instance => instance.instanceId !== selectedInstanceId
                          )
                        }
                      }

                      return server
                    })
                  }))
                )
              }
            }
            break
          case 'warning':
            // 경고 메시지의 경우 아무 작업도 수행하지 않음
            break
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error)
      } finally {
        setDeleteModalOpen(false)
        setSelectedSolutionId(null)
        setSelectedServerId(null)
        setSelectedInstanceId(null)
        setWarningMessage('')
      }
    },
    [
      originalAiData,
      deleteAiSolutionCompany,
      deleteAiSolutionServer,
      deleteAiSolutionInstance,
      refetch,
      setSolutionList,
      setDeleteModalOpen,
      setSelectedSolutionId,
      setSelectedServerId,
      setSelectedInstanceId,
      setWarningMessage
    ]
  )

  const handleSelectChange = (companySolutionId: number) => (event: SelectChangeEvent) => {
    const aiSolutionIdTarget = event.target.value
    const aiSolutionName = data?.data?.find(item => item.id.toString() === aiSolutionIdTarget)?.name || ''
    const aiSolutionId = data?.data?.find(item => item.id.toString() === aiSolutionIdTarget)?.id || 0

    if (
      aiSolutionId === SOLUTION_TYPE_ID.PACKAGE &&
      solutionList.find(item => item.aiSolutionId === SOLUTION_TYPE_ID.PACKAGE)
    ) {
      alert('패키지 솔루션은 1개만 등록할 수 있습니다.')

      return
    }

    setSolutionList(prev =>
      prev.map(card => {
        if (card.companySolutionId === companySolutionId) {
          console.log('Updating solution with companySolutionId:', companySolutionId)

          if (isServerUsingSolution(aiSolutionId)) {
            return {
              ...card,
              aiSolutionId: aiSolutionId,
              aiSolutionName: aiSolutionName,
              isNew: true,
              serverList: []
            }
          } else {
            return {
              ...card,
              aiSolutionId: aiSolutionId,
              aiSolutionName: aiSolutionName,
              isNew: true,
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
                instanceList: [],
                isNew: true
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
                      areaNameList: [],
                      isNew: true
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
    <>
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
              {solutionList?.filter(item => item.aiSolutionId !== 0).filter(item => item.isNew !== true).length ===
              0 ? (
                '해당 고객사에 등록된 솔루션이 없습니다'
              ) : (
                <>
                  총 {solutionList?.length || 0}개의 분석 솔루션과{' '}
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
              {solutionList?.filter(item => item.aiSolutionId !== 0).filter(item => item.isNew !== true).length === 0
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
                    {card.aiSolutionId !== SOLUTION_TYPE_ID.PACKAGE && card.aiSolutionId !== 0 && (
                      <Typography>
                        총 {card.serverList.reduce((acc, server) => acc + server.instanceList.length, 0)}대의 카메라
                        항목이 있습니다.
                      </Typography>
                    )}

                    {card.aiSolutionId === 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconCustom isCommon path='clients' icon='SOLUTION_CURSOR' />
                        <Typography>등록할 솔루션을 선택하세요</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              }
              rightContent={
                <>
                  {isServerUsingSolution(card.aiSolutionId) && (
                    <Button
                      variant='contained'
                      startIcon={<IconCustom isCommon icon='plus' />}
                      onClick={() => handleAddServer(index)}
                      sx={{ height: '20px', padding: '12px', mr: 1 }}
                    >
                      {card.aiSolutionId === SOLUTION_TYPE_ID.NEX_REAL_AIBOX ? 'AIBOX 추가' : '서버 추가'}
                    </Button>
                  )}
                  <IconButton
                    onClick={() => {
                      setSimpleDialogModalProps({
                        open: true,
                        title: '솔루션 정보 삭제',
                        contents: (
                          <Typography sx={{ color: 'rgba(58, 53, 65, 0.6)', fontSize: 16, fontWeight: 400 }}>
                            선택하신 솔루션을 <b>삭제</b>하시겠습니까? 삭제후에는 <b>복원할 수 없습니다.</b>
                          </Typography>
                        ),
                        isConfirm: true,
                        confirmFn: () => {
                          setTimeout(() => {
                            handleDeleteSolution(card.companySolutionId)
                          }, 100)
                        }
                      })
                    }}
                  >
                    <IconCustom isCommon icon={'DeleteOutline'} />
                  </IconButton>
                </>
              }
            >
              {card.aiSolutionId === 0 ? (
                <Typography>등록된 솔루션이 없습니다.</Typography>
              ) : (
                <SolutionServerList
                  solutionList={card}
                  onDelete={serviceId => {
                    setSimpleDialogModalProps({
                      open: true,
                      title: '서버 정보 삭제',
                      contents: (
                        <Typography sx={{ color: 'rgba(58, 53, 65, 0.6)', fontSize: 16, fontWeight: 400 }}>
                          선택하신 서버를 <b>삭제</b>하시겠습니까? 삭제후에는 <b>복원할 수 없습니다.</b>
                        </Typography>
                      ),
                      isConfirm: true,
                      confirmFn: () => {
                        setTimeout(() => {
                          handleDeleteServer(serviceId)
                        }, 100)
                      }
                    })
                  }}
                  onAdd={() => handleAddServer(index)}
                  onAddInstance={(serverId: number) => handleAddInstance(index, serverId)}
                  onDeleteInstance={(serverId: number, instanceId: number) => {
                    setSimpleDialogModalProps({
                      open: true,
                      title: '카메라 정보 삭제',
                      contents: (
                        <Typography sx={{ color: 'rgba(58, 53, 65, 0.6)', fontSize: 16, fontWeight: 400 }}>
                          선택하신 카메라를 <b>삭제</b>하시겠습니까? 삭제후에는 <b>복원할 수 없습니다.</b>
                        </Typography>
                      ),
                      isConfirm: true,
                      confirmFn: () => {
                        setTimeout(() => {
                          handleDeleteInstance(index, serverId, instanceId)
                        }, 100)
                      }
                    })
                  }}
                  onUpdateInstance={(serverId, instanceId, field, value) =>
                    handleUpdateInstance(card.companySolutionId, serverId, instanceId, field, value)
                  }
                  onUpdateServer={(serverId, field, value) =>
                    handleUpdateServer(card.companySolutionId, serverId, field, value)
                  }
                />
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className='button-wrapper'>
                  <Button
                    size='medium'
                    variant='contained'
                    onClick={async () => {
                      // 필수값 검증
                      const requiredFields = card.serverList
                        .map(server => {
                          const emptyFields = []

                          // 서버 정보가 필요한 솔루션인 경우에만 서버 정보 검증
                          if (isServerUsingSolution(card.aiSolutionId)) {
                            if (!server.serverName) emptyFields.push('서버명')
                            if (
                              !server.serverIp &&
                              card.aiSolutionId !== SOLUTION_TYPE_ID.FA_SIGNAGE &&
                              card.aiSolutionId !== SOLUTION_TYPE_ID.FA_GATE
                            )
                              emptyFields.push('서버주소')

                            if (card.aiSolutionId === SOLUTION_TYPE_ID.NEX_REAL_AIBOX) {
                              if (!server.aiBoxId) emptyFields.push('AIBox ID')
                              if (!server.aiBoxPassword) emptyFields.push('AIBox Password')
                            }
                            if (card.aiSolutionId === SOLUTION_TYPE_ID.SAFR) {
                              if (!server.safrEventUrl) emptyFields.push('SAFR 이벤트 서버주소')
                              if (!server.safrId) emptyFields.push('SAFR ID')
                              if (!server.safrPassword) emptyFields.push('SAFR Password')
                            }
                          }

                          // 인스턴스 필드 검증
                          server.instanceList.forEach(instance => {
                            if (!instance.aiServiceId) emptyFields.push('분석 서비스')
                            if (!instance.cameraName) emptyFields.push('카메라명')
                            if (!instance.cameraIp) emptyFields.push('카메라주소')
                            if (isNonServerSolution(card.aiSolutionId)) {
                              if (!instance.cameraId) emptyFields.push('카메라ID')
                            }
                            if (card.aiSolutionId === SOLUTION_TYPE_ID.SAFR) {
                              if (!instance.cameraGroupId) emptyFields.push('카메라 그룹ID')
                            }
                          })

                          return emptyFields
                        })
                        .flat()

                      if (requiredFields.length > 0) {
                        setSimpleDialogModalProps({
                          open: true,
                          title: `등록 정보 입력 오류`,
                          contents:
                            '서버 및 서버에 연결할 카메라 정보를 등록하려면 * 로 표시된 필수값들을 모두 입력하여야 합니다.'

                          // title: `다음 필수 항목을 입력해주세요:\n${requiredFields.join(', ')}`,
                        })

                        return
                      }

                      try {
                        if (card.aiSolutionId === SOLUTION_TYPE_ID.PACKAGE) {
                          const isPackageExists = originalAiData.current?.solutionList?.some(
                            solution => solution.aiSolutionId === SOLUTION_TYPE_ID.PACKAGE
                          )

                          const packageSolutionData: IAiSolutionCompanyPackageParam = {
                            companyNo: companyNo,
                            remark: card.serverList[0].remark ?? ''
                          }

                          if (isPackageExists) {
                            await updateAiSolutionCompanyPackage(packageSolutionData)
                          } else {
                            await saveAiSolutionCompanyPackage(packageSolutionData)
                          }
                        } else {
                          const isNewCard = card.isNew

                          // const isNewCard = !originalAiData.current?.solutionList?.some(
                          //   solution => solution.companySolutionId === card.companySolutionId
                          // )

                          const solutionData = {
                            ...card,
                            companyNo,
                            ...(card.aiSolutionId === SOLUTION_TYPE_ID.PACKAGE && { serverList: [] })
                          }

                          if (isNewCard) {
                            await saveAiSolutionCompany(solutionData)

                            setSimpleDialogModalProps({
                              open: true,
                              title: '분석 솔루션 정보 저장',
                              contents: `입력하신 ${solutionData.aiSolutionName} 솔루션 정보가 저장 되었습니다.`
                            })
                          } else {
                            // cameraNo가 0인 경우 instanceId도 0으로 설정
                            const updatedSolutionData = {
                              ...solutionData,
                              serverList: solutionData.serverList.map(server => ({
                                ...server,
                                serverId: server.isNew ? 0 : server.serverId,
                                instanceList: server.instanceList.map(instance => ({
                                  ...instance,
                                  instanceId: instance.cameraNo === 0 ? 0 : instance.instanceId
                                }))
                              }))
                            }

                            await updateAiSolutionCompany(updatedSolutionData)

                            setSimpleDialogModalProps({
                              open: true,
                              title: '분석 솔루션 정보 ',
                              contents: `입력하신 ${solutionData.aiSolutionName} 솔루션 정보가 수정 되었습니다.`
                            })
                          }
                        }

                        refetch()
                      } catch (error) {
                        setSimpleDialogModalProps({
                          open: true,
                          title: '솔루션 등록 오류',
                          contents: '솔루션 등록 중 오류가 발생했습니다.'
                        })
                        console.error('솔루션 등록 오류:', error)
                      }
                    }}
                    sx={{ mr: 4 }}
                    disabled={!isValidSolution(index)}
                  >
                    저장
                  </Button>

                  <Button
                    size='medium'
                    color='secondary'
                    variant='outlined'
                    onClick={() => {
                      setSimpleDialogModalProps({
                        open: true,
                        title: '입력 취소 확인',
                        contents: `입력 중이던 ${card.aiSolutionName} 솔루션 정보가 모두 삭제됩니다. \r\n 정말 취소하겠습니까?`,
                        isConfirm: true,
                        confirmFn: () => {
                          handleRevertToOriginalState(card.companySolutionId)
                          resetModal()
                        }
                      })
                    }}
                    disabled={false}
                  >
                    취소
                  </Button>
                </div>
              </Box>
            </WindowCard>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default StepTwoContent
