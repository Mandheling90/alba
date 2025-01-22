import { FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import { FC } from 'react'

const CustomRadioGroup: FC<{
  label: string
  name: string
  value: string | number | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  options: { value: string | number; label: string }[]
  isDisabled?: boolean
}> = ({ label, name, value, onChange, options, isDisabled = false }) => (
  <>
    <Grid item md={1.8}>
      <Typography variant='subtitle1' fontWeight={600}>
        {label}
      </Typography>
    </Grid>
    <Grid item md={10.2}>
      <RadioGroup
        row
        name={name}
        value={String(value)}
        onChange={onChange}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: '.875rem',
            fontWeight: 600,
            color: 'text.secondary'
          },
          '& .MuiRadio-root': { marginRight: -0.8 }
        }}
      >
        {options.map(option => (
          <FormControlLabel
            disabled={isDisabled}
            key={option.value}
            value={option.value}
            label={option.label}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </Grid>
  </>
)

export default CustomRadioGroup
