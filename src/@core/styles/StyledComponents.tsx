import { Box } from '@mui/material'
import styled from 'styled-components'

export const HorizontalScrollBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
  white-space: nowrap;
  max-height: 120px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 0;

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
