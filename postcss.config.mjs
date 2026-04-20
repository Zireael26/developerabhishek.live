// Tailwind CSS 4 uses a dedicated PostCSS plugin (CSS-first config — no tailwind.config.ts).
// All design tokens, breakpoints, and theme values live in app/globals.css under @theme.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
