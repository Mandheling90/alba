import { Box, Grid, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

const CustomTextField: FC<{
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  iconPath?: string
  iconName?: string
  isDisabled?: boolean
  placeholder?: string
  placeholderColor?: string
}> = ({
  label,
  name,
  value = '',
  onChange,
  iconPath,
  iconName,
  isDisabled = false,
  placeholder = '',
  placeholderColor
}) => (
  <>
    <Grid item md={1.8}>
      <Typography variant='subtitle1' fontWeight={600}>
        {label}
      </Typography>
    </Grid>
    <Grid item md={10.2}>
      <Box sx={{ display: 'flex' }}>
        {iconPath && iconName && (
          <IconCustom path={iconPath} icon={iconName} style={{ width: '16px', marginRight: '10px' }} />
        )}
        <TextField
          fullWidth
          size='small'
          value={value}
          name={name}
          onChange={onChange}
          disabled={isDisabled}
          placeholder={placeholder}
          sx={{
            '& .MuiInputBase-input::placeholder': {
              color: placeholderColor, // 원하는 색상으로 변경
              opacity: 0.5 // placeholder의 투명도 조정 (기본값은 0.5)
            }
          }}
        />
      </Box>
    </Grid>
  </>
)

export default CustomTextField
