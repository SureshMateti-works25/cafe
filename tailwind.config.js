/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#FDFBF7',
          100: '#F8F4EB',
          200: '#EFE6D5',
          300: '#E0D0B5',
          400: '#C7AE87',
          500: '#A9895B',
          600: '#8C6B40',
          700: '#6E4F2B',
          800: '#4E361D',
          900: '#2F1E0E',
          950: '#1B1006',
        },
        roast: {
          DEFAULT: '#362417',
          light: '#533C29',
          dark: '#1F140C'
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6EFE6',
          500: '#4E7E5A',
          600: '#3D6547',
          700: '#2E4C35'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
