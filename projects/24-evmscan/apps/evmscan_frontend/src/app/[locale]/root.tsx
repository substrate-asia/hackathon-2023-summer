'use client'

import CssBaseLine from '@mui/material/CssBaseline'
import { ThemeProvider, styled } from '@mui/material/styles'
import '@fontsource/noto-sans/500.css'
import '@fontsource/noto-sans/700.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import '../../styles/globals.css'
import { theme } from 'src/utils/theme'
import Header from 'src/components/Header'

const RootPage = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  overflowY: 'auto',
  backgroundColor: '#f5f5f544',
}))

const Body = styled('div')(() => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
}))

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      <RootPage>
        <Header />
        <Body>{children}</Body>
      </RootPage>
    </ThemeProvider>
  )
}
