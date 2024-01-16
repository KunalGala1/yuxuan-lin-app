module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Playfair Display', 'Times', 'serif'],
      elsie: ['Elsie', 'cursive'],
    },
    screens: {
      xxs: '360px',
      xs: '540px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },    
    extend: {
      colors: {
        main: 'rgb(4, 19, 32)',
      },
    },
  },
  plugins: [],
};
