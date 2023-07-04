/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      spacing: {
        'body-w': '375px'
      },
      colors: {
        'theme-bg-color': '#3772FF',
        'theme-bg-color-200': '#18191d'
      }
    },
  },
  plugins: [],
}
