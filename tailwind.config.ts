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
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F6F4F0",
          warm: "#EFEBE4",
        },
        ink: {
          DEFAULT: "#111111",
          soft: "#2A2A2A",
        },
        muted: {
          DEFAULT: "#6B6560",
          soft: "#9A948C",
        },
        line: {
          DEFAULT: "#E6E1D8",
          strong: "#D4CFC5",
        },
        khaki: {
          DEFAULT: "#C4B396",
          deep: "#A89272",
          soft: "#E9E2D4",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17,17,17,0.06)",
        lift: "0 8px 30px rgba(17,17,17,0.08)",
      },
      maxWidth: {
        atelier: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
