import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  // daisyUI config (optional)
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "synthwave"],
  },
}

