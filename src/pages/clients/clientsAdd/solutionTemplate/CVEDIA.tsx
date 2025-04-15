import { Box, IconButton, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import IconCustom from 'src/layouts/components/IconCustom'
import { ISolutionServerProps } from 'src/model/client/clientModel'
import SolutionRow from '../SolutionRow'

const CVEDIA: FC<ISolutionServerProps> = ({
  solutionId,
  server,
  onDeleteInstance,
  onUpdateInstance,
  onUpdateServer,
  onDelete
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
            useCameraId
            useInstance
            serverId={server.serverId}
            onDeleteInstance={onDeleteInstance}
            key={instance.instanceId}
            instance={instance}
            onUpdateInstance={onUpdateInstance}
          />
        </Box>
      ))}
    </>
  )
}

export default CVEDIA
