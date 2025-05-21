import { Box, Chip, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import { YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { IAiSolutionService, IInstanceList } from 'src/model/client/clientModel'

interface ISolutionRow {
  aiSolutionService: IAiSolutionService[]
  solutionId: number
  serverId: number
  useCameraId?: boolean
  useCameraGroup?: boolean
  useInstance?: boolean
  instance: IInstanceList
  onDeleteInstance: (serverId: number, instanceId: number) => void
  onUpdateInstance: (serverId: number, instanceId: number, field: string, value: any) => void
}

const SolutionRow: FC<ISolutionRow> = ({
  aiSolutionService,
  solutionId,
  serverId,
  useCameraId = false,
  useCameraGroup = false,
  useInstance = false,
  instance,
  onDeleteInstance,
  onUpdateInstance
}) => {
  const [newTag, setNewTag] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const serviceOptions =
    aiSolutionService
      ?.filter((item: IAiSolutionService) => item.dataStatus === YN.Y)
      .map((item: IAiSolutionService) => ({
        key: item.aiServiceId.toString(),
        value: item.aiServiceId.toString(),
        label: item.aiServiceName
      })) ?? []

  useEffect(() => {
    if (serviceOptions.length > 0 && !instance.aiServiceId) {
      onUpdateInstance(serverId, instance.instanceId ?? 0, 'aiServiceId', serviceOptions[0].value)
    }
  }, [serviceOptions])

  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = Array.isArray(instance.areaNameList) ? instance.areaNameList : []

      const newTagObj = {
        instanceModelId: 0,
        instanceModelName: newTag.trim()
      }

      onUpdateInstance(serverId, instance.instanceId ?? 0, 'areaNameList', [...currentTags, newTagObj])
      setNewTag('')
    }
  }

  const handleDeleteTag = (tagToDelete: string) => {
    const currentTags = Array.isArray(instance.areaNameList) ? instance.areaNameList : []

    const updatedTags = currentTags.filter(tag => tag.instanceModelName !== tagToDelete)

    onUpdateInstance(serverId, instance.instanceId ?? 0, 'areaNameList', updatedTags)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Backspace' && !newTag) {
      const currentTags = Array.isArray(instance.areaNameList) ? instance.areaNameList : []

      if (currentTags.length > 0) {
        const lastTag = currentTags[currentTags.length - 1]
        handleDeleteTag(lastTag.instanceModelName)
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <CustomSelectBox
        value={instance.aiServiceId.toString()}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'aiServiceId', e.target.value)}
        options={serviceOptions}
        width='200px'
      />

      {useCameraId && (
        <TextField
          size='small'
          value={instance.cameraId}
          onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraId', e.target.value)}
          label='카메라ID'
          variant='outlined'
          placeholder={`카메라ID`}
          required
        />
      )}

      {useCameraGroup && (
        <TextField
          size='small'
          value={instance.cameraGroupId}
          onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraGroupId', e.target.value)}
          label='카메라 그룹ID'
          variant='outlined'
          placeholder={`카메라 그룹ID`}
          required
        />
      )}

      <TextField
        size='small'
        value={instance.cameraName}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraName', e.target.value)}
        label='카메라명'
        variant='outlined'
        placeholder={`카메라명`}
        required
      />

      {useInstance && (
        <TextField
          size='small'
          value={instance.instanceName}
          onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'instanceName', e.target.value)}
          label='인스턴스명 '
          variant='outlined'
          placeholder={`인스턴스명`}
          required
        />
      )}
      <TextField
        size='small'
        value={instance.cameraIp}
        onChange={e => onUpdateInstance(serverId, instance.instanceId ?? 0, 'cameraIp', e.target.value)}
        label='카메라주소 '
        variant='outlined'
        placeholder={`카메라주소`}
        required
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: '200px' }}>
        <TextField
          size='small'
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          label='분석영역명'
          variant='outlined'
          placeholder='새로운 분석영역명 입력'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      height: '4px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '4px'
                    },
                    maxWidth: '300px'
                  }}
                >
                  <Stack direction='row' spacing={1} sx={{ flexWrap: 'nowrap' }}>
                    {Array.isArray(instance.areaNameList) &&
                      instance.areaNameList.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.instanceModelName}
                          onDelete={() => handleDeleteTag(tag.instanceModelName)}
                          size='small'
                        />
                      ))}
                  </Stack>
                </Box>
              </InputAdornment>
            )
          }}
          inputRef={inputRef}
        />
      </Box>

      <IconButton onClick={() => onDeleteInstance(serverId, instance.instanceId ?? 0)}>
        <IconCustom isCommon icon={'DeleteOutline'} />
      </IconButton>
    </Box>
  )
}

export default SolutionRow
