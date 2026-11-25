/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mandi: {
          dark: '#0f172a',
          navy: '#1e293b',
          surface: '#f8fafc',
          border: '#e2e8f0',
        },
        gradeA: {
          DEFAULT: '#059669', // Emerald 600
          light: '#d1fae5',
          dark: '#047857',
          glow: 'rgba(5, 150, 105, 0.4)',
        },
        urs: {
          DEFAULT: '#d97706', // Amber 600
          light: '#fef3c7',
          dark: '#b45309',
          glow: 'rgba(217, 119, 6, 0.4)',
        },
        reject: {
          DEFAULT: '#dc2626', // Crimson 600
          light: '#fee2e2',
          dark: '#b91c1c',
          glow: 'rgba(220, 38, 38, 0.4)',
        },
        doca: {
          blue: '#1e40af',
          saffron: '#ea580c',
          green: '#15803d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
