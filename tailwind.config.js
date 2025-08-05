module.exports = {
  content: [
    './index.html',
    './sections.html',
    './guide.html',
    './main.js',
    './guide.js',
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#8c3600',
        'brand-bg': '#fff8f3'
      },
      fontFamily: {
        sans: ['Inter','Roboto','Arial','sans-serif'],
        headline: ['Pacifico','cursive']
      }
    }
  },
  plugins: []
};
