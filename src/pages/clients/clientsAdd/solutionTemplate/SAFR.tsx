import { Box, IconButton, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import IconCustom from 'src/layouts/components/IconCustom'
import { ISolutionServerProps } from 'src/model/client/clientModel'
import SolutionRow from '../SolutionRow'

const SAFR: FC<ISolutionServerProps> = ({
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

export default SAFR
