import { Box, IconButton } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { IServerList, ISolutionList, SOLUTION_USE_SERVER_TYPE } from 'src/model/client/clientModel'
import SolutionRow from './SolutionRow'
import CVEDIA from './solutionTemplate/CVEDIA'
import FAGate from './solutionTemplate/FAGate'
import NexRealAIBox from './solutionTemplate/NexRealAIBox'
import ProAIServer from './solutionTemplate/ProAIServer'
import SAFR from './solutionTemplate/SAFR'
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
          <CVEDIA
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
          />
        )
      case SOLUTION_USE_SERVER_TYPE.NEXREALAIBOX:
        return (
          <NexRealAIBox
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
          />
        )
      case SOLUTION_USE_SERVER_TYPE.SAFR:
        return (
          <SAFR
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
          />
        )
      case SOLUTION_USE_SERVER_TYPE.FA_GATE:
        return (
          <FAGate
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
          />
        )
      case SOLUTION_USE_SERVER_TYPE.PROAI_SERVER:
        return (
          <ProAIServer
            solutionId={solutionList.aiSolutionId}
            server={server}
            onDelete={onDelete}
            onDeleteInstance={onDeleteInstance}
            onUpdateInstance={onUpdateInstance}
            onUpdateServer={onUpdateServer}
          />
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
                    solutionList.aiSolutionName === 'ProAIEdge' || solutionList.aiSolutionName === 'ProAIServer'
                  }
                  key={instance.instanceId}
                  instance={instance}
                  onDeleteInstance={onDeleteInstance}
                  onUpdateInstance={onUpdateInstance}
                />
              </Box>
            ))}
          </>
        )
    }
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {!isServerAddable(solutionList.aiSolutionName) && solutionList.serverList.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <IconButton onClick={() => onAddInstance(0)}>
            <IconCustom isCommon icon={'add-button'} />
          </IconButton>
        </Box>
      )}

      {solutionList.serverList.map(server => (
        <Box sx={{ width: '100%' }} key={server.serverId}>
          {renderSolutionComponent(server)}

          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <IconButton onClick={() => onAddInstance(server.serverId)}>
              <IconCustom isCommon icon={'add-button'} />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default SolutionServerList
