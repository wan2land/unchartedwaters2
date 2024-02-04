/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dos-black": "#000000",
        "dos-white": "#f3e3d3",
      },
    },
  },
  plugins: [],
};
