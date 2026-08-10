import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        custom: {
          parchment: "#FDFBF7",
          cream: "#F4F1E9",
          forest: "#1F3F2F",
          gold: "#C9A66B",
          charcoal: "#2A2A2A",
          muted: "#6B6B5C",
          white: "#FFFFFF"
        }
      },
    },
  },
  plugins: [],
};
export default config;
