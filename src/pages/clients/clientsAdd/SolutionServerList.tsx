import { Box, IconButton, TextareaAutosize, TextField } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { IServerList, ISolutionList, SOLUTION_USE_SERVER_TYPE } from 'src/model/client/clientModel'
import SolutionRow from './SolutionRow'
import SolutionTemplate from './solutionTemplate/SolutionTemplate'
import { isServerAddable } from './StepTwoContent'

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
  const renderSolutionComponent = (server: IServerList) => {
    switch (solutionList.aiSolutionName) {
      case SOLUTION_USE_SERVER_TYPE.CVEDIA:
        return (
          <SolutionTemplate
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='CVEDIA 서버명'
              variant='outlined'
              placeholder={`CVEDIA 서버명`}
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='CVEDIA 서버주소'
              variant='outlined'
              placeholder={`CVEDIA 서버주소`}
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_USE_SERVER_TYPE.NEXREALAIBOX:
        return (
          <SolutionTemplate
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='AIBox 명'
              variant='outlined'
              placeholder={`AIBox 명`}
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='AIBox 주소'
              variant='outlined'
              placeholder={`AIBox 주소`}
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />

            <TextField
              size='small'
              value={server.aiBoxId}
              label='AIBox ID'
              variant='outlined'
              placeholder={`AIBox ID`}
              onChange={e => onUpdateServer(server.serverId, 'aiBoxId', e.target.value)}
            />
            <TextField
              size='small'
              value={server.aiBoxPassword}
              label='AIBox PassWord'
              variant='outlined'
              placeholder={`AIBox PassWord`}
              type='password'
              onChange={e => onUpdateServer(server.serverId, 'aiBoxPassword', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_USE_SERVER_TYPE.SAFR:
        return (
          <SolutionTemplate
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='SAFR 서버명'
              variant='outlined'
              placeholder={`SAFR 서버명`}
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='SAFR 서버주소'
              variant='outlined'
              placeholder={`SAFR 서버주소`}
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />

            <TextField
              size='small'
              value={server.safrEventUrl}
              label='SAFR 이벤트 서버주소'
              variant='outlined'
              placeholder={`SAFR 이벤트 서버주소`}
              onChange={e => onUpdateServer(server.serverId, 'safrEventUrl', e.target.value)}
            />

            <TextField
              size='small'
              value={server.safrId}
              label='SAFR ID'
              variant='outlined'
              placeholder={`SAFR ID`}
              onChange={e => onUpdateServer(server.serverId, 'safrId', e.target.value)}
            />
            <TextField
              size='small'
              value={server.safrPassword}
              label='SAFR PassWord'
              variant='outlined'
              placeholder={`SAFR PassWord`}
              type='password'
              onChange={e => onUpdateServer(server.serverId, 'safrPassword', e.target.value)}
            />
          </SolutionTemplate>
        )
      case SOLUTION_USE_SERVER_TYPE.FA_GATE:
        return (
          <SolutionTemplate
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='FA Gate 서버명'
              variant='outlined'
              placeholder={`FA Gate 서버명`}
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
      case SOLUTION_USE_SERVER_TYPE.PROAI_SERVER:
        return (
          <SolutionTemplate
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
            onAddInstance={onAddInstance}
          >
            <TextField
              size='small'
              value={server.serverName}
              label='ProAI Server 서버명'
              variant='outlined'
              placeholder={`ProAI Server 서버명`}
              onChange={e => onUpdateServer(server.serverId, 'serverName', e.target.value)}
            />

            <TextField
              size='small'
              value={server.serverIp}
              label='ProAI Server 서버주소'
              variant='outlined'
              placeholder={`ProAI Server 서버주소`}
              onChange={e => onUpdateServer(server.serverId, 'serverIp', e.target.value)}
            />
          </SolutionTemplate>
        )
      default:
        return (
          <>
            {server.instanceList.map(instance => (
              <Box sx={{ mt: 2, mb: 2 }} key={instance.instanceId}>
                <SolutionRow
                  serverId={server.serverId}
                  solutionId={solutionList.aiSolutionId}
                  useCameraId={
                    solutionList.aiSolutionName === 'ProAIEdge' ||
                    solutionList.aiSolutionName === 'ProAIServer' ||
                    solutionList.aiSolutionName === 'VCA'
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
      {solutionList.aiSolutionName === SOLUTION_USE_SERVER_TYPE.PACKAGE ? (
        <TextareaAutosize
          style={{
            width: '100%',
            height: '100px',
            resize: 'none',
            border: '1px solid rgba(58, 53, 65, 0.26)',
            borderRadius: '5px',
            padding: '10px'
          }}
          value={solutionList.serverList[0].remark}
          onChange={e => onUpdateServer(solutionList.serverList[0].serverId, 'remark', e.target.value)}
        />
      ) : (
        <>
          {isServerAddable(solutionList.aiSolutionName) && solutionList.serverList.length === 0 && (
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
