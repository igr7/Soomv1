/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark luxury theme
        background: {
          primary: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1a1a1a',
        },
        // Neon green accent
        accent: {
          primary: '#00FF41',
          secondary: '#00CC34',
          dark: '#009929',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          tertiary: '#707070',
        },
        // Status colors
        success: '#00FF41',
        error: '#FF3B30',
        warning: '#FFD60A',
        info: '#0A84FF',
      },
      fontFamily: {
        // Add custom fonts in Phase 2
      },
    },
  },
  plugins: [],
}
