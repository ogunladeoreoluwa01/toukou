/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'loginBackground':
          'linear-gradient(to right bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(https://i.pinimg.com/originals/da/57/94/da579413bf1628ac0488e51dbd8ad5ff.png)',
        'registerBackground':
          'linear-gradient(to right bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(https://i.pinimg.com/originals/da/57/94/da579413bf1628ac0488e51dbd8ad5ff.png )'
      },
      fontFamily: {
        NotoSans: ["Noto Sans", "sans-serif"],
        NotoSerif: ["Noto Serif", "serif"],
      },
    },
  },
  plugins: [],
}
