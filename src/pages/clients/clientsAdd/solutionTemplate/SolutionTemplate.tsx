import { Box, IconButton, Typography } from '@mui/material'
import { FC, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import IconCustom from 'src/layouts/components/IconCustom'
import { ISolutionServerProps } from 'src/model/client/clientModel'
import SolutionRow from '../SolutionRow'

const SolutionTemplate: FC<ISolutionServerProps> = ({
  aiSolutionService,
  solutionId,
  server,
  onDeleteInstance,
  onUpdateInstance,
  onUpdateServer,
  onDelete,
  onAddInstance,
  children,
  useCameraId = false,
  useCameraGroup = false,
  useInstance = false,
  useAreaNameList = true
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

        {children}

        <Typography sx={{ ml: 5 }}>총 {server.instanceList.length}대의 카메라 항목이 있습니다.</Typography>

        <IconButton onClick={() => onDelete(server.serverId)}>
          <IconCustom isCommon icon={'DeleteOutline'} />
        </IconButton>
      </Box>

      {!isFold && (
        <>
          <DividerBar />

          {server.instanceList.map(instance => (
            <Box sx={{ mt: 2, mb: 2, ml: 11 }} key={instance.instanceId}>
              <SolutionRow
                aiSolutionService={aiSolutionService}
                solutionId={solutionId}
                useCameraId={useCameraId}
                useCameraGroup={useCameraGroup}
                useInstance={useInstance}
                serverId={server.serverId}
                onDeleteInstance={onDeleteInstance}
                key={instance.instanceId}
                instance={instance}
                onUpdateInstance={onUpdateInstance}
                useAreaNameList={useAreaNameList}
              />
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <IconButton onClick={() => onAddInstance(server.serverId)}>
              <IconCustom isCommon icon={'add-button'} />
            </IconButton>
          </Box>
        </>
      )}
    </>
  )
}

export default SolutionTemplate
