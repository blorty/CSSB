/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js, jsx, ts, tsx}",
  ],
  theme: {
    extend: {
      textColors: {
        hover: 'orange',
      },
      boxShadow: {
        glow: '0 0 10px #fff, 0 0 5px #fff',
      },
    },
  },
  variants: {
    extend: {
      textColor: ['hover'],
      boxShadow: ['hover'],
    },
  },
  plugins: [],
}