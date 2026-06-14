import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf8e7",
          100: "#faefc4",
          200: "#f5db89",
          300: "#efc04d",
          400: "#e8a823",
          500: "#c9871a",
          600: "#a86815",
          700: "#854e14",
          800: "#6e3f17",
          900: "#5e3519",
        },
        sand: {
          50: "#fdf6ef",
          100: "#f9e8d4",
          200: "#f2cfa8",
          300: "#e9b07a",
          400: "#df8d53",
          500: "#d87040",
          600: "#c75635",
          700: "#a5422e",
          800: "#85382c",
          900: "#6c3027",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "Noto Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
