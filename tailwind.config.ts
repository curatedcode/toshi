import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "toshi-red": "#a91101",
        "toshi-primary": "#002733",
        "toshi-primary-lighter": "#1a3d48",
        "toshi-green": "#008060",
      },
      screens: {
        xs: "420px",
        "3xl": "2048px",
      },
      maxWidth: {
        ss: "12rem",
        xxs: "16rem",
        standard: "2048px",
        "full-with-side-nav": "calc(100% - 13rem)",
      },
      fontFamily: {
        sans: ["Source\\ Sans\\ 3", ...defaultTheme.fontFamily.sans],
      },
      flexBasis: {
        "1/7": "14.285714%",
      },
      padding: {
        "navbar-mobile": "8.75rem",
        "navbar-desktop": "4.25rem",
        "secondary-navbar": "13rem",
      },
      margin: {
        "navbar-mobile": "8.75rem",
        "navbar-desktop": "4.25rem",
        "secondary-navbar": "13rem",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
