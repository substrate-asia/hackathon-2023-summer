/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {},
      colors: {},
      borderRadius: {},
      boxShadow: {}
    },
  },
  plugins: [],
}
