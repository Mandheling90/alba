import { Box, IconButton, TextField, Typography } from '@mui/material'
import { FC, useState } from 'react'
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
  onDelete,
  children
}) => {
  const [isFold, setIsFold] = useState(false)

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={() => setIsFold(!isFold)}>
          <IconCustom
            isCommon
            path='clients'
            icon={isFold ? 'status_spread_default' : 'status_fold_default'}
            hoverIcon={isFold ? 'status_spread_hovering' : 'status_fold_hovering'}
          />
        </IconButton>

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

      {!isFold &&
        server.instanceList.map(instance => (
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
