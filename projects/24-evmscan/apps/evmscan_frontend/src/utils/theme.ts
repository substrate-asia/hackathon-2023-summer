import { createTheme } from '@mui/material/styles'

export const theme = createTheme(
  {
    palette: {
      primary: {
        light: '#7b8da1',
        dark: '#3e4f60',
        main: '#538fff',
      },
      secondary: {
        light: '#8798f3',
        main: '#697ff1',
        dark: '#4958a8',
      },
      background: {
        default: '#ffffff',
        paper: '#f1f6ff'
      },
      text: {
        primary: '#2e4469',
        secondary: '#7d86a9'
      }
    },
    typography: {
      fontFamily: `'Noto Sans','Noto Sans SC', sans-serif !important`
    },
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'none',
        }
      },
    }
  }
)
