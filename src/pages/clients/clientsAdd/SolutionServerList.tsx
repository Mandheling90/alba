import { Box, IconButton, TextareaAutosize, TextField } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import {
  IAiSolutionService,
  IServerList,
  ISolutionList,
  isServerUsingSolution,
  SOLUTION_TYPE_ID
} from 'src/model/client/clientModel'
import { useAiSolutionService } from 'src/service/client/clientService'
import SolutionRow from './SolutionRow'
import SolutionTemplate from './solutionTemplate/SolutionTemplate'

// import { isServerAddable } from './StepTwoContent'

interface ISolutionRow {
  solutionList: ISolutionList
  onDelete: (serviceId: number) => void
  onAdd: () => void
  onAddInstance: (serverId: number) => void
  onDeleteInstance: (serverId: number, instanceId: number) => void
  onUpdateInstance: (serverId: number, instanceId: number, field: string, value: string) => void
  onUpdateServer: (serverId: number, field: string, value: string) => void
}

const SolutionServerList: FC<ISolutionRow> = ({
  solutionList,
  onDelete,
  onAdd,
  onAddInstance,
  onDeleteInstance,
  onUpdateInstance,
  onUpdateServer
}) => {
  const { mutateAsync: getAiSolutionService } = useAiSolutionService()
  const [aiSolutionService, setAiSolutionService] = useState<IAiSolutionService[]>([])
  useEffect(() => {
    getAiSolutionService({ solutionId: solutionList.aiSolutionId }).then(res => {
      if (res.data) {
        setAiSolutionService(res.data)
      }
    })
  }, [solutionList.aiSolutionId])

  const renderSolutionComponent = (server: IServerList) => {
    switch (solutionList.aiSolutionId) {
      case SOLUTION_TYPE_ID.CVEDIA:
        return (
          <SolutionTemplate
            aiSolutionService={aiSolutionService}
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
            useCameraId={true}
            useInstance={true}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='CVEDIA 서버명'
              variant='outlined'
              placeholder={`CVEDIA 서버명`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='CVEDIA 서버주소'
              variant='outlined'
              placeholder={`CVEDIA 서버주소`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_TYPE_ID.SAFR:
        return (
          <SolutionTemplate
            aiSolutionService={aiSolutionService}
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
            useCameraId={true}
            useCameraGroup={true}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='SAFR 서버명'
              variant='outlined'
              placeholder={`SAFR 서버명`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='SAFR 서버주소'
              variant='outlined'
              placeholder={`SAFR 서버주소`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />

            <TextField
              size='small'
              value={server.safrEventUrl}
              label='SAFR 이벤트 서버주소'
              variant='outlined'
              placeholder={`SAFR 이벤트 서버주소`}
              required
              onChange={e => onUpdateServer(server.serverId, 'safrEventUrl', e.target.value)}
            />

            <TextField
              size='small'
              value={server.safrId}
              label='SAFR ID'
              variant='outlined'
              placeholder={`SAFR ID`}
              required
              onChange={e => onUpdateServer(server.serverId, 'safrId', e.target.value)}
            />
            <TextField
              size='small'
              value={server.safrPassword}
              label='SAFR PassWord'
              variant='outlined'
              placeholder={`SAFR PassWord`}
              type='password'
              required
              onChange={e => onUpdateServer(server.serverId, 'safrPassword', e.target.value)}
            />
          </SolutionTemplate>
        )

      case SOLUTION_TYPE_ID.PROAI_SERVER:
        return (
          <SolutionTemplate
            aiSolutionService={aiSolutionService}
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
            useCameraId={true}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='ProAI Server 서버명'
              variant='outlined'
              placeholder={`ProAI Server 서버명`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='ProAI Server 서버주소'
              variant='outlined'
              placeholder={`ProAI Server 서버주소`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_TYPE_ID.FA_SIGNAGE:
        return (
          <SolutionTemplate
            aiSolutionService={aiSolutionService}
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
            useCameraId={true}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='FA Signage 서버명'
              variant='outlined'
              placeholder={`FA Signage 서버명`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />
            <TextField
              size='small'
              value={server.serverIp}
              label='FA Signage 서버주소'
              variant='outlined'
              placeholder={`FA Signage 서버주소`}
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_TYPE_ID.FA_GATE:
        return (
          <SolutionTemplate
            aiSolutionService={aiSolutionService}
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
            useCameraId={true}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='FA Gate 서버명'
              variant='outlined'
              placeholder={`FA Gate 서버명`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='FA Gate 서버주소'
              variant='outlined'
              placeholder={`FA Gate 서버주소`}
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_TYPE_ID.NEX_REAL_AIBOX:
        return (
          <SolutionTemplate
            aiSolutionService={aiSolutionService}
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
            useCameraId={true}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='AIBox 명'
              variant='outlined'
              placeholder={`AIBox 명`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='AIBox 주소'
              variant='outlined'
              placeholder={`AIBox 주소`}
              required
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />

            <TextField
              size='small'
              value={server.aiBoxId}
              label='AIBox ID'
              variant='outlined'
              placeholder={`AIBox ID`}
              required
              onChange={e => onUpdateServer(server.serverId, 'aiBoxId', e.target.value)}
            />
            <TextField
              size='small'
              value={server.aiBoxPassword}
              label='AIBox PassWord'
              variant='outlined'
              placeholder={`AIBox PassWord`}
              type='password'
              required
              onChange={e => onUpdateServer(server.serverId, 'aiBoxPassword', e.target.value)}
            />
          </SolutionTemplate>
        )
      default:
        return (
          <>
            {server.instanceList.map(instance => (
              <Box sx={{ mt: 2, mb: 2 }} key={instance.instanceId}>
                <SolutionRow
                  aiSolutionService={aiSolutionService}
                  serverId={server.serverId}
                  solutionId={solutionList.aiSolutionId}
                  useCameraId={
                    solutionList.aiSolutionId === SOLUTION_TYPE_ID.PROAI_EDGE ||
                    solutionList.aiSolutionId === SOLUTION_TYPE_ID.VCA ||
                    solutionList.aiSolutionId === SOLUTION_TYPE_ID.NEX_REAL_3D ||
                    solutionList.aiSolutionId === SOLUTION_TYPE_ID.NEX_REAL_AI
                  }
                  key={instance.instanceId}
                  instance={instance}
                  onDeleteInstance={onDeleteInstance}
                  onUpdateInstance={onUpdateInstance}
                />
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <IconButton onClick={() => onAddInstance(server.serverId)}>
                <IconCustom isCommon icon={'add-button'} />
              </IconButton>
            </Box>
          </>
        )
    }
  }

  return (
    <>
      {solutionList.aiSolutionId === SOLUTION_TYPE_ID.PACKAGE ? (
        <TextareaAutosize
          style={{
            width: '100%',
            height: '100px',
            resize: 'none',
            border: '1px solid rgba(58, 53, 65, 0.26)',
            borderRadius: '5px',
            padding: '10px'
          }}
          placeholder='고객사에 설치된 패키지 솔루션 관련 내용을 텍스트로 입력하세요.'
          value={solutionList.serverList[0].remark}
          onChange={e => onUpdateServer(solutionList.serverList[0].serverId, 'remark', e.target.value)}
        />
      ) : (
        <>
          {isServerUsingSolution(solutionList.aiSolutionId) && solutionList.serverList.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <IconButton onClick={() => onAddInstance(0)}>
                <IconCustom isCommon icon={'add-button'} />
              </IconButton>
            </Box>
          )}

          {solutionList.serverList.map(server => (
            <Box sx={{ width: '100%' }} key={server.serverId}>
              {renderSolutionComponent(server)}
            </Box>
          ))}
        </>
      )}
    </>
  )
}

export default SolutionServerList
