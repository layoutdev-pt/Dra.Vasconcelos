/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- OBRIGATÓRIO: Diz ao Tailwind para olhar para a classe no HTML
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}