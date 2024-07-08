const COMMON_COLORS = {
  error: "#882020",
  success: "#15781B",
  info: "#003088",
  warning: "#e68f00",
  accent: "#395a6d",
  neutral: "#395a6d",
  "accent-content": "#ffffff",
};

const chessRepertoireTheme = (themeName, props = {}) => ({
  [themeName]: {
    ...require("daisyui/src/theming/themes")[themeName],
    ...COMMON_COLORS,
    ...props,
  },
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      chessRepertoireTheme("black", {
        neutral: "#90b4c9",
      }),
      chessRepertoireTheme("lofi"),
    ],
  },
  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
