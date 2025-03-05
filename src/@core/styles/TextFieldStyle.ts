export const grayTextBackground = 'rgba(58, 53, 65, 0.06)'

export const requiredTextFieldStyle = {
  '& .MuiInputBase-input::placeholder': {
    color: '#FA7878',
    opacity: 1
  }
}

export const grayTextFieldStyle = {
  background: grayTextBackground,
  borderRadius: '8px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px !important'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}
