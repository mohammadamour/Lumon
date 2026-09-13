/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#23A6F0',
          50:  '#EBF6FE',
          100: '#C7E7FC',
          200: '#8FD0F9',
          300: '#57B8F6',
          400: '#23A6F0',
          500: '#1A8DD0',
          600: '#1274B0',
          700: '#0B5B90',
        },
        success: {
          DEFAULT: '#2DC071',
          50:  '#EAFAF2',
          100: '#C3F0DB',
          400: '#2DC071',
          600: '#1EA85E',
        },
        dark: {
          DEFAULT: '#252B42',
          700: '#1A1F33',
          800: '#101425',
        },
        muted: {
          DEFAULT: '#737373',
          light: '#BDBDBD',
        },
        topbar: '#23856D',
        light: {
          DEFAULT: '#FAFAFA',
          100: '#F5F5F5',
          200: '#ECECEC',
        },
        danger: {
          DEFAULT: '#E74040',
          50:  '#FEF0F0',
        },
        warning: {
          DEFAULT: '#E77C40',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h1':      ['2.5rem', { lineHeight: '1.2',  fontWeight: '700' }],
        'h2':      ['2rem',   { lineHeight: '1.25', fontWeight: '700' }],
        'h3':      ['1.5rem', { lineHeight: '1.3',  fontWeight: '700' }],
        'h4':      ['1.25rem',{ lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg': ['1.125rem',{ lineHeight: '1.6', fontWeight: '400' }],
        'body':    ['0.875rem',{ lineHeight: '1.7', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-lg': '0 10px 30px rgba(0,0,0,0.08)',
        'nav':     '0 2px 12px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'scale-in':     'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
