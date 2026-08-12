import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
        arabic: ["var(--font-almarai)", "system-ui", "sans-serif"],
      },
      colors: {
        mhero: {
          black: "#141416",
          charcoal: "#1e1e21",
          graphite: "#2a2a2e",
          steel: "#4d4d52",
          ash: "#97979d",
          fog: "#eae9e7",
          white: "#faf9f7",
          accent: "#f5f5f4",
          "accent-dark": "#c9c9c6",
          "accent-light": "#ffffff",
          primary: "#8fb5a6",
          "primary-dark": "#78a394",
        },
      },
      maxWidth: {
        "8xl": "1440px",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
