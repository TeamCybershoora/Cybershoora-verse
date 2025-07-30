/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'beni': ['Beni', 'sans-serif'],
        'juan': ['Juan', 'sans-serif'],
        'neue-machina': ['NeueMachina', 'sans-serif'],
        'gilroy': ['Gilroy', 'sans-serif'],
        'helvetica': ['Helvetica', 'sans-serif'],
        'source-code': ['SourceCodePro', 'monospace'],
      },
    },
  },
  plugins: [],
} 