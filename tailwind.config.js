/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#181D27",
        neutral: {
          100: "#FCFCFD",
          500: "#6C757D",
          900: "#212529",
        },
      },
    },
  },
  plugins: [],
};
