'use client'

import CssBaseLine from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import '@fontsource/noto-sans/500.css'
import '@fontsource/noto-sans/700.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import '../../styles/globals.css'
import { theme } from 'src/utils/theme'

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      {children}
    </ThemeProvider>
  )
}
