/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/**/*.{astro,html,js,ts,md,mdx}',
    './public/**/*.html'
  ],
  safelist: [
    'bg-primary','text-white','from-primary','to-secondary','text-accent','border-accent',
    'bg-gradient-to-r','bg-gradient-to-b','backdrop-blur','rounded-2xl','rounded-xl',
    'card','btn-primary','container-pad','shadow','shadow-lg','shadow-xl'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Manrope', 'Poppins', 'Inter', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'Plus Jakarta Sans', 'Manrope', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      colors: {
        primary: '#2a003f',
        secondary: '#a779e9',
        accent: '#f9a8d4'
      }
    }
  },
  plugins: [typography]
};
