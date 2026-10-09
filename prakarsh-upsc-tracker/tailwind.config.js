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
          950: "#06080A",
          900: "#0B0E12",
          800: "#12171F",
          700: "#1A222C",
          600: "#263342",
          500: "#3D4F63",
          400: "#5D738A",
        },
        parchment: {
          50: "#FFFFFF",
          100: "#F1F5F9",
          300: "#CBD5E1",
          500: "#7F94A6",
        },
        gold: {
          300: "#FFE082",
          400: "#FFB300",
          500: "#FF9100", // COD Warzone Tactical Orange / Amber
          600: "#E07500",
          700: "#B85800",
        },
        teal: {
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#00F0FF", // COD EMP / Night Ops Cyber Cyan
          600: "#0891B2",
          700: "#0E7490",
        },
        rust: {
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444", // COD Threat Level Red
          600: "#DC2626",
        },
        tactical: {
          green: "#00E676", // Killstreak Active Green
          amber: "#FF9100",
          cyan: "#00F0FF",
          dark: "#080B0E",
          card: "#11161D",
        },
      },
      fontFamily: {
        display: ["'Chakra Petch'", "'Rajdhani'", "sans-serif"],
        tactical: ["'Rajdhani'", "sans-serif"],
        body: ["'Rajdhani'", "'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "0.75rem",
      },
      boxShadow: {
        soft: "0 4px 25px -4px rgba(0,0,0,0.7)",
        card: "0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        glow: "0 0 15px rgba(255,145,0,0.35), 0 0 2px rgba(255,145,0,0.6)",
        glowCyan: "0 0 15px rgba(0,240,255,0.35), 0 0 2px rgba(0,240,255,0.6)",
        glowGreen: "0 0 15px rgba(0,230,118,0.35), 0 0 2px rgba(0,230,118,0.6)",
        glowRed: "0 0 15px rgba(239,68,68,0.35), 0 0 2px rgba(239,68,68,0.6)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        popIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
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
        fadeUp: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        popIn: "popIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
        radar: "radarSweep 4s linear infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        drawLine: "drawLine 1.8s ease-out forwards",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
}
