/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        sky: {
          950: '#080f1f',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'rain': 'rain 1s linear infinite',
        'snow': 'snow 5s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite',
        'lightning': 'lightning 4s ease-in-out infinite',
        'shooting-star': 'shooting-star 7s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        snow: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99,179,237,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99,179,237,0.6), 0 0 80px rgba(99,179,237,0.2)' },
        },
        lightning: {
          '0%, 90%, 100%': { opacity: '0' },
          '92%, 96%': { opacity: '0.8' },
          '94%': { opacity: '0' },
        },
        'shooting-star': {
          '0%':   { transform: 'translateX(-80px) translateY(0px) rotate(20deg)', opacity: '0' },
          '5%':   { opacity: '1' },
          '30%':  { transform: 'translateX(110vw) translateY(60px) rotate(20deg)', opacity: '0.8' },
          '31%':  { opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.2)',
        'glow-blue': '0 0 30px rgba(56,189,248,0.4)',
        'glow-gold': '0 0 30px rgba(251,191,36,0.4)',
      },
    },
  },
  plugins: [],
}
