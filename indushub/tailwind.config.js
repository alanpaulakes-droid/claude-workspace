/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Identidad INDUSHUB
        primary: {
          DEFAULT: '#0F2B48', // Azul Industrial
          light: '#1C4670',
          dark: '#0A1F35',
        },
        accent: {
          DEFAULT: '#FF6B35', // Naranja CTA
          light: '#FF8A5E',
          dark: '#E4551F',
        },
        surface: '#FFFFFF', // Tarjetas
        background: '#F4F6F9', // Fondo claro
        muted: '#6B7A90',
        line: '#E5EAF1',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '26px',
      },
    },
  },
  plugins: [],
};
