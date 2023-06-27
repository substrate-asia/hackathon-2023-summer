/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  mode: "jit",
  theme: {
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: "1rem",
      base: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.875rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
      "5xl": "4rem",
      "6xl": "5rem",
      "7xl": "6rem",
      "8xl": "7rem",
      "9xl": "8rem",
      "10xl": "9rem",
      "11xl": "10rem",
      "12xl": "11rem",
      "13xl": "12rem",
      "14xl": "13rem",
      "15xl": "14rem",
    },
    extend: {
      colors: {
        "gray-line": "#fff3",
        "space-gray": {
          light: "#405FBA",
          lighter: "#112769",
          DEFAULT: "#071643",
          dark: "#081029",
        },
        "space-pink": {
          light: "#FFADD9",
          lighter: "#FB4AA8",
          DEFAULT: "#E0338F",
        },
        "space-purple": {
          light: "#C9A5FF",
          lighter: "#9256ED",
          DEFAULT: "#703AC2",
        },
        "space-blue": {
          light: "#A4BDFF",
          lighter: "#3D73FF",
          DEFAULT: "#215AEC",
        },
        "space-sky": {
          light: "#9ED8FF",
          lighter: "#34ADFF",
          DEFAULT: "#0099FF",
        },
        "space-cyan": {
          light: "#A7F5FF",
          lighter: "#66EDFF",
          DEFAULT: "#0AE2FF",
        },
        "space-teal": {
          light: "#C0FFF4",
          lighter: "#80FFE8",
          DEFAULT: "#00FFD1",
        },
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        mono: ['"Roboto Mono"', ...defaultTheme.fontFamily.mono],
        jp: ['"Noto Sans JP"', ...defaultTheme.fontFamily.sans],
        roboto: ['"Roboto"', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
