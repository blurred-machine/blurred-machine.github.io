/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0a192f',
        'light-navy': '#112240',
        'lightest-navy': '#233554',
        'navy-shadow': 'rgba(2, 12, 27, 0.7)',
        'dark-slate': '#495670',
        slate: '#8892b0',
        'light-slate': '#a8b2d1',
        'lightest-slate': '#ccd6f6',
        white: '#e6f1ff',
        green: '#64ffda',
        'green-tint': 'rgba(100, 255, 218, 0.1)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Calibre',
          '-apple-system',
          'system-ui',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Fira Code',
          'Fira Mono',
          'Roboto Mono',
          'monospace',
        ],
      },
      fontSize: {
        xxs: '12px',
      },
      boxShadow: {
        navy: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
        'navy-lg': '0 20px 30px -15px rgba(2, 12, 27, 0.7)',
        glow: '0 0 30px -10px rgba(100, 255, 218, 0.45)',
      },
      transitionTimingFunction: {
        'in-out-soft': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.645, 0.045, 0.355, 1) forwards',
        'pulse-soft': 'pulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
