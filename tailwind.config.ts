import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "lg-max": { max: "1024px" },
      },
      backgroundImage: {
        wheel: "url('/gcr/wheel.svg')",
      },
      colors: {
        "loaf-blue": {
          550: "#c9e9ff70",
        },
        "loaf-pink": {
          400: "#ff7eb6",
          300: "#e26ac1",
        },
        "loaf-white": { 100: "#FFFFFF" },
        "loaf-gray": {
          50: "#1A1A1A",
          100: "#F5F5F5",
          150: "#161616",
          200: "#F3F4F6",
          225: "rgba(255, 255, 255, 0.02)",
          250: "rgba(255, 255, 255, 0.04)",
          300: "#313131",
          400: "#C7C7C7",
          500: "#6F6F6F",
          600: "#222222",
          650: "#242424",
          700: "#181818",
          750: "#a3a2a3",
          800: "#111111",
          900: "#0b0b0b",
        },
        "loaf-black": {
          350: "rgba(11, 11, 11, 0.60)",
          450: "rgba(11, 11, 11, 0.90)",
        },
        "loaf-clay": {
          100: "#c39498",
        },
        "loaf-brown": {
          100: "#bb7b01",
        },
      },
      fontSize: {
        tiny: [".5rem", { lineHeight: ".5rem" }],
        xxs: [".625rem", { lineHeight: ".75rem" }],
      },
      fontFamily: {
        ModeSeven: ["ModeSeven"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@headlessui/tailwindcss"),
  ],
};
export default config;
