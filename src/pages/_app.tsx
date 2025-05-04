// ** React Imports
import { ReactNode, Suspense, useEffect } from 'react'

// ** Next Imports
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import type { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// ** Config Imports

import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import AclGuard from 'src/@core/components/auth/AclGuard'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import UserLayout from 'src/layouts/UserLayout'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { SettingsConsumer } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/themes/prism-tomorrow.css'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import 'slick-carousel/slick/slick-theme.css' // 기본 테마
import 'slick-carousel/slick/slick.css'

import '../../styles/globals.css'

// ** react-query
import { QueryClientProvider } from 'react-query'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import ContextProviders from 'src/context/ContextProviders'
import { ModalProvider } from 'src/context/ModalContext'
import { queryClient } from '../module/reactQuery'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  // ** Highcharts Imports - 차트 프로바이더로 추후 이동
  useEffect(() => {
    let Highcharts: any
    let HeatmapModule: any

    import('highcharts')
      .then(module => {
        Highcharts = module.default

        return import('highcharts/modules/heatmap')
      })
      .then(heatmapModule => {
        HeatmapModule = heatmapModule.default || heatmapModule
        if (typeof HeatmapModule === 'function') {
          HeatmapModule(Highcharts)
        }
      })
      .catch(error => {
        console.error('Error loading Highcharts or Heatmap module:', error)
      })
  }, [])

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <CacheProvider value={emotionCache}>
      {/* <Head>
        <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
        />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head> */}
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>loading...</div>}>
          <ContextProviders emotionCache={emotionCache} settingsProps={setConfig ? { pageSettings: setConfig() } : {}}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <ModalProvider>
                      {/* <SoketComponent> */}
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ModalProvider>
                    {/* </SoketComponent> */}
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </ContextProviders>
        </Suspense>
      </QueryClientProvider>
    </CacheProvider>
  )
}

export default App
