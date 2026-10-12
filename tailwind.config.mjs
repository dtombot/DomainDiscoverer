/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  content: ['./src/**/*.{astro,html,js,ts,md,mdx}'],
  safelist: ['bg-primary','text-white','from-primary','to-secondary','text-accent','border-accent','bg-gradient-to-r','bg-gradient-to-b','card','btn-primary','container-pad'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Iowan Old Style','Baskerville','Palatino Linotype','Georgia','serif'],
        body: ['Aptos','Segoe UI','Arial','sans-serif'],
        mono: ['Consolas','Menlo','monospace']
      },
      colors: { primary:'#111815', secondary:'#879e7a', accent:'#c6dc85' }
    }
  },
  plugins: [typography]
};
