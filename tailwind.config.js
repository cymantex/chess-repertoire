const COMMON_COLORS = {
  error: "#882020",
  success: "#15781B",
  info: "#003088",
  warning: "#e68f00",
  "accent-content": "#ffffff",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        black: {
          ...require("daisyui/src/theming/themes")["black"],
          ...COMMON_COLORS,
          accent: "#395a6d",
        },
      },
      {
        lofi: {
          ...require("daisyui/src/theming/themes")["lofi"],
          ...COMMON_COLORS,
          accent: "#00717b",
        },
      },
    ],
  },
  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
