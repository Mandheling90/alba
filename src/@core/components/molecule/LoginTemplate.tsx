import { Box, CardContent } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ILoginTemplate {
  children: React.ReactNode
}

const LoginTemplate: React.FC<ILoginTemplate> = ({ children }) => {
  return (
    <CardContent sx={{ p: theme => `${theme.spacing(5, 9, 7)} !important` }}>
      <Box sx={{ mb: 6 }}>
        <IconCustom isCommon path='login' icon='DSInsightHeader' style={{ height: '35px' }} />
      </Box>
      {children}
    </CardContent>
  )
}

export default LoginTemplate
