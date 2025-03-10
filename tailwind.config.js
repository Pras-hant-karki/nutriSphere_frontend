/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      // Common Colors
      black: "#000",
      white: "#fff",

      // Light Mode Colors
      "light-bg": "#F9F4F0",
      "purple-lighter": "#AE7AFF",
      "purple-lighter-hover": "#a26afd",
      "purple-lighter-black-20": "#8B62CC",
      "purple-lighter-white-80": "#EFE4FF",

      "pale-yellow": "#FAE8A4",
      "pale-red": "#E99898",
      "pale-green": "#98E9AB",
      "pale-yellow-80": "#FEFAED",
      "pale-red-80": "#FBEAEA",
      "pale-green-80": "#EAFBEE",

      "dark-slate": "#5F646D",
      "dark-slate-85": "#E7E8E9",
      "pearl-white": "FAF4F0",

      // Dark Mode Colors
      "dark-bg": "#161616",
      "black-75": "#262524",
    },
    screens: {
      vsm: "500px",
      // => @media (min-width: 500px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      "md-2": "850px",
      // => @media (min-width: 850px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
};
