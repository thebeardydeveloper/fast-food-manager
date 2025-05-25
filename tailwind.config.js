/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./renderer.js",
  ],
  theme: {
    extend: {
      // You can extend the default Tailwind theme here if needed
      // For example, custom colors, fonts, etc.
    },
  },
  plugins: [
    // You can add Tailwind plugins here if needed
    // require('@tailwindcss/forms'), // Example for better form styling
  ],
}