/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'Inter', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        primary: "#2a003f",     // Deep onion purple
        secondary: "#a779e9",   // Light onion purple
        accent: "#dfbfff",      // Extra light purple
      },
    },
  },
  plugins: [],
};
