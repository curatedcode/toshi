import { type Config } from "tailwindcss";

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
    },
  },
  plugins: [],
} satisfies Config;
