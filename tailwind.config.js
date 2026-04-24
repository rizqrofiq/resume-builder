/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Name sizes
    'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl',
    // Job title sizes
    'text-sm', 'text-base', 'text-lg', 'text-xl',
    // Contact info sizes
    'text-xs',
    // Text transforms (name casing & header transforms)
    'uppercase', 'capitalize', 'lowercase', 'normal-case',
    // Alignment
    'text-left', 'text-center', 'text-right',
    'items-start', 'items-center', 'items-end',
    'justify-start', 'justify-center', 'justify-end',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
