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
          dark: '#121213',
          surface: '#F5F2EB',
          border: '#E7E3DA',
        },
        charcoal: {
          DEFAULT: '#121213',
          surface: '#1C1917',
          border: '#2E2E2E',
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
