import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'flip-in': {
          '0%': { transform: 'rotateY(-180deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0)', opacity: '1' },
        },
        'flip-out': {
          '0%': { transform: 'rotateY(0)', opacity: '1' },
          '100%': { transform: 'rotateY(180deg)', opacity: '0' },
        },
      },
      animation: {
        'gradient-x': 'gradient 8s ease infinite',
        'fade-up': 'fade-up 400ms ease both',
        'scale-in': 'scale-in 200ms ease-out both',
        'flip-in': 'flip-in 400ms ease both',
        'flip-out': 'flip-out 400ms ease both',
      },
    },
  },
  plugins: [animate],
} satisfies Config;

