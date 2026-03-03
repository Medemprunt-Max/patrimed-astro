/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8E1F3',
          100: '#F0C3E6',
          200: '#E096D0',
          300: '#C96AB5',
          400: '#A8408D',
          500: '#81286b',
          600: '#6B2159',
          700: '#591d4c',
          800: '#3D1434',
          900: '#250C20',
        },
        accent: {
          DEFAULT: '#591d4c',
          light: '#81286b',
          dark: '#3D1434',
        },
        dark: {
          DEFAULT: '#252525',
          light: '#3a3a3a',
          lighter: '#555555',
        },
        pat: {
          plum: '#81286b',
          burgundy: '#591d4c',
          pink: '#F8E1F3',
          gradient: {
            from: '#3D1434',
            via: '#591d4c',
            to: '#81286b',
          },
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
