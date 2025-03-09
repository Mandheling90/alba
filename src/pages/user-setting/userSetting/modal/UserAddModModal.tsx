import { FC, useEffect, useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { EResultCode, YN } from 'src/enum/commonEnum'
import { UserListAll } from 'src/model/userSetting/userSettingModel'

// import { useUserSettingStore } from 'src/pages/user-setting'
import { useUser } from 'src/hooks/useUser'
import { useUserMod, useUserSave } from 'src/service/setting/userSetting'
import { filterDifferentProperties, handlePhoneChange, isValidEmail, isValidPassword } from 'src/utils/CommonUtil'

interface IRoleAddModal {
  isOpen: boolean
  isSelfUserMod?: boolean
  selectUser?: UserListAll
  onClose: () => void
  onSubmitAfter?: () => void
}

interface IUserInfoAdd {
  password: string
  passwordConfirm: string
}

const defaultPassword = {
  password: '',
  passwordConfirm: ''
}
const defaultValue = {
  id: '',
  mobile: '',
  name: '',
  role: '',
  status: 1,
  groupId: 0,
  group: { dataStatus: YN.N, id: 0, name: '', description: '' },
  ...defaultPassword
}

const RoleAddModModal: FC<IRoleAddModal> = ({ isOpen, isSelfUserMod = false, selectUser, onClose, onSubmitAfter }) => {
  const { userGroupInfo } = useUser()

  const { mutateAsync: saveUser } = useUserSave()
  const { mutateAsync: modUser } = useUserMod()

  const [userInfo, setUserInfo] = useState<UserListAll & IUserInfoAdd>(defaultValue)

  useEffect(() => {
    if (selectUser) {
      setUserInfo({ ...selectUser, ...defaultPassword })
    }
  }, [selectUser])

  const [errors, setErrors] = useState<Partial<UserListAll & IUserInfoAdd>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.name === 'mobile' ? handlePhoneChange(e.target.value) : e.target.value
    })

    setErrors({
      ...errors,
      [e.target.name]: ''
    })
  }

  const validate = (): boolean => {
    let isValid = true
    const errors: Partial<UserListAll & IUserInfoAdd> = {}

    if (!userInfo.name) {
      errors.name = '이름을 입력해주세요'
      isValid = false
    }
    if (!userInfo.id) {
      errors.id = '아이디를 입력해주세요'
      isValid = false
    } else if (!isValidEmail(userInfo?.id)) {
      errors.id = '이메일 형식을 확인해주세요'
      isValid = false
    }

    // 비밀번호 유효성 검사 추가
    if (!userInfo.password) {
      errors.password = '비밀번호를 입력해주세요'
      isValid = false
    } else if (!isValidPassword(userInfo.password)) {
      errors.password = '대소문자, 숫자, 특수문자를 포함하여 8~16자리여야 합니다.'
      isValid = false
    }
    if (!userInfo.passwordConfirm) {
      errors.passwordConfirm = '비밀번호를 입력해주세요'
      isValid = false
    } else if (userInfo?.password !== userInfo?.passwordConfirm) {
      errors.passwordConfirm = '비밀번호를 확인해주세요'
      isValid = false
    }
    if (!userInfo.mobile) {
      errors.mobile = '핸드폰 번호를 입력해주세요'
      isValid = false
    }

    setErrors(errors)

    return isValid
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      onClose={() => {
        onClose()
      }}
      open={isOpen}
    >
      <DialogTitle
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Typography variant='h5' component='span'>
          {selectUser ? '사용자 정보 수정' : '사용자 추가'}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(5)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <Grid container spacing={6} sx={{ mb: 6 }}>
          <Grid item xs={12}>
            <Typography variant='body1' component='span'>
              {selectUser ? '사용자 정보 수정' : '사용자 추가'}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={userInfo.name}
              label='이름'
              placeholder='이름'
              sx={{ width: '100%' }}
              name='name'
              onChange={handleChange}
              error={!!errors.name}
            />
          </Grid>
          <Grid item xs={6}></Grid>

          <Grid item xs={12}>
            <TextField
              size='small'
              value={userInfo.id}
              type='email'
              label='이메일 주소'
              placeholder='이메일 주소'
              sx={{ width: '100%' }}
              name='id'
              InputProps={{
                readOnly: selectUser ? true : false
              }}
              onChange={handleChange}
              error={!!errors.id}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={userInfo.password}
              type='password'
              label='비밀번호'
              placeholder='비밀번호'
              fullWidth
              name='password'
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={userInfo.passwordConfirm}
              type='password'
              label='비밀번호 확인'
              placeholder='비밀번호 확인'
              fullWidth
              name='passwordConfirm'
              onChange={handleChange}
              error={!!errors.passwordConfirm}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={userInfo.mobile}
              type='tel'
              label='모바일폰 번호'
              placeholder='모바일폰 번호'
              sx={{ width: '100%' }}
              name='mobile'
              onChange={handleChange}
              error={!!errors.mobile}
            />
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
        {!isSelfUserMod && (
          <Grid container spacing={6}>
            <Grid item xs={12} sx={{}}>
              <Typography variant='body1' component='span'>
                시스템 접속권한 설정
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <FormControl>
                <InputLabel size='small' id='demo-simple-select-label'>
                  사용권한
                </InputLabel>
                <Select
                  value={userInfo.group.id.toString()}
                  label='사용권한'
                  size='small'
                  onChange={(event: SelectChangeEvent) => {
                    setUserInfo({ ...userInfo, group: { ...userInfo.group, id: Number(event.target.value) } })
                  }}
                >
                  {userGroupInfo.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <div>
                <Typography variant='body2' component='span'>
                  사용자 계정 활성화
                </Typography>

                <Switch
                  checked={userInfo.status === 1}
                  onChange={() => {
                    setUserInfo({ ...userInfo, status: userInfo.status === 1 ? 0 : 1 })
                  }}
                />
              </div>
            </Grid>
          </Grid>
        )}

        <Box sx={{ height: '100%' }}></Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box className='demo-space-x'>
          <Button
            size='large'
            type='submit'
            variant='contained'
            onClick={async (e: React.FormEvent) => {
              e.preventDefault()

              if (validate()) {
                try {
                  if (selectUser) {
                    const req = await filterDifferentProperties(
                      { ...selectUser, groupId: selectUser.group.id },
                      {
                        name: userInfo.name,
                        mobile: userInfo.mobile,
                        status: userInfo.status,
                        groupId: userInfo.group.id
                      }
                    )

                    const res = await modUser({ id: selectUser.id, password: userInfo.password, ...req })

                    if (res.code === EResultCode.SUCCESS) {
                      alert('사용자 수정에 성공했습니다.')
                    }
                  } else {
                    const res = await saveUser({
                      id: userInfo.id,
                      name: userInfo.name,
                      password: userInfo.password ?? '',
                      mobile: userInfo.mobile,
                      status: userInfo.status,
                      groupId: userInfo.group.id
                    })

                    if (res.code === EResultCode.SUCCESS) {
                      alert('새로운 사용자 등록에 성공했습니다.')
                    }
                  }
                  onSubmitAfter?.()
                  onClose()
                } catch (e) {
                  console.log(e)

                  // alert(EErrorMessage.COMMON_ERROR)
                }
              }
            }}
          >
            저장
          </Button>
          <Button
            size='large'
            color='secondary'
            variant='outlined'
            onClick={() => {
              onClose()
            }}
          >
            취소
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default RoleAddModModal
