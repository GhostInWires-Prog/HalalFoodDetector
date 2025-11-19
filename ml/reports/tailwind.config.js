/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'title-pop': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          '60%': { opacity: '1', transform: 'translateY(-4px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'subtitle-slide': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        blob: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(25px, -20px, 0) scale(1.1)' }
        },
        'blob-reverse': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-30px, 24px, 0) scale(0.9)' }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.35' },
          '50%': { transform: 'scale(1.1)', opacity: '0.75' },
          '100%': { transform: 'scale(0.9)', opacity: '0.35' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.65s ease-out both',
        'title-pop': 'title-pop 0.7s ease-out both',
        'subtitle-slide': 'subtitle-slide 0.7s ease-out both',
        'blob': 'blob 18s ease-in-out infinite',
        'blob-reverse': 'blob-reverse 22s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 3.4s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-in forwards'
      },
      boxShadow: {
        glow: '0 18px 55px -24px rgba(59, 130, 246, 0.55)',
        ultralight: '0 10px 45px -15px rgba(59, 130, 246, 0.35)'
      },
      backgroundImage: {
        'grid-soft': 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.08) 1px, transparent 0)',
        aurora:
          'conic-gradient(from 180deg at 50% 50%, rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.35), rgba(147, 51, 234, 0.25))'
      },
      borderRadius: {
        '4xl': '2.5rem'
      }
    }
  },
  plugins: []
};

