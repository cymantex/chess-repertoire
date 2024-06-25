/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      "black",
      "business",
      "coffee",
      "dark",
      "dim",
      "dracula",
      "forest",
      "light",
      "luxury",
      "night",
      "nord",
    ],
  },
  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
