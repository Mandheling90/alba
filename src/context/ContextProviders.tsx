import { CacheProvider } from '@emotion/react'
import { ReactNode } from 'react'
import { QueryClientProvider } from 'react-query'

// ** Context Providers
import { SettingsProvider } from 'src/@core/context/settingsContext'
import { AuthProvider } from 'src/context/AuthContext'

// ** Other imports
import { queryClient } from '../module/reactQuery'
import { ContentsProvider } from './ContensContext'
import { KioskProvider } from './KioskContext'
import { KioskManagerProvider } from './KioskManagerContext'
import { MonitoringProvider } from './MonitoringContext'

import { SocketDataProvider } from './SocketDataContext'
import { StatisticsProvider } from './StatisticsContext'

type ProvidersProps = {
  children: ReactNode
  emotionCache: any
  settingsProps?: any
}

const ContextProviders = ({ children, emotionCache, settingsProps }: ProvidersProps) => {
  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ContentsProvider>
            <KioskProvider>
              <KioskManagerProvider>
                <StatisticsProvider>
                  <MonitoringProvider>
                    <SocketDataProvider>
                      <SettingsProvider {...settingsProps}>{children}</SettingsProvider>
                    </SocketDataProvider>
                  </MonitoringProvider>
                </StatisticsProvider>
              </KioskManagerProvider>
            </KioskProvider>
          </ContentsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </CacheProvider>
  )
}

export default ContextProviders
