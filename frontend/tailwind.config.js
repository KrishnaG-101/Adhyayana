/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FAF8F5',
          dark: '#161618',
          surface: '#F5F2EB',
          border: '#E7E3DA',
        },
        charcoal: {
          DEFAULT: '#161618',
          surface: '#202024',
          border: '#2E2E34',
        },
        darkCanvas: '#161618',
        darkSurface: '#202024',
        darkBorder: '#2E2E34',
        darkText: {
          primary: '#E4E4E7',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tile: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
