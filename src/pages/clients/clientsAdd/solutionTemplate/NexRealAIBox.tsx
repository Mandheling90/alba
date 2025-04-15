import { Box, IconButton, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import IconCustom from 'src/layouts/components/IconCustom'
import { ISolutionServerProps } from 'src/model/client/clientModel'
import SolutionRow from '../SolutionRow'

const NexRealAIBox: FC<ISolutionServerProps> = ({
  solutionId,
  server,
  onDelete,
  onDeleteInstance,
  onUpdateInstance,
  onUpdateServer
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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

        <Typography sx={{ ml: 5 }}>총 {server.instanceList.length}대의 카메라 항목이 있습니다.</Typography>

        <IconButton onClick={() => onDelete(server.serverId)}>
          <IconCustom isCommon icon={'DeleteOutline'} />
        </IconButton>
      </Box>

      <DividerBar />

      {server.instanceList.map(instance => (
        <Box sx={{ mt: 2, mb: 2 }} key={instance.instanceId}>
          <SolutionRow
            solutionId={solutionId}
            serverId={server.serverId}
            onDeleteInstance={onDeleteInstance}
            useCameraId
            useInstance
            key={instance.instanceId}
            instance={instance}
            onUpdateInstance={onUpdateInstance}
          />
        </Box>
      ))}
    </>
  )
}

export default NexRealAIBox
