module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Playfair Display", "Times", "serif"],
      elsie: ["Elsie", "cursive"],
    },
    screens: {
      xxs: "360px",
      xs: "540px",
      sm: "650px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        main: "rgb(1, 18, 22)",
        dash: "#2a654c",
        "main-light": "rgb(16,37,68)",
        "light-blue": "rgb(0,163,223)",
      },
    },
  },
  plugins: [],
};
