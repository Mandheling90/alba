import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import CustomSelectCheckBox from 'src/@core/components/molecule/CustomSelectCheckBox'
import IconCustom from 'src/layouts/components/IconCustom'
import { useSearchCameraList } from 'src/service/statistics/statisticsService'

interface ICameraGroupSelect {
  value: string[]
  onChange: (cameraNos: number[], cameraGroupIds: number[]) => void
  companyNo?: number
}

const CameraGroupSelect: FC<ICameraGroupSelect> = ({ value, onChange, companyNo }) => {
  const { data: cameraList } = useSearchCameraList({ companyNo: companyNo ?? 0 })

  const handleChange = (event: any, newSelectedValues: string[]) => {
    const addedValue = newSelectedValues.find(v => !value.includes(v))
    const removedValue = value.find(v => !newSelectedValues.includes(v))
    const changedValue = addedValue || removedValue

    if (!changedValue) return

    const isGroup = cameraList?.data?.cameraGroupList.some(group => group.cameraGroupId.toString() === changedValue)

    let updatedValues: string[] = []

    if (isGroup) {
      if (removedValue) {
        updatedValues = value.filter(v => v !== removedValue)
      } else {
        updatedValues = [
          ...value.filter(v => !cameraList?.data?.cameraList.some(camera => camera.cameraNo.toString() === v)),
          changedValue
        ]
      }
    } else {
      if (removedValue) {
        updatedValues = value.filter(v => v !== removedValue)
      } else {
        updatedValues = [
          ...value.filter(v => !cameraList?.data?.cameraGroupList.some(group => group.cameraGroupId.toString() === v)),
          changedValue
        ]
      }
    }

    const cameraIds = updatedValues
      .filter(v => cameraList?.data?.cameraList.some(camera => camera.cameraNo.toString() === v))
      .map(Number)

    const groupIds = updatedValues
      .filter(v => cameraList?.data?.cameraGroupList.some(group => group.cameraGroupId.toString() === v))
      .map(Number)

    onChange(cameraIds, groupIds)
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      <Typography variant='h6' fontWeight={500}>
        장소
      </Typography>
      <CustomSelectCheckBox
        width='185px'
        value={value}
        onChange={handleChange}
        options={[
          ...(cameraList?.data?.cameraList || []).map(camera => ({
            key: camera.cameraNo.toString(),
            value: camera.cameraNo.toString(),
            label: camera.cameraName
          })),
          ...(cameraList?.data?.cameraGroupList || []).map(group => ({
            key: group.cameraGroupId.toString(),
            value: group.cameraGroupId.toString(),
            label: group.cameraGroupName,
            children: group.cameraList.map(camera => ({
              key: camera.cameraNo.toString(),
              value: camera.cameraNo.toString(),
              label: camera.cameraName,
              disabled: true
            }))
          }))
        ]}
        renderValue={
          value.length === 0
            ? '장소 선택'
            : value.length === 1
            ? (cameraList?.data?.cameraList || []).find(
                (camera: { cameraNo: number; cameraName: string }) => camera.cameraNo.toString() === value[0]
              )?.cameraName ||
              (cameraList?.data?.cameraGroupList || []).find(
                (group: { cameraGroupId: number; cameraGroupName: string }) =>
                  group.cameraGroupId.toString() === value[0]
              )?.cameraGroupName ||
              '선택된 장소'
            : `${value.length}곳 선택됨`
        }
        renderIcone={<IconCustom isCommon icon='map' />}
        placeholder='장소 선택'
      />
    </Box>
  )
}

export default CameraGroupSelect
