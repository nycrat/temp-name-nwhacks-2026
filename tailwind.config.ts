import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00a1ff",
        "ubc-gold": "#FFC200",
        "background-light": "#f5f7f8",
        "background-dark": "#121212",
        "panel-dark": "#1e1e1e",
      },
      fontFamily: {
        "display": ["var(--font-space-grotesk)", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
};
export default config;
