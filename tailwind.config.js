
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          red: '#FF0000',
          black: '#0F0F0F',
          white: '#FFFFFF',
          gray: {
            light: '#F2F2F2',
            DEFAULT: '#AAAAAA',
            dark: '#606060',
          },
        },
      },
    },
  },
  plugins: [],
}
