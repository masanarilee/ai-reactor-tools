import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        ai: {
          primary: '#4F46E5',
          secondary: '#818CF8',
          accent: '#6366F1',
          background: '#F8FAFC',
          foreground: '#1E293B'
        }
      },
      keyframes: {
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1.0)' }
        }
      },
      animation: {
        'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out both'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
