import { Box, TextField } from '@mui/material'
import styled from 'styled-components'

export const HorizontalScrollBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
  white-space: nowrap;
  max-height: 120px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 0px 0px 0px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    &:hover {
      background: #555;
    }
  }
`

export const BorderInput = styled(Box)<{
  fontSize?: string
  fontWeight?: string
  padding?: string
  minWidth?: string
  backgroundColor?: string
  color?: string
}>`
  border: 1px solid rgba(145, 85, 253, 1);
  border-radius: 4px;
  text-align: center;
  font-size: ${props => props.fontSize || '5rem'};
  font-weight: ${props => props.fontWeight || '500'};
  padding: ${props => props.padding || '0px 3px'};
  min-width: ${props => props.minWidth || 'auto'};
  background-color: ${props => props.backgroundColor || 'transparent'};
  color: ${props => props.color || 'inherit'};
`
export const StyledTextField = styled(TextField)({
  width: '50px',
  '& input': {
    textAlign: 'center',
    padding: '2px 4px',
    fontSize: 'inherit'
  },
  '& .MuiOutlinedInput-root': {
    height: '24px'
  }
})
