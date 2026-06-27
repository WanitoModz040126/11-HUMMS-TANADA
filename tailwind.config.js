/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F1A",
          deep: "#070A12",
          surface: "#131826",
          surface2: "#1B2236",
          line: "#2A3349",
        },
        marigold: {
          DEFAULT: "#F2B705",
          dim: "#B98A06",
        },
        coral: {
          DEFAULT: "#FF5C7A",
          dim: "#C8455F",
        },
        teal: {
          DEFAULT: "#2DD4BF",
          dim: "#1F9E8F",
        },
        parchment: "#F5F2E9",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "22px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 18px 40px -12px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(242,183,5,0.25), 0 18px 40px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(var(--tilt,0deg))" },
          "50%": { transform: "translateY(-6px) rotate(var(--tilt,0deg))" },
        },
        heartpop: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.4)" },
          "60%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        heartpop: "heartpop 0.45s ease",
      },
    },
  },
  plugins: [],
};
