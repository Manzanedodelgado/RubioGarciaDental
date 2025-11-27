/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'clinic-blue': '#00008B', // Azul oscuro de la clínica
        'clinic-teal': '#1E4D5C', // Color del logo/marco
      },
    },
  },
  plugins: [],
}
