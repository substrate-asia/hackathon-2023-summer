/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [
        '-apple-system,BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans - serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
        'Söhne',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Ubuntu',
        'Cantarell',
        'Noto Sans',
        'sans-serif',
        'Helvetica Neue',
        'Arial',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      mono: ['Söhne Mono', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
      urbanist: ['roboto', 'Urbanist']
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: { padding: 0, margin: 0 },
            ul: {
              'list-style-type': 'none',
            },
          },
        },
      },
      colors: {
        gray: {
          50: '#f7f7f8',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#BBBBBB',
          400: '#acacbe',
          500: '#8e8ea0',
          600: '#4b5563',
          700: '#40414f',
          800: '#343541',
          808: '#9098A0',
          900: '#949494',
        },
        logStart: '#4EBE96',
        logEnd: '#A4DA5E',
        homeMain: '#68ECCD',
        btnStart: '#83F3F9',
        btnEnd: '#66EBCA'
      },
      backgroundImage: {
        'HomeBG': "url('@src/assets/background.png')",
        'btn': 'linear-gradient(190.12deg, #66CCC6 17.74%, #75E3C8 95.88%);'
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar')],
  darkMode: 'class',
};
