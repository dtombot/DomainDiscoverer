/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  content:['./src/**/*.{astro,html,js,ts,md,mdx}'],
  safelist:['bg-primary','text-white','from-primary','to-secondary','text-accent','border-accent','bg-gradient-to-r','bg-gradient-to-b','card','btn-primary','container-pad'],
  theme:{ extend:{
    fontFamily:{
      display:['Inter','Segoe UI Variable','Segoe UI','Arial','sans-serif'],
      body:['Inter','Segoe UI Variable','Segoe UI','Arial','sans-serif'],
      mono:['Consolas','Menlo','monospace']
    },
    colors:{primary:'#181b20',secondary:'#2a2f37',accent:'#e4c8a4'}
  }},
  plugins:[typography]
};
