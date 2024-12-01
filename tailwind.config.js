/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f7',
          100: '#fce7f2',
          200: '#fbc6e3',
          300: '#f893c9',
          400: '#f35ba3',
          500: '#e93d82',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      backgroundColor: {
        'brand-light': '#fdf2f7',
      },
    },
  },
  plugins: [],
};