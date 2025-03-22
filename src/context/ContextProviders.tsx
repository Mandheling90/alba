import { CacheProvider } from '@emotion/react'
import { ReactNode } from 'react'
import { QueryClientProvider } from 'react-query'

// ** Context Providers
import { SettingsProvider } from 'src/@core/context/settingsContext'
import { AuthProvider } from 'src/context/AuthContext'

// ** Other imports
import { queryClient } from '../module/reactQuery'
import { ClientsProvider } from './ClientsContext'
import { LayoutProvider } from './LayoutContext'
import { MapProvider } from './MapContext'

type ProvidersProps = {
  children: ReactNode
  emotionCache: any
  settingsProps?: any
}

const ContextProviders = ({ children, emotionCache, settingsProps }: ProvidersProps) => {
  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          <AuthProvider>
            <MapProvider>
              <ClientsProvider>
                <SettingsProvider {...settingsProps}>{children}</SettingsProvider>
              </ClientsProvider>
            </MapProvider>
          </AuthProvider>
        </LayoutProvider>
      </QueryClientProvider>
    </CacheProvider>
  )
}

export default ContextProviders
