/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
    // Add any other plugins here
  ],
};