/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0F11",
          900: "#0F1417",
          800: "#171D21",
          700: "#1E262B",
          600: "#2A3236",
          500: "#3A4449",
          400: "#5A6469",
        },
        parchment: {
          50: "#F7F4EC",
          100: "#ECE8DE",
          300: "#C9C4B6",
          500: "#8B9296",
        },
        gold: {
          300: "#EBD09B",
          400: "#DDB877",
          500: "#D4A657",
          600: "#B98A3C",
          700: "#8F6A2C",
        },
        teal: {
          300: "#8FCFC3",
          400: "#6BB8AA",
          500: "#4FA89B",
          600: "#3B8478",
          700: "#2B615A",
        },
        rust: {
          300: "#F0A084",
          400: "#E68563",
          500: "#E2694B",
          600: "#BC4E34",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(0,0,0,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 6px 24px -8px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(212,166,87,0.25), 0 8px 30px -8px rgba(212,166,87,0.25)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        popIn: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        drawLine: {
          "0%": { strokeDashoffset: 1000 },
          "100%": { strokeDashoffset: 0 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both",
        popIn: "popIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        drawLine: "drawLine 1.8s ease-out forwards",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
}
