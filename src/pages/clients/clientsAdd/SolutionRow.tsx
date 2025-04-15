import { Box, IconButton, TextField } from '@mui/material'
import { FC } from 'react'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import { YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { IInstanceList } from 'src/model/client/clientModel'
import { useAiSolutionService } from 'src/service/client/clientService'

interface ISolutionRow {
  solutionId: number
  serverId: number
  useCameraId?: boolean
  useInstance?: boolean
  instance: IInstanceList
  onDeleteInstance: (serverId: number, instanceId: number) => void
  onUpdateInstance: (serverId: number, instanceId: number, field: string, value: string) => void
}

const SolutionRow: FC<ISolutionRow> = ({
  solutionId,
  serverId,
  useCameraId = false,
  useInstance = false,
  instance,
  onDeleteInstance,
  onUpdateInstance
}) => {
  const { data, refetch } = useAiSolutionService(solutionId)

  const serviceOptions = data?.data
    ?.filter(item => item.dataStatus === YN.Y)
    .map(item => ({
      key: item.aiServiceId.toString(),
      value: item.aiServiceId.toString(),
      label: item.aiServiceName
    }))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <CustomSelectBox
        value={instance.aiServiceId.toString()}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'aiServiceId', e.target.value)}
        options={serviceOptions ?? []}
        width='200px'

        // placeholder='분석 서비스 선택'
        // placeholderColor='#757575'
      />

      {useCameraId ? (
        <TextField
          size='small'
          value={instance.cameraId}
          onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraId', e.target.value)}
          label='카메라ID'
          variant='outlined'
          placeholder={`카메라ID`}
        />
      ) : (
        <TextField
          size='small'
          value={instance.cameraGroupId}
          onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraGroupId', e.target.value)}
          label='카메라 그룹ID'
          variant='outlined'
          placeholder={`카메라 그룹ID`}
        />
      )}

      <TextField
        size='small'
        value={instance.cameraName}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraName', e.target.value)}
        label='카메라명'
        variant='outlined'
        placeholder={`카메라명`}
      />

      {useInstance && (
        <TextField
          size='small'
          value={instance.instanceName}
          onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'instanceName', e.target.value)}
          label='인스턴스명 '
          variant='outlined'
          placeholder={`인스턴스명`}
        />
      )}
      <TextField
        size='small'
        value={instance.cameraIp}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraIp', e.target.value)}
        label='카메라주소 '
        variant='outlined'
        placeholder={`카메라주소`}
      />
      <TextField
        size='small'
        value={instance.areaNameList}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'areaNameList', e.target.value)}
        label='분석영역명 '
        variant='outlined'
        placeholder={`분석영역명`}
      />

      <IconButton onClick={() => onDeleteInstance(serverId, instance.instanceId ?? 0)}>
        <IconCustom isCommon icon={'DeleteOutline'} />
      </IconButton>
    </Box>
  )
}

export default SolutionRow
