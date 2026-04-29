/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic / signal palette
        dark: '#050505',
        surface: '#0a0a0a',
        'surface-2': '#101010',
        accent: '#818cf8',           // signal indigo (kept for brand continuity)
        'accent-cyan': '#22d3ee',
        'accent-purple': '#a78bfa',
        'signal-amber': '#c9a86a',   // warm transmission accent
        'signal-green': '#22d39e',   // status active
        'signal-red': '#ff4d6d',     // critical / archived
        muted: '#5b5b5b',
        'muted-2': '#3a3a3a',
        border: 'rgba(255,255,255,0.06)',
        'border-strong': 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(129, 140, 248, 0.3)',
        'glow': '0 0 30px rgba(129, 140, 248, 0.4)',
        'glow-lg': '0 0 60px rgba(129, 140, 248, 0.5)',
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.6)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
