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
import { MUserCompanyList } from 'src/model/userSetting/userSettingModel'

// import { useUserSettingStore } from 'src/pages/user-setting'
import DuplicateText from 'src/@core/components/molecule/DuplicateText'
import { smallPlaceholderStyle } from 'src/@core/styles/TextFieldStyle'
import { useLayout } from 'src/hooks/useLayout'
import { useModal } from 'src/hooks/useModal'
import { useUser } from 'src/hooks/useUser'
import { useUserDuplicate, useUserMod, useUserSave } from 'src/service/setting/userSetting'
import { isValidPassword, isValidEmail, getErrorMessage } from 'src/utils/CommonUtil'

interface IRoleAddModal {
  isOpen: boolean
  isSelfUserMod?: boolean
  selectUser?: MUserCompanyList
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

const defaultValue: MUserCompanyList = {
  userNo: 0,
  userId: '',
  name: '',
  mobileNo: null,
  mailAddress: null,
  authId: 0,
  authName: null,
  userStatus: 1,
  userStatusStr: ''
}

const RoleAddModModal: FC<IRoleAddModal> = ({ isOpen, isSelfUserMod = false, selectUser, onClose, onSubmitAfter }) => {
  const { authList } = useUser()
  const { companyNo } = useLayout()

  const { mutateAsync: saveUser } = useUserSave()
  const { mutateAsync: modUser } = useUserMod()

  const [userInfo, setUserInfo] = useState<MUserCompanyList>(defaultValue)
  const [passwordInfo, setPasswordInfo] = useState<IUserInfoAdd>(defaultPassword)

  const [isDuplicate, setIsDuplicate] = useState<boolean>(false)

  const { mutateAsync: userDuplicate } = useUserDuplicate()

  const { setSimpleDialogModalProps, showModal } = useModal()

  useEffect(() => {
    if (selectUser) {
      const processedUser = {
        ...selectUser,
        mobileNo: selectUser.mobileNo ? selectUser.mobileNo.replace(/-/g, '') : null
      }
      setUserInfo(processedUser)
    }
  }, [selectUser])

  const [errors, setErrors] = useState<Partial<MUserCompanyList & IUserInfoAdd>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'password' || name === 'passwordConfirm') {
      setPasswordInfo(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      const processedValue = name === 'mobileNo' ? value.replace(/-/g, '') : value

      setUserInfo(prev => ({
        ...prev,
        [name]: processedValue
      }))
    }

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const validate = (): boolean => {
    let isValid = true
    const errors: Partial<MUserCompanyList & IUserInfoAdd> = {}

    if (!userInfo.name) {
      errors.name = '이름을 입력해주세요'
      isValid = false
    }
    if (!userInfo.userId) {
      errors.userId = '아이디를 입력해주세요'
      isValid = false
    } else if (userInfo.userId.length > 20) {
      errors.userId = '아이디는 20자 이하여야 합니다'
      isValid = false
    } else if (!/^[a-zA-Z0-9]+$/.test(userInfo.userId)) {
      errors.userId = '아이디는 영문과 숫자만 사용 가능합니다'
      isValid = false
    } else if (!/[a-zA-Z]/.test(userInfo.userId) || !/[0-9]/.test(userInfo.userId)) {
      errors.userId = '아이디는 영문과 숫자를 모두 포함해야 합니다'
      isValid = false
    }

    if (!/^[0-9]+$/.test(userInfo.mobileNo ?? '')) {
      errors.mobileNo = '모바일폰 번호는 숫자만 입력해주세요'
      isValid = false
    } else if (userInfo.mobileNo && userInfo.mobileNo.length !== 11) {
      errors.mobileNo = '모바일폰 번호는 11자리여야 합니다'
      isValid = false
    }

    if (!passwordInfo.password) {
      errors.password = '비밀번호를 입력해주세요'
      isValid = false
    } else if (!isValidPassword(passwordInfo.password)) {
      errors.password = '대소문자, 숫자, 특수문자를 포함하여 8~16자리여야 합니다.'
      isValid = false
    }
    if (!passwordInfo.passwordConfirm) {
      errors.passwordConfirm = '비밀번호를 입력해주세요'
      isValid = false
    } else if (passwordInfo?.password !== passwordInfo?.passwordConfirm) {
      errors.passwordConfirm = '비밀번호를 확인해주세요'
      isValid = false
    }

    if (!userInfo.mailAddress) {
      errors.mailAddress = '이메일을 입력해주세요'
      isValid = false;
    } else if (!isValidEmail(userInfo.mailAddress)) {
      errors.mailAddress = '이메일 형식을 확인해주세요'
      isValid = false;
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
              placeholder='필수항목 - 이름 입력'
              sx={{ width: '100%', ...smallPlaceholderStyle }}
              name='name'
              onChange={handleChange}
              error={!!errors.name}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={userInfo.mobileNo || ''}
              type='tel'
              label='모바일폰 번호'
              placeholder='선택항목 - 모바일 폰 번호 입력(연속숫자)'
              sx={{ width: '100%', ...smallPlaceholderStyle }}
              name='mobileNo'
              onChange={handleChange}
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
            />
          </Grid>

          <Grid item xs={6}>
            <DuplicateText
              value={userInfo.userId}
              placeholder='필수항목 - 국문,영문 및 숫자조합'
              setDuplicateCheck={value => setIsDuplicate(value)}
              duplicateCheck={async (text: string) => {
                try {
                  const res = await userDuplicate({ userId: text })

                  await showModal({
                    title: '중복확인',
                    contents: res.data.message
                  })

                  if (res.data?.duplicateYn === YN.N) {
                    setUserInfo({ ...userInfo, userId: text })

                    return true
                  } else {
                    return false
                  }
                } catch (err) {
                  return false
                }
              }}
              size='small'
              label='사용자 ID'
              sx={{ width: '100%', ...smallPlaceholderStyle }}
              name='userId'
              error={!!errors.userId}
              helperText={errors.userId}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={userInfo.mailAddress || ''}
              type='email'
              label='이메일 주소'
              placeholder='선택항목 - 사용자 이메일 주소 입력'
              sx={{ width: '100%', ...smallPlaceholderStyle }}
              name='mailAddress'
              InputProps={
                {
                  // readOnly: selectUser ? true : false
                }
              }
              onChange={handleChange}
              error={!!errors.mailAddress}
              helperText={errors.mailAddress}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={passwordInfo.password}
              type='password'
              label='비밀번호'
              placeholder='필수항목 - 대소문자 알파벳, 숫자 및 특수문자 조합 8~16자리'
              fullWidth
              name='password'
              sx={{
                ...smallPlaceholderStyle
              }}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size='small'
              value={passwordInfo.passwordConfirm}
              type='password'
              label='비밀번호 확인'
              placeholder='필수항목 - 대소문자 알파벳, 숫자 및 특수문자 조합'
              fullWidth
              name='passwordConfirm'
              sx={{
                ...smallPlaceholderStyle
              }}
              onChange={handleChange}
              error={!!errors.passwordConfirm}
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
              <FormControl sx={{ width: '100%' }}>
                <InputLabel size='small' id='demo-simple-select-label'>
                  사용권한
                </InputLabel>
                <Select
                  value={userInfo.authId.toString()}
                  label='사용권한'
                  size='small'
                  onChange={(event: SelectChangeEvent) => {
                    setUserInfo({ ...userInfo, authId: Number(event.target.value) })
                  }}
                >
                  {authList.map((item, index) => (
                    <MenuItem key={index} value={item.authId}>
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
                  checked={userInfo.userStatus === 1}
                  onChange={() => {
                    setUserInfo({ ...userInfo, userStatus: userInfo.userStatus === 1 ? 0 : 1 })
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

              if (isDuplicate) {
                await showModal({
                  title: '중복확인',
                  contents: '중복확인을 진행해주세요.'
                })

                return
              }

              if (validate()) {
                try {
                  if (selectUser) {
                    const req = {
                      ...userInfo,
                      password: passwordInfo.password ?? '',
                      mobileNo: userInfo.mobileNo ?? '',
                      companyNo: companyNo
                    }

                    const res = await modUser({ ...req })

                    if (res.code === EResultCode.SUCCESS) {
                      // alert('사용자 수정에 성공했습니다.')
                      setSimpleDialogModalProps({
                        open: true,
                        title: '사용자 수정',
                        contents: '사용자 수정에 성공했습니다.'
                      })
                    }
                  } else {
                    const req = {
                      ...userInfo,
                      password: passwordInfo.password ?? '',
                      mobileNo: userInfo.mobileNo ?? '',
                      companyNo: companyNo
                    }
                    const res = await saveUser({ ...req })

                    if (res.code === EResultCode.SUCCESS) {
                      // alert('새로운 사용자 등록에 성공했습니다.')
                      setSimpleDialogModalProps({
                        open: true,
                        title: '사용자 등록',
                        contents: '새로운 사용자 등록에 성공했습니다.'
                      })
                    }
                  }
                  onSubmitAfter?.()
                  onClose()
                } catch (e) {
                  // console.log(e);
                  setSimpleDialogModalProps({
                    open: true,
                    title: getErrorMessage(e),
                  })
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
