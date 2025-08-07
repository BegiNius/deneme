module.exports = {
  content: [
    './*.html',
    './*.js',
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#8c3600',
        'brand-bg': '#fff8f3'
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        headline: ['Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
