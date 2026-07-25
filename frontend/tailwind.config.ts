import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070B14",
          900: "#0B1120",
          800: "#111827",
          700: "#1B2436",
        },
        accent: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dim: "#2563EB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 50% at 50% 35%, rgba(59,130,246,0.16) 0%, rgba(11,17,32,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
