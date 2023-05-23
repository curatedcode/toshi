import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "toshi-red": "#a91101",
      },
      screens: {
        xs: "420px",
      },
      maxWidth: {
        standard: "1800px",
      },
      fontFamily: {
        sans: ["Source\\ Sans\\ 3", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
