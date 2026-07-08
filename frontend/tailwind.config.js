/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffefd1',
          200: '#ffdca3',
          300: '#ffc26a',
          400: '#ff9f30',
          500: '#fb8016',
          600: '#ec600c',
          700: '#c3460c',
          800: '#9b3812',
          900: '#7d3012',
        },
        dogra: {
          maroon: '#7a1f2b',
          maroonDark: '#4e1219',
          gold: '#d4a017',
          cream: '#fdf6ec',
          slate: '#1f2430',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
