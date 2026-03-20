/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff7ff',
          100: '#d8ebff',
          200: '#b0d7ff',
          300: '#7bbaff',
          400: '#4898ff',
          500: '#1e7aff',
          600: '#145fe0',
          700: '#1049b3',
          800: '#0f3a8c',
          900: '#102f6f',
        },
      },
    },
  },
  plugins: [],
}
