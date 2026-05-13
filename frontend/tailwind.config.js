/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // Azul escuro
        secondary: '#3B82F6', // Azul claro
        accent: '#FBBF24', // Amarelo
        background: '#F3F4F6', // Cinza claro
      },
    },
  },
  plugins: [],
}
