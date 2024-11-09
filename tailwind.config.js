/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: 'Montserrat'

      },
      screens: {
        mobile: {
          max: '768px'
        },
        lg: {
          min: '768px',
          max: '1160px'
        },
        full: {
          min: '1160px',
          max: '1540px'
        },
        xl: {
          min: '1540px'
        }

      }
    },
  },
  plugins: [],
}
